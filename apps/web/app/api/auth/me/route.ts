import { NextRequest, NextResponse } from "next/server";
import { getUsuarioFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({
    data: {
      id: usuario.id,
      nombre: usuario.nombre || null,
      email: usuario.email,
    },
  });
}
