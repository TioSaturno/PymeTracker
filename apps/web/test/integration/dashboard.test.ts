import { describe, it, expect, beforeEach } from "vitest";
import { GET as getAnalytics } from "@/app/api/analytics/route";
import { GET as getHistorial } from "@/app/api/analisis/historial/route";
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

describe("IT-14: Dashboard - datos de métricas", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar métricas con preciosPromedios y composicionOferta", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, { nombre: "Métrica SA" });
    const tienda = await createTienda(empresa.id, {
      nombre: "Métrica Centro",
      direccion: "Calle 123",
    });

    await createAnalisis(user.id, tienda.id, {
      status: "completed",
      payloadData: {
        busqueda: { tema: "Test", ubicacion: "Santiago" },
        empresas: [
          {
            nombre: "Competidor A",
            productos: [],
            calificaciones: { rating: 4.0, total_resenas: 100 },
          },
        ],
      },
      procesado: true,
      payloadProcesado: {
        empresas: [
          {
            nombre: "Competidor A",
            productos: [
              {
                producto_original: "Café",
                categoria: "Bebidas",
                precio_lista: 3000,
                precio_unitario: 2500,
                unidad: "unidad",
              },
              {
                producto_original: "Té",
                categoria: "Bebidas",
                precio_lista: 2000,
                precio_unitario: 1800,
                unidad: "unidad",
              },
            ],
          },
          {
            nombre: "Competidor B",
            productos: [
              {
                producto_original: "Café",
                categoria: "Bebidas",
                precio_lista: 3500,
                precio_unitario: 3000,
                unidad: "unidad",
              },
            ],
          },
        ],
        categorias_principales: ["Bebidas"],
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

    const r = await loggedCall(getAnalytics,
      await req("http://localhost:3000/api/analytics", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.preciosPromedios).toBeDefined();
    expect(body.preciosPromedios.length).toBeGreaterThanOrEqual(2);
    expect(body.comparativaProductos).toBeDefined();
    expect(body.composicionOferta).toBeDefined();
  });
});

describe("IT-15: Dashboard - historial de análisis", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar análisis ordenados por fecha descendente", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, { nombre: "Historial SA" });
    const tienda = await createTienda(empresa.id, {
      nombre: "Historial Centro",
      direccion: "Calle 123",
    });

    const a1 = await createAnalisis(user.id, tienda.id, {
      status: "completed",
      payloadData: {
        busqueda: { tema: "Test 1", ubicacion: "Santiago" },
        empresas: [],
      },
    });

    await new Promise((r) => setTimeout(r, 50));

    const a2 = await createAnalisis(user.id, tienda.id, {
      status: "completed",
      payloadData: {
        busqueda: { tema: "Test 2", ubicacion: "Valparaíso" },
        empresas: [],
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

    const r = await loggedCall(getHistorial,
      await req("http://localhost:3000/api/analisis/historial", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThanOrEqual(2);

    for (let i = 1; i < body.data.length; i++) {
      const prev = new Date(body.data[i - 1].fechaEjecucion).getTime();
      const curr = new Date(body.data[i].fechaEjecucion).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});
