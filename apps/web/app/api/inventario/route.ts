
import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { inventarios, tiendas } from "@pymetracker/db/schema";
import { eq, and, ilike, or } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const { searchParams } = new URL(request.url);
    const tiendaIdParam = searchParams.get("tiendaId");
    const categoria = searchParams.get("categoria");
    const q = searchParams.get("q");

   
    let tiendaId: number | null = tiendaIdParam ? parseInt(tiendaIdParam) : null;

    if (!tiendaId && usuario.empresaId) {
      const [firstTienda] = await db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, usuario.empresaId))
        .limit(1);
      if (firstTienda) tiendaId = firstTienda.id;
    }

    if (!tiendaId) {
      return NextResponse.json(
        { error: "No se encontró una tienda asociada" },
        { status: 400 }
      );
    }

    
    const condiciones = [eq(inventarios.tiendaId, tiendaId)];

    if (categoria) {
      condiciones.push(eq(inventarios.categoria, categoria));
    }

    if (q) {
      
      condiciones.push(ilike(inventarios.nombre, `%${q}%`));
    }

    const items = await db
      .select()
      .from(inventarios)
      .where(and(...condiciones))
      .orderBy(inventarios.fechaAgregado);

    
    const totalProductos = items.length;
    const valorInventario = items.reduce((sum, i) => sum + i.precio, 0);
    const categorias = [...new Set(items.map((i) => i.categoria))];

    return NextResponse.json({
      data: items,
      meta: {
        totalProductos,
        valorInventario,
        totalCategorias: categorias.length,
        categorias,
      },
    });
  } catch (error) {
    console.error("[GET /api/inventario]", error);
    return NextResponse.json(
      { error: "Error al obtener inventario" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const body = await request.json();
    const { nombre, categoria, precio, tiendaId: bodyTiendaId } = body;

    
    if (!nombre || !nombre.trim()) {
      return NextResponse.json(
        { error: "El nombre del producto es requerido" },
        { status: 400 }
      );
    }
    if (!categoria || !categoria.trim()) {
      return NextResponse.json(
        { error: "La categoría es requerida" },
        { status: 400 }
      );
    }
    if (precio === undefined || precio === null || isNaN(Number(precio))) {
      return NextResponse.json(
        { error: "El precio es requerido y debe ser un número" },
        { status: 400 }
      );
    }
    if (Number(precio) < 0) {
      return NextResponse.json(
        { error: "El precio no puede ser negativo" },
        { status: 400 }
      );
    }

    
    let tiendaId: number | null = bodyTiendaId ? parseInt(bodyTiendaId) : null;

    if (!tiendaId && usuario.empresaId) {
      const [firstTienda] = await db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, usuario.empresaId))
        .limit(1);
      if (firstTienda) tiendaId = firstTienda.id;
    }

    if (!tiendaId) {
      return NextResponse.json(
        { error: "No se encontró una tienda asociada para crear el producto" },
        { status: 400 }
      );
    }

    const [nuevoItem] = await db
      .insert(inventarios)
      .values({
        tiendaId,
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        precio: Math.round(Number(precio)),
      })
      .returning();

    return NextResponse.json({ data: nuevoItem }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/inventario]", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}