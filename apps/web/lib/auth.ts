import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function getUsuarioFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload as {
      id: number;
      email: string;
      rol: string;
      empresaId: number | null;
    };
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  return usuario;
}
