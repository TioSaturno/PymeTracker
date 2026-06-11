import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { tiendas } from "@pymetracker/db/schema";
import { eq, and } from "drizzle-orm";
import { getUsuarioFromRequest } from "@/lib/auth";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const usuario = await getUsuarioFromRequest(request);
    if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { tiendaId } = await request.json();

    const [tienda] = await db
      .select()
      .from(tiendas)
      .where(and(eq(tiendas.id, tiendaId), eq(tiendas.empresaId, usuario.empresaActivaId!)))
      .limit(1);

    if (!tienda) {
      return NextResponse.json({ error: "Sucursal no encontrada" }, { status: 404 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const nuevoToken = await new SignJWT({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empresaActivaId: usuario.empresaActivaId,
      tiendaActivaId: tiendaId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ ok: true, tiendaActivaId: tiendaId });
    response.cookies.set("token", nuevoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("[POST /api/sucursales/switch]", error);
    return NextResponse.json({ error: "Error al cambiar sucursal" }, { status: 500 });
  }
}