import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@pymetracker/db/create-client";
import { suscripciones } from "@pymetracker/db/schema";
import { eq, and, or, gt } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function getUsuarioFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as number,
      email: payload.email as string,
      nombre: payload.nombre as string,
      rol: payload.rol as string,
      empresaId: payload.empresaId as number | null,
      planActivo: payload.planActivo as boolean,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  return usuario;
}

export async function tieneAccesoValido(usuarioId: number) {
  try {
    const [suscripcion] = await db
      .select()
      .from(suscripciones)
      .where(
        and(
          eq(suscripciones.usuarioId, usuarioId),
          or(
            eq(suscripciones.estado, "activa"),
            eq(suscripciones.estado, "cancelada"),
          ),
          gt(suscripciones.fechaFin, new Date()),
        ),
      )
      .limit(1);

    return !!suscripcion;
  } catch {
    return false;
  }
}
