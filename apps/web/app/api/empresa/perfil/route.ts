import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { empresas, tiendas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const usuarioAuth = await requireAuth(request);
    if (usuarioAuth instanceof NextResponse) return usuarioAuth;

    const body = await request.json();
    const { nombre, rubro, rut, direccion, comuna, telefono } = body;

    if (!nombre)
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    const [nuevaEmpresa] = await db
      .insert(empresas)
      .values({ nombre, rubro, rut, direccion, comuna, telefono })
      .returning();

    // Linkear via tabla puente (ya no se toca la tabla usuarios)
    await db.insert(usuarioEmpresas).values({
      usuarioId: usuarioAuth.id,
      empresaId: nuevaEmpresa.id,
      rol: "admin",
    });

    return NextResponse.json({ data: nuevaEmpresa });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear empresa" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaActivaId) {
      return NextResponse.json({ error: "No tienes empresa que editar" }, { status: 400 });
    }

    const body = await request.json();
    const { nombre, rubro, rut, direccion, comuna, telefono } = body;

    const [empresaActualizada] = await db
      .update(empresas)
      .set({ nombre, rubro, rut, direccion, comuna, telefono })
      .where(eq(empresas.id, usuario.empresaActivaId))
      .returning();

    return NextResponse.json({ data: empresaActualizada });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaActivaId) return NextResponse.json({ data: null });

    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, usuario.empresaActivaId))
      .limit(1);

    const tiendasList = await db
      .select()
      .from(tiendas)
      .where(eq(tiendas.empresaId, usuario.empresaActivaId));

    return NextResponse.json({ data: { ...empresa, tiendas: tiendasList, tiendaActivaId: usuario.tiendaActivaId } });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar empresa" }, { status: 500 });
  }
}