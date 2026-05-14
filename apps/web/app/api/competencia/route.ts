import { db } from "@pymeTracker/db/create-client";
import { analisis } from "@pymeTracker/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const tiendaId = searchParams.get("tiendaId");

  if (!userId || !tiendaId) {
    return Response.json(
      { error: "userId y tiendaId son requeridos" },
      { status: 400 },
    );
  }

  // Traemos todos los análisis que coincidan con la tienda y el usuario
  const rows = await db
    .select({
      analisisId: analisis.id,
      status: analisis.status,
      fechaEjecucion: analisis.fechaEjecucion,
      payload: analisis.payloadData,
    })
    .from(analisis)
    .where(
      and(
        eq(analisis.tiendaId, Number(tiendaId)),
        eq(analisis.usuarioId, Number(userId)),
      ),
    )
    .orderBy(analisis.fechaEjecucion);

  if (!rows.length) {
    return Response.json({ empresas: [], total: 0 });
  }

  // Aplanamos los arrays de empresas de cada payload en uno solo
  const empresas = rows.flatMap((row) => {
    const payload = row.payload as {
      empresas: Array<Record<string, unknown>>;
      busqueda: { tema: string; ubicacion: string };
      fecha: string;
      total_empresas: number;
      mas_valorado: string | null;
      mas_criticado: string | null;
    };

    // Enriquecemos cada empresa con metadata del análisis
    return (payload.empresas ?? []).map((empresa) => ({
      ...empresa,
      _meta: {
        analisisId: row.analisisId,
        status: row.status,
        fechaEjecucion: row.fechaEjecucion,
        busqueda: payload.busqueda,
        fecha: payload.fecha,
      },
    }));
  });

  return Response.json({
    empresas,
    total: empresas.length,
  });
}
