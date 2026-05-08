import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export function getUsuarioFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      rol: string;
      empresaId: number | null;
    };

    return payload;
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest) {
  const usuario = getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  return usuario;
}
