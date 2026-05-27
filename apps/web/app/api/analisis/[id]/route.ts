import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const { id } = await params;
    const analisisId = parseInt(id);
    if (isNaN(analisisId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [record] = await db
      .select()
      .from(analisis)
      .where(eq(analisis.id, analisisId))
      .limit(1);

    if (!record) {
      return NextResponse.json(
        { error: "Análisis no encontrado" },
        { status: 404 },
      );
    }

    if (record.usuarioId !== usuario.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (record.status !== "completed") {
      return NextResponse.json({
        status: record.status,
        updatedAt: record.updatedAt,
      });
    }

    return NextResponse.json({
      status: record.status,
      payloadData: record.payloadData,
      updatedAt: record.updatedAt,
    });
  } catch (error) {
    console.error("[GET /api/analisis/:id]", error);
    return NextResponse.json(
      { error: "Error al consultar análisis" },
      { status: 500 },
    );
  }
}
