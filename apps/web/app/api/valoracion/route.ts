import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis } from "@pymetracker/db/schema";
import { desc, eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const usuario = await requireAuth(request);
        if (usuario instanceof NextResponse) return usuario;

        const ejecuciones = await db.select()
            .from(analisis)
            .where(eq(analisis.usuarioId, usuario.id))
            .orderBy(desc(analisis.fechaEjecucion))
            .limit(1);

        if (ejecuciones.length === 0) {
            return NextResponse.json({ error: "No hay análisis disponibles para este usuario" }, { status: 404 });
        }

        const datosDelReporte = ejecuciones[0].payloadData as any; // eslint-disable-line @typescript-eslint/no-explicit-any

        const miEmpresa = datosDelReporte.empresas[0];
        const competidores = datosDelReporte.empresas.slice(1);
        
        return NextResponse.json({
            data: {
                fecha_analisis: ejecuciones[0].fechaEjecucion,
                mi_negocio: miEmpresa,
                competencia: competidores,
                mas_valorado: datosDelReporte.mas_valorado,
                mas_criticado: datosDelReporte.mas_criticado
            }
        });

    } catch (error) {
        console.error("[GET /api/valoracion]", error);
        return NextResponse.json(
            { error: "Error al extraer el análisis" },
            { status: 500 }
        );
    }
}