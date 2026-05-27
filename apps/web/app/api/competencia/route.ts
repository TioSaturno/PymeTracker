import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymeTracker/db/create-client";
import { analisis, tiendas } from "@pymeTracker/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const { searchParams } = new URL(request.url);
    let tiendaId = searchParams.get("tiendaId");

    if (!tiendaId && usuario.empresaId) {
      const [firstTienda] = await db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, usuario.empresaId))
        .limit(1);
      if (firstTienda) tiendaId = String(firstTienda.id);
    }

    if (!tiendaId) {
      return NextResponse.json(
        { error: "No se encontró una tienda asociada" },
        { status: 400 },
      );
    }

    // Solo la última ejecución
    const [latest] = await db
      .select({
        id: analisis.id,
        status: analisis.status,
        fechaEjecucion: analisis.fechaEjecucion,
        payload: analisis.payloadData,
      })
      .from(analisis)
      .where(
        and(
          eq(analisis.tiendaId, Number(tiendaId)),
          eq(analisis.usuarioId, usuario.id),
          eq(analisis.status, "completed"),
        ),
      )
      .orderBy(desc(analisis.fechaEjecucion))
      .limit(1);

    if (!latest) {
      return NextResponse.json({ empresas: [], total: 0 });
    }

    const payload = latest.payload as {
      empresas: Array<Record<string, unknown>>;
      busqueda: { tema: string; ubicacion: string };
      fecha: string;
      total_empresas: number;
      mas_valorado: string | null;
      mas_criticado: string | null;
    };

    // Excluimos el primer elemento (negocio propio)
    const competidores = (payload.empresas ?? []).slice(1).map((empresa) => ({
      ...empresa,
      _meta: {
        analisisId: latest.id,
        status: latest.status,
        fechaEjecucion: latest.fechaEjecucion,
        busqueda: payload.busqueda,
        fecha: payload.fecha,
      },
    }));

    return NextResponse.json({
      empresas: competidores,
      total: competidores.length,
    });
  } catch (error) {
    console.error("Error fetching competencia:", error);
    return NextResponse.json(
      { error: "Error al cargar competencia" },
      { status: 500 },
    );
  }
}
