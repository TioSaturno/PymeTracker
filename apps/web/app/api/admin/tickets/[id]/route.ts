import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { tickets } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (usuario.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.status) updateData.status = body.status;
    if (body.respuesta !== undefined) {
      updateData.respuesta = body.respuesta;
      updateData.respondidoPor = usuario.id;
      updateData.fechaRespuesta = new Date();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    const [actualizado] = await db
      .update(tickets)
      .set(updateData)
      .where(eq(tickets.id, parseInt(id)))
      .returning();

    return NextResponse.json({ data: actualizado });
  } catch (error) {
    console.error("[PATCH /api/admin/tickets/:id]", error);
    return NextResponse.json({ error: "Error al actualizar ticket" }, { status: 500 });
  }
}
