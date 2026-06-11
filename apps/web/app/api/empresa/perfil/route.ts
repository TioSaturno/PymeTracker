import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { empresas, tiendas, usuarios } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

// --- POST: PARA CREAR (Tu /perfil) ---
export async function POST(request: NextRequest) {
  try {
    const usuarioAuth = await requireAuth(request);
    if (usuarioAuth instanceof NextResponse) return usuarioAuth;

    const body = await request.json();
    const { nombre, rubro, rut, direccion, comuna, telefono } = body;

    if (!nombre)
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    // 1. Crear la empresa
    const [nuevaEmpresa] = await db
      .insert(empresas)
      .values({
        nombre,
        rubro,
        rut,
        direccion,
        comuna,
        telefono,
      })
      .returning();

    // 2. Vincularla al usuario que está logueado
    await db
      .update(usuarios)
      .set({ empresaId: nuevaEmpresa.id })
      .where(eq(usuarios.id, usuarioAuth.id));

    return NextResponse.json({ data: nuevaEmpresa });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear empresa" },
      { status: 500 },
    );
  }
}

// --- PUT: PARA EDITAR (Tu /perfil/edit) ---
export async function PUT(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaId) {
      return NextResponse.json(
        { error: "No tienes empresa que editar" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { nombre, rubro, rut, direccion, comuna, telefono, diaSeleccionado } = body;

    const [empresaActualizada] = await db
      .update(empresas)
      .set({
        nombre,
        rubro,
        rut,
        direccion,
        comuna,
        telefono,
        diaSeleccionado,
      })
      .where(eq(empresas.id, usuario.empresaId))
      .returning();

    return NextResponse.json({ data: empresaActualizada });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// --- GET: PARA CARGAR DATOS ---
export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaId) return NextResponse.json({ data: null });

    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, usuario.empresaId))
      .limit(1);

    const tiendasList = await db
      .select()
      .from(tiendas)
      .where(eq(tiendas.empresaId, usuario.empresaId));

    return NextResponse.json({ data: { ...empresa, tiendas: tiendasList } });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar empresa" },
      { status: 500 },
    );
  }
}
