import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { empresas, tiendas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const usuarioAuth = await requireAuth(request);
    if (usuarioAuth instanceof NextResponse) return usuarioAuth;

    const body = await request.json();
    const { nombre, rubro, rut, direccion, comuna, telefono, nombreSucursal, direccionSucursal } = body;

    if (!nombre)
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });

    const [nuevaEmpresa] = await db
      .insert(empresas)
      .values({ nombre, rubro, rut, direccion, comuna, telefono })
      .returning();

    await db.insert(usuarioEmpresas).values({
      usuarioId: usuarioAuth.id,
      empresaId: nuevaEmpresa.id,
      rol: "admin",
    });

    let nuevaTienda = null;
    if (nombreSucursal) {
      [nuevaTienda] = await db
        .insert(tiendas)
        .values({ nombre: nombreSucursal, direccion: direccionSucursal || null, empresaId: nuevaEmpresa.id })
        .returning();
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const nuevoToken = await new SignJWT({
      id: usuarioAuth.id,
      email: usuarioAuth.email,
      rol: usuarioAuth.rol,
      empresaActivaId: nuevaEmpresa.id,
      tiendaActivaId: nuevaTienda?.id ?? null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    const response = NextResponse.json(
      { data: { empresa: nuevaEmpresa, tienda: nuevaTienda } },
      { status: 201 },
    );
    response.cookies.set("token", nuevoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Error al crear empresa" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaActivaId) {
      return NextResponse.json({ error: "No tienes empresa que editar" }, { status: 400 });
    }

    const body = await request.json();
    const { nombre, rubro, rut, direccion, comuna, telefono, diaSeleccionado, nombreSucursal, direccionSucursal } = body;

    const [empresaActualizada] = await db
      .update(empresas)
      .set({
        nombre,
        rubro,
        rut,
        direccion,
        comuna,
        telefono,
        diaSeleccionado,
      })
      .where(eq(empresas.id, usuario.empresaActivaId))
      .returning();

    let tiendaActualizada = null;
    if (nombreSucursal || direccionSucursal) {
      const updateData: Partial<{ nombre: string; direccion: string }> = {};
      if (nombreSucursal) updateData.nombre = nombreSucursal;
      if (direccionSucursal) updateData.direccion = direccionSucursal;

      if (usuario.tiendaActivaId) {
        [tiendaActualizada] = await db
          .update(tiendas)
          .set(updateData)
          .where(eq(tiendas.id, usuario.tiendaActivaId))
          .returning();
      } else if (nombreSucursal) {
        [tiendaActualizada] = await db
          .insert(tiendas)
          .values({ nombre: nombreSucursal, direccion: direccionSucursal || null, empresaId: usuario.empresaActivaId })
          .returning();
      }
    }

    return NextResponse.json({ data: { empresa: empresaActualizada, tienda: tiendaActualizada } });
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaActivaId) return NextResponse.json({ data: null });

    const [empresa] = await db
      .select()
      .from(empresas)
      .where(eq(empresas.id, usuario.empresaActivaId))
      .limit(1);

    const tiendasList = await db
      .select()
      .from(tiendas)
      .where(eq(tiendas.empresaId, usuario.empresaActivaId));

    let activeTienda = null;
    if (usuario.tiendaActivaId) {
      const [found] = await db
        .select()
        .from(tiendas)
        .where(eq(tiendas.id, usuario.tiendaActivaId))
        .limit(1);
      activeTienda = found || null;
    }

    return NextResponse.json({
      data: {
        ...empresa,
        tiendas: tiendasList,
        tiendaActivaId: usuario.tiendaActivaId,
        activeTienda,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar empresa" }, { status: 500 });
  }
}