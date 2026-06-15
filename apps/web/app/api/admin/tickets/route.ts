import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { tickets, usuarios, empresas } from "@pymetracker/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (usuario.rol !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const result = await db
      .select({
        id: tickets.id,
        asunto: tickets.asunto,
        descripcion: tickets.descripcion,
        status: tickets.status,
        prioridad: tickets.prioridad,
        respuesta: tickets.respuesta,
        respondidoPor: tickets.respondidoPor,
        fechaRespuesta: tickets.fechaRespuesta,
        fechaCreacion: tickets.fechaCreacion,
        usuarioId: tickets.usuarioId,
        empresaId: tickets.empresaId,
        usuarioNombre: usuarios.nombre,
        empresaNombre: empresas.nombre,
      })
      .from(tickets)
      .leftJoin(usuarios, eq(tickets.usuarioId, usuarios.id))
      .leftJoin(empresas, eq(tickets.empresaId, empresas.id))
      .orderBy(desc(tickets.fechaCreacion));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/admin/tickets]", error);
    return NextResponse.json({ error: "Error al cargar tickets" }, { status: 500 });
  }
}
