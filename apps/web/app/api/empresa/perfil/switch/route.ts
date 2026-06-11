import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { tiendas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq, and } from "drizzle-orm";
import { jwtVerify } from "jose";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const secret = new TextEncoder().encode(JWT_SECRET);
    const result = await jwtVerify(token, secret);
    const { id, email, rol } = result.payload as unknown as { id: number; email: string; rol: string };
    const { empresaId: empresaActivaId } = await request.json();

    // Verificar que el usuario realmente pertenece a esa empresa
    const pertenece = await db
      .select()
      .from(usuarioEmpresas)
      .where(and(eq(usuarioEmpresas.usuarioId, id), eq(usuarioEmpresas.empresaId, empresaActivaId)))
      .limit(1);

    if (pertenece.length === 0) {
      return NextResponse.json({ error: "No tienes acceso a esta empresa" }, { status: 403 });
    }

    // Buscar primera tienda de la nueva empresa activa
    let tiendaActivaId: number | null = null;
    const [primeraTienda] = await db
      .select({ id: tiendas.id })
      .from(tiendas)
      .where(eq(tiendas.empresaId, empresaActivaId))
      .limit(1);
    tiendaActivaId = primeraTienda?.id ?? null;

    // Emitir nuevo token con la empresa activa actualizada
    const nuevoToken = await new SignJWT({
      id,
      email,
      rol,
      empresaActivaId,
      tiendaActivaId,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({ ok: true, empresaActivaId, tiendaActivaId });
    response.cookies.set("token", nuevoToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60, path: "/" });
    return response;
  } catch (error) {
    console.error("[POST /api/empresas/switch]", error);
    return NextResponse.json({ error: "Error al cambiar empresa" }, { status: 500 });
  }
}