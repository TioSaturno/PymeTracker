import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios, empresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, password, empresaNombre, empresaRubro } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y password son requeridos" },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let empresaId: number | null = null;

    if (empresaNombre) {
      const [nuevaEmpresa] = await db
        .insert(empresas)
        .values({
          nombre: empresaNombre,
          rubro: empresaRubro || null,
        })
        .returning();

      empresaId = nuevaEmpresa.id;
    }

    const [nuevoUsuario] = await db
      .insert(usuarios)
      .values({
        nombre,
        email,
        passwordHash,
        empresaId,
      })
      .returning();

    const token = jwt.sign(
      {
        id: nuevoUsuario.id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        empresaId: nuevoUsuario.empresaId,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        data: {
          usuario: {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol,
            empresaId: nuevoUsuario.empresaId,
          },
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/registro]", error);
    return NextResponse.json(
      { error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
