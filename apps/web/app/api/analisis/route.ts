import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis, empresas, tiendas } from "@pymetracker/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    let body: { nResults?: number } = {};
    try { body = await request.json(); } catch { }
    const nResults = body.nResults || 1;

    if (!usuario.empresaActivaId) {
      return NextResponse.json({ error: "El usuario no tiene una empresa activa" }, { status: 400 });
    }

    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, usuario.empresaActivaId))
      .limit(1);

    if (!empresa) {
      return NextResponse.json({ error: "Empresa no encontrada" }, { status: 404 });
    }

    if (!empresa.rubro) {
      return NextResponse.json({ error: "Debes completar el rubro de tu empresa antes de ejecutar un análisis" }, { status: 400 });
    }

    if (!usuario.tiendaActivaId) {
      return NextResponse.json({ error: "No hay una tienda/sucursal activa para ejecutar el análisis" }, { status: 400 });
    }

    const [tienda] = await db
      .select()
      .from(tiendas)
      .where(eq(tiendas.id, usuario.tiendaActivaId))
      .limit(1);

    if (!tienda) {
      return NextResponse.json({ error: "Tienda/sucursal activa no encontrada" }, { status: 404 });
    }

    if (!tienda.direccion && !empresa.direccion && !empresa.comuna) {
      return NextResponse.json({ error: "Debes completar la dirección de la sucursal o de tu empresa antes de ejecutar un análisis" }, { status: 400 });
    }

    const [nuevoAnalisis] = await db
      .insert(analisis)
      .values({
        tiendaId: usuario.tiendaActivaId,
        usuarioId: usuario.id,
        status: "pending",
        payloadData: {},
      })
      .returning();

    const scrapingUrl = process.env.SCRAPING_SERVICE_URL || "http://localhost:8080";
    fetch(`${scrapingUrl}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analisisId: nuevoAnalisis.id,
        topic: empresa.rubro,
        location: tienda.direccion || empresa.comuna || empresa.direccion || "",
        tiendaBase: tienda.nombre,
        nResults,
      }),
    }).catch((err) => {
      console.error("[POST /api/analisis] Error llamando al scraping service:", err);
      db.update(analisis).set({ status: "failed" }).where(eq(analisis.id, nuevoAnalisis.id));
    });

    return NextResponse.json({ analisisId: nuevoAnalisis.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/analisis]", error);
    return NextResponse.json({ error: "Error al ejecutar análisis" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const { searchParams } = new URL(request.url);
    const tiendaId = searchParams.get("tiendaId");

    const result = await db
      .select()
      .from(analisis)
      .where(
        tiendaId
          ? and(eq(analisis.usuarioId, usuario.id), eq(analisis.tiendaId, parseInt(tiendaId)))
          : eq(analisis.usuarioId, usuario.id),
      );

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/analisis]", error);
    return NextResponse.json({ error: "Error al consultar análisis" }, { status: 500 });
  }
}