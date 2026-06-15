import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis, tiendas, empresas } from "@pymetracker/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.tiendaActivaId) {
      return NextResponse.json({ error: "No tienes una tienda/sucursal activa" }, { status: 400 });
    }

    // Validar que la tienda activa existe y obtener empresa
    const [tienda] = await db
      .select({ id: tiendas.id, empresaId: tiendas.empresaId })
      .from(tiendas)
      .where(eq(tiendas.id, usuario.tiendaActivaId))
      .limit(1);

    if (!tienda || !tienda.empresaId) {
      return NextResponse.json({ error: "La tienda activa no existe" }, { status: 400 });
    }

    // Obtener nombre de la empresa para filtrar "mi negocio" vs competidores
    const [empresa] = await db
      .select({ nombre: empresas.nombre })
      .from(empresas)
      .where(eq(empresas.id, tienda.empresaId))
      .limit(1);
    const nombreEmpresaActiva = empresa?.nombre ?? null;

    // Último análisis completado para esta tienda
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
          eq(analisis.tiendaId, usuario.tiendaActivaId),
          eq(analisis.usuarioId, usuario.id),
          eq(analisis.status, "completed"),
        ),
      )
      .orderBy(desc(analisis.fechaEjecucion))
      .limit(1);

    if (!latest) {
      return NextResponse.json({ empresas: [], total: 0, miNegocio: null });
    }

    const payload = latest.payload as {
      empresas: Array<Record<string, unknown>>;
      busqueda: { tema: string; ubicacion: string };
      fecha: string;
      total_empresas: number;
      mas_valorado: string | null;
      mas_criticado: string | null;
      analisis_tienda_base: {
        comparacion_precios: string;
        comparacion_general: string;
        conclusion: string;
      } | null;
    };

    const todasEmpresas = payload.empresas ?? [];
    const nombreEmpresa = nombreEmpresaActiva?.toLowerCase().trim() ?? null;

    const miNegocio = nombreEmpresa
      ? todasEmpresas.find((e) => {
          const nombreEnPayload = String(e.nombre ?? "").toLowerCase().trim();
          return (
            nombreEnPayload === nombreEmpresa ||
            nombreEnPayload.includes(nombreEmpresa) ||
            nombreEmpresa.includes(nombreEnPayload)
          );
        })
      : null;

    const competidores = todasEmpresas
      .filter((e) => {
        if (!nombreEmpresa) return true;
        const nombreEnPayload = String(e.nombre ?? "").toLowerCase().trim();
        return (
          nombreEnPayload !== nombreEmpresa &&
          !nombreEnPayload.includes(nombreEmpresa) &&
          !nombreEmpresa.includes(nombreEnPayload)
        );
      })
      .map((empresa) => ({
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
      miNegocio: miNegocio
        ? {
            ...miNegocio,
            analisis_tienda_base: payload.analisis_tienda_base,
          }
        : null,
      masValorado: payload.mas_valorado,
      masCriticado: payload.mas_criticado,
      busqueda: payload.busqueda,
      fechaAnalisis: latest.fechaEjecucion,
    });
  } catch (error) {
    console.error("Error fetching competencia:", error);
    return NextResponse.json(
      { error: "Error al cargar competencia" },
      { status: 500 },
    );
  }
}
