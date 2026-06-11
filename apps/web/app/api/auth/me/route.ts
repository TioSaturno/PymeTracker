import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const usuario = await requireAuth(request);
  if (usuario instanceof NextResponse) return usuario;

  return NextResponse.json({
    data: {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      empresaActivaId: usuario.empresaActivaId,
      tiendaActivaId: usuario.tiendaActivaId,
    },
  });
}
