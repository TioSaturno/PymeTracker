import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis } from "@pymetracker/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const usuario = requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const body = await request.json();
    const { tiendaId, payloadData, status } = body;

    if (!tiendaId || !payloadData) {
      return NextResponse.json(
        { error: "tiendaId y payloadData son requeridos" },
        { status: 400 }
      );
    }

    const [nuevoAnalisis] = await db
      .insert(analisis)
      .values({
        tiendaId,
        usuarioId: usuario.id,
        payloadData,
        status: status || "completed",
      })
      .returning();

    return NextResponse.json(
      { data: nuevoAnalisis },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/analisis]", error);
    return NextResponse.json(
      { error: "Error al ejecutar análisis" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const { searchParams } = new URL(request.url);
    const tiendaId = searchParams.get("tiendaId");

    const result = await db
      .select()
      .from(analisis)
      .where(
        tiendaId
          ? and(eq(analisis.usuarioId, usuario.id), eq(analisis.tiendaId, parseInt(tiendaId)))
          : eq(analisis.usuarioId, usuario.id)
      );

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/analisis]", error);
    return NextResponse.json(
      { error: "Error al consultar análisis" },
      { status: 500 }
    );
  }
}
