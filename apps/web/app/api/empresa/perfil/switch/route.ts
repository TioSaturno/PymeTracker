import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarioEmpresas } from "@pymetracker/db/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const payload = jwt.verify(token, JWT_SECRET) as { id: number; email: string; rol: string };
    const { empresaId } = await request.json();

    // Verificar que el usuario realmente pertenece a esa empresa
    const pertenece = await db
      .select()
      .from(usuarioEmpresas)
      .where(and(eq(usuarioEmpresas.usuarioId, payload.id), eq(usuarioEmpresas.empresaId, empresaId)))
      .limit(1);

    if (pertenece.length === 0) {
      return NextResponse.json({ error: "No tienes acceso a esta empresa" }, { status: 403 });
    }

    // Emitir nuevo token con la empresa activa actualizada
    const nuevoToken = jwt.sign(
      { id: payload.id, email: payload.email, rol: payload.rol, empresaActivaId: empresaId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ ok: true, empresaActivaId: empresaId });
    response.cookies.set("token", nuevoToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 7 * 24 * 60 * 60, path: "/" });
    return response;
  } catch (error) {
    console.error("[POST /api/empresas/switch]", error);
    return NextResponse.json({ error: "Error al cambiar empresa" }, { status: 500 });
  }
}