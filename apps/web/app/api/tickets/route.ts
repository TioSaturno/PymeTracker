import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { tickets } from "@pymetracker/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const { asunto, descripcion, prioridad } = await request.json();

    if (!asunto || !descripcion) {
      return NextResponse.json(
        { error: "Asunto y descripción son requeridos" },
        { status: 400 }
      );
    }

    const [nuevoTicket] = await db
      .insert(tickets)
      .values({
        usuarioId: usuario.id,
        empresaId: usuario.empresaActivaId,
        asunto,
        descripcion,
        prioridad: prioridad ?? "media",
        status: "abierto",
      })
      .returning();

    return NextResponse.json({ data: nuevoTicket }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/tickets]", error);
    return NextResponse.json({ error: "Error al crear ticket" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    // Admin ve todos, usuario ve solo los suyos
    const result = await db
      .select()
      .from(tickets)
      .where(usuario.rol === "admin" ? undefined : eq(tickets.usuarioId, usuario.id))
      .orderBy(desc(tickets.fechaCreacion));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/tickets]", error);
    return NextResponse.json({ error: "Error al cargar tickets" }, { status: 500 });
  }
}