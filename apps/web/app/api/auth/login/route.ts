import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios, tiendas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { tieneAccesoValido } from "@/lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y password son requeridos" }, { status: 400 });
    }

    const result = await db.select().from(usuarios).where(eq(usuarios.email, email)).limit(1);
    if (result.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const usuario = result[0];
    const passwordValid = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    const planActivo = await tieneAccesoValido(usuario.id);

    // Buscar empresas del usuario y tomar la primera como activa
    const misEmpresas = await db
      .select({ empresaId: usuarioEmpresas.empresaId })
      .from(usuarioEmpresas)
      .where(eq(usuarioEmpresas.usuarioId, usuario.id));

    const empresaActivaId = misEmpresas[0]?.empresaId ?? null;

    // Buscar primera tienda de la empresa activa
    let tiendaActivaId: number | null = null;
    if (empresaActivaId) {
      const [primeraTienda] = await db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, empresaActivaId))
        .limit(1);
      tiendaActivaId = primeraTienda?.id ?? null;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      empresaActivaId,
      tiendaActivaId,
      planActivo,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json({
      data: {
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          empresaActivaId,
          tiendaActivaId,
          planActivo,
        },
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}