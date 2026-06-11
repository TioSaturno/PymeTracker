import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes, createHash } from "node:crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email es requerido" },
        { status: 400 },
      );
    }

    const [usuario] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    if (!usuario) {
      return NextResponse.json({
        message:
          "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
      });
    }

    const rawToken = randomBytes(32).toString("hex");
    const hashedToken = createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db
      .update(usuarios)
      .set({ resetToken: hashedToken, resetTokenExpires: expiresAt })
      .where(eq(usuarios.id, usuario.id));

    const origin = request.headers.get("origin") || "http://localhost:3000";
    const resetLink = `${origin}/auth/reset-password?token=${rawToken}`;

    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json({
      message:
        "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
    });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
