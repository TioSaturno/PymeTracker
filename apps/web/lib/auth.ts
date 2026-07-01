import { NextRequest } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { suscripciones } from "@pymetracker/db/schema";
import { eq, and, or, gt } from "drizzle-orm";
import { getUsuarioFromRequest, requireAuth } from "./auth-edge";

export { getUsuarioFromRequest, requireAuth };

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
