import { describe, it, expect, beforeEach } from "vitest";
import { GET as getValoracion } from "@/app/api/valoracion/route";
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

describe("IT-12: Valoración - GET con tienda activa", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar datos de valoración por competidor", async () => {
    const { user } = await createUser();
    const empresa = await createEmpresa(user.id, { nombre: "Test SA" });
    const tienda = await createTienda(empresa.id, {
      nombre: "Test Centro",
      direccion: "Calle 123",
    });

    await createAnalisis(user.id, tienda.id, {
      status: "completed",
      payloadData: {
        busqueda: { tema: "Test", ubicacion: "Santiago" },
        empresas: [
          {
            id: 1,
            nombre: "Competidor 1",
            calificaciones: {
              rating: 4.2,
              total_resenas: 150,
              ultimas_resenas: ["Buena atención", "Precios justos"],
              rango_precio_gmaps: "$$",
            },
            precios: [{ producto: "Café", precio: 2500, imagen_url: null }],
            sitio_web: "https://comp1.cl",
            ubicacion: "Santiago Centro",
            google_maps_url: "https://maps.google.com/comp1",
            fortalezas: ["Buena ubicación"],
            debilidades: ["Poco estacionamiento"],
            resumen_opiniones: "Bien valorado en general",
          },
        ],
        total_empresas: 1,
        mas_valorado: null,
        mas_criticado: null,
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

    const r = await loggedCall(getValoracion,
      await req(
        "http://localhost:3000/api/valoracion?competidorNombre=Competidor 1",
        { method: "GET", cookies: { token } },
      ),
    );
    expect(r.status).toBe(200);
    const body = await r.json();
    expect(body.competidor).toBeDefined();
    expect(body.competidor.nombre).toBe("Competidor 1");
    expect(body.competidor.rating).toBe(4.2);
  });
});

describe("IT-13: Valoración - error sin tienda activa", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 si no hay tienda activa", async () => {
    const { token } = await createUser();

    const r = await loggedCall(getValoracion,
      await req("http://localhost:3000/api/valoracion", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(r.status).toBe(400);
  });
});
