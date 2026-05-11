import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis } from "@pymetracker/db/schema";
import { desc } from "drizzle-orm";

interface Busqueda {
  tema: string;
  ubicacion: string;
}

interface Calificaciones {
  rating: number;
  total_resenas: number;
  ultimas_resenas: string[];
  rango_precio_gmaps: string;
}

interface Precio {
  producto: string;
  precio: number;
  imagen_url: string | null;
}

interface Empresa {
  id: number;
  nombre: string;
  precios: Precio[] | null;
  sitio_web: string | null;
  ubicacion: string;
  calificaciones: Calificaciones;
  google_maps_url: string;
}

interface AnalisisTiendaBase {
  nombre: string;
  ubicacion: string;
  calificaciones?: Calificaciones;
}

interface PayloadData {
  fecha: string;
  busqueda: Busqueda;
  empresas: Empresa[];
  mas_valorado: string | null;
  mas_criticado: string | null;
  analisis_tienda_base: AnalisisTiendaBase | null;
  total_empresas: number;
}

interface Execution {
  id: number;
  fechaEjecucion: Date | null;
  status: string | null;
  summary: string;
  payload: PayloadData;
}

export async function GET(request: NextRequest) {
  try {
    const result = await db
      .select()
      .from(analisis)
      .orderBy(desc(analisis.fechaEjecucion))
      .limit(8);

    const executions: Execution[] = result.map((exec) => {
      const payload = exec.payloadData as PayloadData;
      let summary = "Análisis sin datos";

      if (payload?.busqueda) {
        const { tema, ubicacion } = payload.busqueda;
        const count = payload.empresas?.length || 0;
        summary = `${tema} en ${ubicacion} - ${count} competidores`;
      }

      return {
        id: exec.id,
        fechaEjecucion: exec.fechaEjecucion,
        status: exec.status,
        summary,
        payload,
      };
    });

    return NextResponse.json({ data: executions });
  } catch (error) {
    console.error("[GET /api/analisis/historial]", error);
    return NextResponse.json(
      { error: "Error al obtener el historial" },
      { status: 500 }
    );
  }
}