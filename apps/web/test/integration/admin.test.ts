import { describe, it, expect, beforeEach } from "vitest";
import { GET as getEjecuciones } from "@/app/api/admin/ejecuciones/route";
import {
  cleanDatabase,
  createUser,
  createEmpresa,
  createTienda,
  createAnalisis,
  createAdmin,
  signToken,
  loggedCall,
} from "../helpers";

async function req(url: string, init?: any) {
  const { NextRequest } = await import("next/server");
  return new NextRequest(url, init);
}

describe("IT-18: Admin – historial global con filtros", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar ejecuciones para admin autenticado", async () => {
    const { user, token } = await createUser();
    const empresa = await createEmpresa(user.id, { nombre: "Admin Test" });
    const tienda = await createTienda(empresa.id);
    await createAnalisis(user.id, tienda.id);

    const adminToken = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: "admin",
      empresaActivaId: empresa.id,
      tiendaActivaId: tienda.id,
      planActivo: true,
    });

    const r = await loggedCall(getEjecuciones,
      await req("http://localhost:3000/api/admin/ejecuciones", {
        method: "GET",
        cookies: { token: adminToken },
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("debe filtrar por fechaDesde y fechaHasta", async () => {
    const { user, token } = await createUser();
    const empresa = await createEmpresa(user.id, { nombre: "Filtro Test" });
    const tienda = await createTienda(empresa.id);
    await createAnalisis(user.id, tienda.id);

    const adminToken = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: "admin",
      empresaActivaId: empresa.id,
      tiendaActivaId: tienda.id,
      planActivo: true,
    });

    const r = await loggedCall(getEjecuciones,
      await req(
        "http://localhost:3000/api/admin/ejecuciones?fechaDesde=2020-01-01&fechaHasta=2030-12-31",
        { method: "GET", cookies: { token: adminToken } },
      ),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.data.length).toBeGreaterThanOrEqual(1);
  });
});
