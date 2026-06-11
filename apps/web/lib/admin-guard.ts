import { NextRequest, NextResponse } from "next/server";
import { getUsuarioFromRequest } from "./auth";

export async function requireAdmin(request: NextRequest) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (usuario.rol !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return usuario;
}
