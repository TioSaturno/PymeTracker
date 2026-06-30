import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { suscripciones } from "@pymetracker/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { getUsuarioFromRequest } from "@/lib/auth";
import * as flow from "@/lib/flow";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
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
          eq(suscripciones.estado, "activa"),
          gt(suscripciones.fechaFin, new Date()),
        ),
      )
      .limit(1);

    if (!suscripcion) {
      return NextResponse.json(
        { error: "No tienes una suscripción activa" },
        { status: 404 },
      );
    }

    let flowCancelled = false;
    if (suscripcion.referenciaPago) {
      try {
        await flow.cancelSubscription(suscripcion.referenciaPago, 1);
        flowCancelled = true;
      } catch (err) {
        console.warn(
          `[Cancelar] Error cancelando en Flow: ${err instanceof Error ? err.message : err}`,
        );
      }
    }

    const [cancelada] = await db
      .update(suscripciones)
      .set({
        estado: "cancelada",
        fechaCancelacion: new Date(),
      })
      .where(eq(suscripciones.id, suscripcion.id))
      .returning();

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        nombre: (usuario as any).nombre,
        rol: usuario.rol,
        empresaActivaId: usuario.empresaActivaId,
        planActivo: true,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({
      data: cancelada,
      message: "Suscripción cancelada. Seguirá activa hasta el final del período.",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/suscripcion/cancelar]", error);
    return NextResponse.json(
      { error: "Error al cancelar suscripción" },
      { status: 500 },
    );
  }
}
