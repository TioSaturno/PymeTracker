import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createHash } from "node:crypto";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token y nueva contraseña son requeridos" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    const hashedToken = createHash("sha256").update(token).digest("hex");

    const [usuario] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.resetToken, hashedToken))
      .limit(1);

    if (!usuario) {
      return NextResponse.json(
        { error: "Enlace inválido o ya fue utilizado" },
        { status: 400 },
      );
    }

    if (!usuario.resetTokenExpires || new Date() > usuario.resetTokenExpires) {
      return NextResponse.json(
        { error: "El enlace ha expirado. Solicita uno nuevo." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db
      .update(usuarios)
      .set({
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      })
      .where(eq(usuarios.id, usuario.id));

    return NextResponse.json({
      message: "Contraseña actualizada exitosamente.",
    });
  } catch (error) {
    console.error("[POST /api/auth/reset-password]", error);
    return NextResponse.json(
      { error: "Error al restablecer la contraseña" },
      { status: 500 },
    );
  }
}
