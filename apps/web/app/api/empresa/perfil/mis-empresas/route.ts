import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { empresas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    const result = await db
      .select({
        id: empresas.id,
        nombre: empresas.nombre,
        rubro: empresas.rubro,
        rut: empresas.rut,
      })
      .from(usuarioEmpresas)
      .innerJoin(empresas, eq(usuarioEmpresas.empresaId, empresas.id))
      .where(eq(usuarioEmpresas.usuarioId, usuario.id));

    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar empresas" }, { status: 500 });
  }
}