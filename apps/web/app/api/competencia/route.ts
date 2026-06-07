import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis, tiendas, empresas } from "@pymetracker/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaId) {
      return NextResponse.json(
        { error: "No tienes una empresa asociada" },
        { status: 400 }
      );
    }

  
    const [empresaData, primerasTiendas] = await Promise.all([
      db
        .select({ nombre: empresas.nombre })
        .from(empresas)
        .where(eq(empresas.id, usuario.empresaId))
        .limit(1),
      db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, usuario.empresaId))
        .limit(1),
    ]);

    const empresa = empresaData[0];
    const tienda = primerasTiendas[0];

    if (!empresa || !tienda) {
      return NextResponse.json(
        { error: "No se encontró empresa o tienda asociada" },
        { status: 400 }
      );
    }

   
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
          eq(analisis.tiendaId, tienda.id),
          eq(analisis.usuarioId, usuario.id),
          eq(analisis.status, "completed")
        )
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

    
    const nombreEmpresa = empresa.nombre.toLowerCase().trim();

    const miNegocio = todasEmpresas.find((e) => {
      const nombreEnPayload = String(e.nombre ?? "").toLowerCase().trim();
      
      return (
        nombreEnPayload === nombreEmpresa ||
        nombreEnPayload.includes(nombreEmpresa) ||
        nombreEmpresa.includes(nombreEnPayload)
      );
    });

    const competidores = todasEmpresas
      .filter((e) => {
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
      { status: 500 }
    );
  }
}