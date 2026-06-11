import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (usuario.rol === "admin") {
      // Admin ve todos los usuarios
      const result = await db
        .select({
          id: usuarios.id,
          nombre: usuarios.nombre,
          email: usuarios.email,
          rol: usuarios.rol,
          fechaCreacion: usuarios.fechaCreacion,
        })
        .from(usuarios);

      return NextResponse.json({ data: result });
    } else {
      // Usuario normal solo ve su propia info
      const [result] = await db
        .select({
          id: usuarios.id,
          nombre: usuarios.nombre,
          email: usuarios.email,
          rol: usuarios.rol,
          fechaCreacion: usuarios.fechaCreacion,
        })
        .from(usuarios)
        .where(eq(usuarios.id, usuario.id))
        .limit(1);

      return NextResponse.json({ data: result });
    }
  } catch (error) {
    console.error("[GET /api/usuarios]", error);
    return NextResponse.json(
      { error: "Error al consultar usuarios" },
      { status: 500 }
    );
  }
}