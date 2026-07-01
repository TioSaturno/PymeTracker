import { describe, it, expect, beforeEach } from "vitest";
import {
  POST as postEmpresa,
  PUT as putEmpresa,
  GET as getEmpresa,
} from "@/app/api/empresa/perfil/route";
import { POST as postSwitch } from "@/app/api/empresa/perfil/switch/route";
import { db } from "@pymetracker/db/create-client";
import { empresas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import {
  cleanDatabase,
  createUser,
  createEmpresa,
  createTienda,
  signToken,
  loggedCall,
} from "../helpers";

async function req(url: string, init?: any) {
  const { NextRequest } = await import("next/server");
  return new NextRequest(url, init);
}

describe("IT-04: Perfiles de empresa - CRUD", () => {
  beforeEach(async () => await cleanDatabase());

  it("GET /api/empresa/perfil debe retornar null sin empresa activa", async () => {
    const { token } = await createUser();
    const r = await loggedCall(getEmpresa,
      await req("http://localhost:3000/api/empresa/perfil", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.data).toBeNull();
  });

  it("POST /api/empresa/perfil debe crear empresa y tienda", async () => {
    const { user, token } = await createUser();
    const r = await loggedCall(postEmpresa,
      await req("http://localhost:3000/api/empresa/perfil", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({
          nombre: "Nueva Empresa",
          rubro: "tecnologia",
          nombreSucursal: "Sucursal 1",
          direccionSucursal: "Dirección 123",
        }),
      }),
    );
    expect(r.status).toBe(201);
    const body = await r.json();
    expect(body.data.empresa.nombre).toBe("Nueva Empresa");
    expect(body.data.tienda.nombre).toBe("Sucursal 1");

    const empresasDb = await db
      .select()
      .from(empresas)
      .where(eq(empresas.nombre, "Nueva Empresa"));
    expect(empresasDb).toHaveLength(1);

    const relaciones = await db
      .select()
      .from(usuarioEmpresas)
      .where(eq(usuarioEmpresas.usuarioId, user.id));
    expect(relaciones.length).toBeGreaterThanOrEqual(1);
  });

  it("PUT /api/empresa/perfil debe actualizar empresa activa", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id);
    const tienda = await createTienda(empresa.id);

    const updatedToken = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      empresaActivaId: empresa.id,
      tiendaActivaId: tienda.id,
      planActivo: false,
    });

    const r = await loggedCall(putEmpresa,
      await req("http://localhost:3000/api/empresa/perfil", {
        method: "PUT",
        cookies: { token: updatedToken },
        body: JSON.stringify({ nombre: "Empresa Editada" }),
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.data.empresa.nombre).toBe("Empresa Editada");
  });
});

describe("IT-05: Perfiles - cambio de perfil activo", () => {
  beforeEach(async () => await cleanDatabase());

  it("POST /api/empresa/perfil/switch debe cambiar empresa activa", async () => {
    const { user, token } = await createUser();
    const empresa1 = await createEmpresa(user.id, { nombre: "Empresa 1" });
    const empresa2 = await createEmpresa(user.id, { nombre: "Empresa 2" });

    const r = await loggedCall(postSwitch,
      await req("http://localhost:3000/api/empresa/perfil/switch", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({ empresaId: empresa2.id }),
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.empresaActivaId).toBe(empresa2.id);
  });

  it("debe retornar 403 al cambiar a empresa sin acceso", async () => {
    const { token } = await createUser();
    const { user: otroUser } = await createUser();
    const otraEmpresa = await createEmpresa(otroUser.id);

    const r = await loggedCall(postSwitch,
      await req("http://localhost:3000/api/empresa/perfil/switch", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({ empresaId: otraEmpresa.id }),
      }),
    );
    expect(r.status).toBe(403);
  });
});
