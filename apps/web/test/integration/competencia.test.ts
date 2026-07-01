import { describe, it, expect, beforeEach } from "vitest";
import { GET as getCompetencia } from "@/app/api/competencia/route";
import {
  cleanDatabase,
  createUser,
  createEmpresa,
  createTienda,
  createAnalisis,
  signToken,
  loggedCall,
} from "../helpers";

async function req(url: string, init?: any) {
  const { NextRequest } = await import("next/server");
  return new NextRequest(url, init);
}

describe("IT-10: Competencia - listado con tienda activa", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar competidores sin incluir el nombre de la propia empresa", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, {
      nombre: "Mi Café",
      rubro: "Cafetería",
    });
    const tienda = await createTienda(empresa.id, {
      nombre: "Mi Café Centro",
      direccion: "Calle 123",
    });

    await createAnalisis(user.id, tienda.id, {
      status: "completed",
      payloadData: {
        busqueda: { tema: "Cafetería", ubicacion: "Santiago" },
        empresas: [
          { nombre: "Mi Café", calificaciones: { rating: 4.5 }, precios: [] },
          {
            nombre: "Otra Café",
            calificaciones: { rating: 4.0 },
            precios: [],
          },
          {
            nombre: "Café Competencia",
            calificaciones: { rating: 3.8 },
            precios: [],
          },
        ],
        total_empresas: 3,
        mas_valorado: "Mi Café",
        mas_criticado: "Café Competencia",
        analisis_tienda_base: null,
      },
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

    const r = await loggedCall(getCompetencia,
      await req("http://localhost:3000/api/competencia", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.empresas).toHaveLength(2);
    expect(body.empresas.some((e: any) => e.nombre === "Mi Café")).toBe(false);
    expect(body.miNegocio).toBeTruthy();
    expect(body.miNegocio.nombre).toBe("Mi Café");
  });
});

describe("IT-11: Competencia - error sin tienda activa", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 si no hay tienda activa", async () => {
    const { token } = await createUser();

    const r = await loggedCall(getCompetencia,
      await req("http://localhost:3000/api/competencia", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(400);
  });
});
