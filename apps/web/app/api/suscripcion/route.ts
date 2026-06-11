import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios, suscripciones } from "@pymetracker/db/schema";
import { eq, and, or, gt, desc } from "drizzle-orm";
import { getUsuarioFromRequest } from "@/lib/auth";
import * as flow from "@/lib/flow";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

const FLOW_PLAN_ID = "pymetracker_premium";

function makeToken(usuario: Record<string, unknown>) {
  return jwt.sign(usuario, JWT_SECRET, { expiresIn: "7d" });
}

function setCookie(response: NextResponse, token: string) {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

async function sincronizarConFlow(
  suscripcion: {
    id: number;
    referenciaPago: string | null;
    estado: string;
    fechaFin: Date | null;
  },
) {
  if (!suscripcion.referenciaPago) return;

  try {
    const flowSub = await flow.getSubscription(suscripcion.referenciaPago);

    const flowEstaActiva = flowSub.status === 1;
    const flowCancelada = flowSub.cancel_at_period_end === 1 || flowSub.status === 0;

    if (flowCancelada && suscripcion.estado === "activa") {
      await db
        .update(suscripciones)
        .set({
          estado: "cancelada",
          fechaCancelacion: new Date(),
        })
        .where(eq(suscripciones.id, suscripcion.id));
    } else if (!flowEstaActiva && suscripcion.estado === "activa") {
      await db
        .update(suscripciones)
        .set({ estado: "expirada" })
        .where(eq(suscripciones.id, suscripcion.id));
    }
  } catch {
    console.warn(
      `[Sincronizar] Error consultando Flow para sub ${suscripcion.referenciaPago}`,
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = await getUsuarioFromRequest(request);
    if (!usuario) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const [suscripcion] = await db
      .select()
      .from(suscripciones)
      .where(
        and(
          eq(suscripciones.usuarioId, usuario.id as number),
          or(
            eq(suscripciones.estado, "activa"),
            eq(suscripciones.estado, "cancelada"),
          ),
          gt(suscripciones.fechaFin, new Date()),
        ),
      )
      .orderBy(desc(suscripciones.fechaInicio))
      .limit(1);

    if (suscripcion?.referenciaPago) {
      await sincronizarConFlow(suscripcion);
    }

    const tieneAcceso = !!suscripcion;
    const response = NextResponse.json({ data: suscripcion || null });

    if (tieneAcceso && !usuario.planActivo) {
      const token = makeToken({ ...usuario, planActivo: true });
      setCookie(response, token);
    }

    return response;
  } catch (error) {
    console.error("[GET /api/suscripcion]", error);
    return NextResponse.json(
      { error: "Error al consultar suscripción" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const usuario = await getUsuarioFromRequest(request);
    if (!usuario) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const existing = await db
      .select()
      .from(suscripciones)
      .where(
        and(
          eq(suscripciones.usuarioId, usuario.id as number),
          eq(suscripciones.estado, "activa"),
          gt(suscripciones.fechaFin, new Date()),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      const response = NextResponse.json(
        { data: existing[0], message: "Ya tienes una suscripción activa." },
        { status: 200 },
      );
      setCookie(response, makeToken({ ...usuario, planActivo: true }));
      return response;
    }

    const [userRow] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, usuario.id as number))
      .limit(1);

    if (!userRow) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    let flowCustomerId = userRow.flowCustomerId;

    if (!flowCustomerId) {
      console.log("[DEBUG] createCustomer payload:", {
        name: userRow.nombre,
        email: userRow.email,
        externalId: String(userRow.id),
      });
      const customer = await flow.createCustomer(
        userRow.nombre,
        userRow.email,
        String(userRow.id),
      );

      flowCustomerId = customer.customerId;

      await db
        .update(usuarios)
        .set({ flowCustomerId })
        .where(eq(usuarios.id, userRow.id));
    }

    let flowSub: flow.FlowSubscription;
    try {
      flowSub = await flow.createSubscription(FLOW_PLAN_ID, flowCustomerId);
    } catch {
      await flow.ensurePlan(FLOW_PLAN_ID, "Plan Premium", 500);
      flowSub = await flow.createSubscription(FLOW_PLAN_ID, flowCustomerId);
    }

    const ahora = new Date();
    const fechaFin = new Date(ahora);
    fechaFin.setMonth(fechaFin.getMonth() + 1);

    const [nuevaSuscripcion] = await db
      .insert(suscripciones)
      .values({
        usuarioId: usuario.id as number,
        plan: "premium",
        precio: 50000,
        moneda: "CLP",
        estado: "activa",
        fechaInicio: ahora,
        fechaFin,
        metodoPago: "flow",
        referenciaPago: flowSub.subscriptionId,
      })
      .returning();

    const response = NextResponse.json(
      {
        data: nuevaSuscripcion,
        flowSubscriptionId: flowSub.subscriptionId,
        message: "Suscripción creada exitosamente en Flow.",
      },
      { status: 201 },
    );

    setCookie(response, makeToken({ ...usuario, planActivo: true }));
    return response;
  } catch (error) {
    console.error("[POST /api/suscripcion]", error);
    const message =
      error instanceof Error ? error.message : "Error al crear suscripción";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
