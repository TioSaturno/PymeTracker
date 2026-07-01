import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST as postAnalisis } from "@/app/api/analisis/route";
import { db } from "@pymetracker/db/create-client";
import { analisis, empresas } from "@pymetracker/db/schema";
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

describe("IT-06: Análisis - ejecución exitosa", () => {
  beforeEach(async () => {
    await cleanDatabase();
    vi.mocked(fetch).mockClear();
  });

  it("debe crear análisis con status pending y llamar al worker", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, {
      nombre: "Sushi Test",
      rubro: "Sushi",
    });
    const tienda = await createTienda(empresa.id, {
      nombre: "Sushi Centro",
      direccion: "Calle Principal 123",
    });
    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      empresaActivaId: empresa.id,
      tiendaActivaId: tienda.id,
      planActivo: true,
    });

    const r = await loggedCall(postAnalisis,
      await req("http://localhost:3000/api/analisis", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({ nResults: 5 }),
      }),
    );
    expect(r.status).toBe(201);
    const body = await r.json();
    expect(body.analisisId).toBeTruthy();

    const [record] = await db
      .select()
      .from(analisis)
      .where(eq(analisis.id, body.analisisId));
    expect(record).toBeDefined();
    expect(record.status).toBe("pending");

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      expect.stringContaining("/run"),
      expect.objectContaining({ method: "POST" }),
    );
    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const fetchBody = JSON.parse(fetchCall[1]?.body as string);
    expect(fetchBody.topic).toBe("Sushi");
    expect(fetchBody.location).toBe("Calle Principal 123");
  });
});

describe("IT-07: Análisis - validación sin rubro", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 si empresa no tiene rubro", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, {
      rubro: "tecnologia",
    });
    const tienda = await createTienda(empresa.id);
    await db
      .update(empresas)
      .set({ rubro: null })
      .where(eq(empresas.id, empresa.id));

    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      empresaActivaId: empresa.id,
      tiendaActivaId: tienda.id,
      planActivo: true,
    });

    const r = await loggedCall(postAnalisis,
      await req("http://localhost:3000/api/analisis", {
        method: "POST",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/completar el rubro/i);
  });
});

describe("IT-08: Análisis - validación sin tienda activa", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 si no hay tienda activa", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, { rubro: "tecnologia" });
    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      empresaActivaId: empresa.id,
      tiendaActivaId: null,
      planActivo: true,
    });

    const r = await loggedCall(postAnalisis,
      await req("http://localhost:3000/api/analisis", {
        method: "POST",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/tienda|sucursal activa/i);
  });
});

describe("IT-09: Análisis - validación sin dirección", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 si ni tienda ni empresa tienen dirección", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, {
      rubro: "tecnologia",
      direccion: null,
      comuna: null,
    });
    const tienda = await createTienda(empresa.id, { direccion: "" });
    const token = await signToken({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      empresaActivaId: empresa.id,
      tiendaActivaId: tienda.id,
      planActivo: true,
    });

    const r = await loggedCall(postAnalisis,
      await req("http://localhost:3000/api/analisis", {
        method: "POST",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/dirección/i);
  });
});
