import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    console.warn("⚠ JWT_SECRET not set in production — using insecure fallback");
  }
  return secret || "dev-secret-change-in-production";
}

export async function getUsuarioFromRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as number,
      nombre: payload.nombre as string,
      email: payload.email as string,
      rol: payload.rol as string,
      empresaActivaId: payload.empresaActivaId as number | null,
      tiendaActivaId: payload.tiendaActivaId as number | null,
      planActivo: payload.planActivo as boolean,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const usuario = await getUsuarioFromRequest(request);
  if (!usuario) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return usuario;
}
