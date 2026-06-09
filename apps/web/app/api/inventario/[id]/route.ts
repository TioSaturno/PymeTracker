import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { inventarios, tiendas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
 

async function verificarPropiedad(
  inventarioId: number,
  empresaId: number
): Promise<boolean> {
  const [item] = await db
    .select({
      tiendaEmpresaId: tiendas.empresaId,
    })
    .from(inventarios)
    .innerJoin(tiendas, eq(inventarios.tiendaId, tiendas.id))
    .where(eq(inventarios.id, inventarioId))
    .limit(1);
 
  return item?.tiendaEmpresaId === empresaId;
}
 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;
 
    const { id } = await params;
    const itemId = parseInt(id);
 
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
 
    const [item] = await db
      .select()
      .from(inventarios)
      .where(eq(inventarios.id, itemId))
      .limit(1);
 
    if (!item) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
 
    
    if (usuario.empresaId) {
      const esPropietario = await verificarPropiedad(itemId, usuario.empresaId);
      if (!esPropietario) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }
 
    return NextResponse.json({ data: item });
  } catch (error) {
    console.error("[GET /api/inventario/:id]", error);
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}
 

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;
 
    const { id } = await params;
    const itemId = parseInt(id);
 
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
 
    
    const [itemExistente] = await db
      .select()
      .from(inventarios)
      .where(eq(inventarios.id, itemId))
      .limit(1);
 
    if (!itemExistente) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
 
    
    if (usuario.empresaId) {
      const esPropietario = await verificarPropiedad(itemId, usuario.empresaId);
      if (!esPropietario) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }
 
    const body = await request.json();
    const { nombre, categoria, precio, productoCodigo } = body;
 
    
    if (nombre !== undefined && !nombre.trim()) {
      return NextResponse.json(
        { error: "El nombre no puede estar vacío" },
        { status: 400 }
      );
    }
    if (categoria !== undefined && !categoria.trim()) {
      return NextResponse.json(
        { error: "La categoría no puede estar vacía" },
        { status: 400 }
      );
    }
    if (precio !== undefined && (isNaN(Number(precio)) || Number(precio) < 0)) {
      return NextResponse.json(
        { error: "El precio debe ser un número positivo" },
        { status: 400 }
      );
    }
 
    
    const camposActualizar: Partial<{
      nombre: string;
      categoria: string;
      precio: number;
      productoCodigo: string | null;
    }> = {};
 
    if (nombre !== undefined) camposActualizar.nombre = nombre.trim();
    if (categoria !== undefined) camposActualizar.categoria = categoria.trim();
    if (precio !== undefined) camposActualizar.precio = Math.round(Number(precio));
    if (productoCodigo !== undefined)
      camposActualizar.productoCodigo = productoCodigo?.trim() || null;
 
    const [itemActualizado] = await db
      .update(inventarios)
      .set(camposActualizar)
      .where(eq(inventarios.id, itemId))
      .returning();
 
    return NextResponse.json({ data: itemActualizado });
  } catch (error) {
    console.error("[PUT /api/inventario/:id]", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}
 

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;
 
    const { id } = await params;
    const itemId = parseInt(id);
 
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
 
    
    const [itemExistente] = await db
      .select()
      .from(inventarios)
      .where(eq(inventarios.id, itemId))
      .limit(1);
 
    if (!itemExistente) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
 
    
    if (usuario.empresaId) {
      const esPropietario = await verificarPropiedad(itemId, usuario.empresaId);
      if (!esPropietario) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }
 
    await db.delete(inventarios).where(eq(inventarios.id, itemId));
 
    return NextResponse.json({
      data: { id: itemId },
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("[DELETE /api/inventario/:id]", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}