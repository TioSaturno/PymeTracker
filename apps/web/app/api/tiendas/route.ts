import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { tiendas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { getUsuarioFromRequest } from "@/lib/auth";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const usuario = await getUsuarioFromRequest(request);
    if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    if (!usuario.empresaId) {
      return NextResponse.json({ error: "Sin empresa asociada" }, { status: 400 });
    }

    const { nombre, direccion } = await request.json();
    if (!nombre) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    const [nuevaTienda] = await db
      .insert(tiendas)
      .values({ nombre, direccion, empresaId: usuario.empresaId })
      .returning();

    // Emitir nuevo token con la nueva tienda como activa
    const secret = new TextEncoder().encode(JWT_SECRET);
    const nuevoToken = await new SignJWT({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empresaId: usuario.empresaId,
      tiendaActivaId: nuevaTienda.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ data: nuevaTienda }, { status: 201 });
    response.cookies.set("token", nuevoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Error al crear sucursal" }, { status: 500 });
  }
}