import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { empresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaId) {
      return NextResponse.json(
        { error: "El usuario no tiene una empresa asociada" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nombre, rubro } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre de la empresa es requerido" },
        { status: 400 }
      );
    }

    const result = await db
      .update(empresas)
      .set({
        nombre,
        rubro: rubro ?? undefined,
      })
      .where(eq(empresas.id, usuario.empresaId))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error("[PUT /api/empresa/perfil]", error);
    return NextResponse.json(
      { error: "Error al actualizar perfil de empresa" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaId) {
      return NextResponse.json(
        { error: "El usuario no tiene una empresa asociada" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, usuario.empresaId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result[0] });
  } catch (error) {
    console.error("[GET /api/empresa/perfil]", error);
    return NextResponse.json(
      { error: "Error al obtener perfil de empresa" },
      { status: 500 }
    );
  }
}
