import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis, usuarios, tiendas, empresas } from "@pymetracker/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdmin(request);
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }

  try {
    const { searchParams } = new URL(request.url);
    const fechaDesde = searchParams.get("fechaDesde");
    const fechaHasta = searchParams.get("fechaHasta");
    const usuarioId = searchParams.get("usuarioId");
    const rubro = searchParams.get("rubro");

    const conditions = [];

    if (fechaDesde) {
      conditions.push(gte(analisis.fechaEjecucion, new Date(fechaDesde)));
    }

    if (fechaHasta) {
      const hastaDate = new Date(fechaHasta);
      hastaDate.setHours(23, 59, 59, 999);
      conditions.push(lte(analisis.fechaEjecucion, hastaDate));
    }

    if (usuarioId) {
      conditions.push(eq(analisis.usuarioId, parseInt(usuarioId)));
    }

    if (rubro) {
      conditions.push(eq(empresas.rubro, rubro));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: analisis.id,
        status: analisis.status,
        fechaEjecucion: analisis.fechaEjecucion,
        usuarioNombre: usuarios.nombre,
        tiendaNombre: tiendas.nombre,
        empresaNombre: empresas.nombre,
        empresaRubro: empresas.rubro,
      })
      .from(analisis)
      .leftJoin(usuarios, eq(analisis.usuarioId, usuarios.id))
      .leftJoin(tiendas, eq(analisis.tiendaId, tiendas.id))
      .leftJoin(empresas, eq(tiendas.empresaId, empresas.id))
      .where(whereClause)
      .orderBy(desc(analisis.fechaEjecucion));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/admin/ejecuciones]", error);
    return NextResponse.json(
      { error: "Error al obtener las ejecuciones" },
      { status: 500 }
    );
  }
}
