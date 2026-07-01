import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { inventarios } from "@pymetracker/db/schema";
import { requireAuth } from "@/lib/auth";

interface ProductoCSV {
  nombre: string;
  categoria: string;
  precio: number;
}

export async function POST(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const tiendaId = usuario.tiendaActivaId;

    if (!tiendaId) {
      return NextResponse.json(
        { error: "No hay una tienda activa seleccionada" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { productos }: { productos: ProductoCSV[] } = body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return NextResponse.json(
        { error: "No se recibieron productos para importar" },
        { status: 400 }
      );
    }

    const validos: { tiendaId: number; nombre: string; categoria: string; precio: number }[] = [];
    const errores: string[] = [];

    for (let i = 0; i < productos.length; i++) {
      const p = productos[i];
      const linea = i + 1;
      const fallas: string[] = [];

      if (!p.nombre || !p.nombre.trim()) fallas.push("nombre requerido");
      if (!p.categoria || !p.categoria.trim()) fallas.push("categoria requerida");
      if (p.precio === undefined || p.precio === null || isNaN(Number(p.precio)) || Number(p.precio) < 0) {
        fallas.push("precio inválido");
      }

      if (fallas.length > 0) {
        errores.push(`Línea ${linea}: ${fallas.join(", ")}`);
      } else {
        validos.push({
          tiendaId,
          nombre: p.nombre.trim(),
          categoria: p.categoria.trim(),
          precio: Math.round(Number(p.precio)),
        });
      }
    }

    if (validos.length === 0) {
      return NextResponse.json(
        { error: "Ningún producto válido para importar", detalles: errores },
        { status: 400 }
      );
    }

    const insertados = await db.insert(inventarios).values(validos).returning();

    return NextResponse.json({
      data: { importados: insertados.length, omitidos: errores.length },
      errores: errores.length > 0 ? errores : undefined,
    });
  } catch (error) {
    console.error("[POST /api/inventario/importar]", error);
    return NextResponse.json(
      { error: "Error al importar productos" },
      { status: 500 }
    );
  }
}
