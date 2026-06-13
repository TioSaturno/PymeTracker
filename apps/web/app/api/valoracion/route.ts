
import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis, tiendas, empresas } from "@pymetracker/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";


type Calificaciones = {
  rating: number;
  total_resenas: number;
  ultimas_resenas: string[];
  rango_precio_gmaps: string;
};

type Precio = {
  producto: string;
  precio: number;
  imagen_url: string | null;
};

type EmpresaPayload = {
  id: number;
  nombre: string;
  calificaciones: Calificaciones;
  precios: Precio[] | null;
  sitio_web: string | null;
  ubicacion: string;
  google_maps_url: string;
  fortalezas?: string[];
  debilidades?: string[];
  resumen_opiniones?: string;
};

type PayloadData = {
  empresas: EmpresaPayload[];
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

function parsearChips(texto: string | null, max: number = 4): string[] {
  if (!texto) return [];
  return texto
    .split(/[.,](?:\s+y\s+|\s+)|[.,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
    .slice(0, max);
}

function armarResenas(
  miNegocio: EmpresaPayload | undefined,
  competidor: EmpresaPayload | undefined,
  max: number = 5
): { texto: string; esPropio: boolean; nombre: string }[] {
  const resultado: { texto: string; esPropio: boolean; nombre: string }[] = [];
  if (miNegocio) {
    (miNegocio.calificaciones.ultimas_resenas ?? [])
      .slice(0, max)
      .forEach((texto) =>
        resultado.push({ texto, esPropio: true, nombre: miNegocio.nombre })
      );
  }
  if (competidor) {
    (competidor.calificaciones.ultimas_resenas ?? [])
      .slice(0, max)
      .forEach((texto) =>
        resultado.push({ texto, esPropio: false, nombre: competidor.nombre })
      );
  }
  return resultado;
}


export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;
    if (!usuario.empresaActivaId) {
      return NextResponse.json(
        { error: "No tienes una empresa asociada" },
        { status: 400 }
      );
    }
    const { searchParams } = new URL(request.url);
    const competidorNombre = searchParams.get("competidorNombre");
    
    const [empresaData, primerasTiendas] = await Promise.all([
      db
        .select({ nombre: empresas.nombre })
        .from(empresas)
        .where(eq(empresas.id, usuario.empresaActivaId))
        .limit(1),
      db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, usuario.empresaActivaId))
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
      return NextResponse.json(
        { error: "No hay análisis disponibles para este usuario" },
        { status: 404 }
      );
    }
    const payload = latest.payload as PayloadData;
    const nombreEmpresa = empresa.nombre.toLowerCase().trim();
    
    const miNegocio = payload.empresas.find((e) => {
      const n = e.nombre.toLowerCase().trim();
      return (
        n === nombreEmpresa ||
        n.includes(nombreEmpresa) ||
        nombreEmpresa.includes(n)
      );
    });
    const todosCompetidores = payload.empresas.filter((e) => {
      const n = e.nombre.toLowerCase().trim();
      return (
        n !== nombreEmpresa &&
        !n.includes(nombreEmpresa) &&
        !nombreEmpresa.includes(n)
      );
    });


    
    
    const fortalezas_rubro = parsearChips(payload.mas_valorado, 4);
    const debilidades_rubro = parsearChips(payload.mas_criticado, 4);
   
    const competidores_disponibles = todosCompetidores.map((c) => ({
      nombre: c.nombre,
      rating: c.calificaciones.rating,
      total_resenas: c.calificaciones.total_resenas,
      ubicacion: c.ubicacion,
    }));
    
    const miNegocioResponse = miNegocio
      ? {
          nombre: miNegocio.nombre,
          rating: miNegocio.calificaciones.rating,
          total_resenas: miNegocio.calificaciones.total_resenas,
          rango_precio_gmaps: miNegocio.calificaciones.rango_precio_gmaps,
          ubicacion: miNegocio.ubicacion,
          fortalezas: miNegocio.fortalezas ?? [],
          debilidades: miNegocio.debilidades ?? [],
          resumen_opiniones: miNegocio.resumen_opiniones ?? "",
        }
      : null;
    
    if (!competidorNombre) {
      return NextResponse.json({
        fecha_analisis: latest.fechaEjecucion,
        mi_negocio: miNegocioResponse,
        competidor: null,
        competidores_disponibles,
        fortalezas_rubro,
        debilidades_rubro,
        analisis_tienda_base: payload.analisis_tienda_base,
        resenas: armarResenas(miNegocio, undefined),
      });
    }

    const competidorElegido = todosCompetidores.find((c) => {
      const n = c.nombre.toLowerCase().trim();
      const buscado = competidorNombre.toLowerCase().trim();
      return n === buscado || n.includes(buscado) || buscado.includes(n);
    });
    if (!competidorElegido) {
      return NextResponse.json(
        { error: `No se encontró el competidor "${competidorNombre}" en el análisis` },
        { status: 404 }
      );
    }

    const competidorResponse = {
      nombre: competidorElegido.nombre,
      rating: competidorElegido.calificaciones.rating,
      total_resenas: competidorElegido.calificaciones.total_resenas,
      rango_precio_gmaps: competidorElegido.calificaciones.rango_precio_gmaps,
      sitio_web: competidorElegido.sitio_web,
      ubicacion: competidorElegido.ubicacion,
      google_maps_url: competidorElegido.google_maps_url,
      fortalezas: competidorElegido.fortalezas ?? [],
      debilidades: competidorElegido.debilidades ?? [],
      resumen_opiniones: competidorElegido.resumen_opiniones ?? "",
    };
    return NextResponse.json({
      fecha_analisis: latest.fechaEjecucion,
      mi_negocio: miNegocioResponse,
      competidor: competidorResponse,
      competidores_disponibles,
      fortalezas_rubro,
      debilidades_rubro,
      analisis_tienda_base: payload.analisis_tienda_base,
      resenas: armarResenas(miNegocio, competidorElegido),
    });
  } catch (error) {
    console.error("[GET /api/valoracion]", error);
    return NextResponse.json(
      { error: "Error al extraer el análisis" },
      { status: 500 }
    );
  }
}