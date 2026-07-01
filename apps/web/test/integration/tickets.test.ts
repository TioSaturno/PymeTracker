import { describe, it, expect, beforeEach } from "vitest";
import { POST as postTicket, GET as getUserTickets } from "@/app/api/tickets/route";
import { PATCH as patchTicket } from "@/app/api/tickets/[id]/route";
import { db } from "@pymetracker/db/create-client";
import { tickets } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import {
  cleanDatabase,
  createUser,
  createEmpresa,
  createTienda,
  createTicket,
  signToken,
  loggedCall,
} from "../helpers";

async function req(url: string, init?: any) {
  const { NextRequest } = await import("next/server");
  return new NextRequest(url, init);
}

describe("UT-07: Tickets – envío con campos obligatorios", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 si falta el asunto", async () => {
    const { token } = await createUser();
    const r = await loggedCall(postTicket,
      await req("http://localhost:3000/api/tickets", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({ asunto: "", descripcion: "Test" }),
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/requeridos/i);
  });

  it("debe retornar 400 si falta la descripción", async () => {
    const { token } = await createUser();
    const r = await loggedCall(postTicket,
      await req("http://localhost:3000/api/tickets", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({ asunto: "Test", descripcion: "" }),
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/requeridos/i);
  });
});

describe("IT-17: Tickets – envío y respuesta admin", () => {
  beforeEach(async () => await cleanDatabase());

  it("usuario crea ticket y admin responde", async () => {
    const { user, token } = await createUser();
    const empresa = await createEmpresa(user.id, { nombre: "Ticket SA" });

    const r = await loggedCall(postTicket,
      await req("http://localhost:3000/api/tickets", {
        method: "POST",
        cookies: { token },
        body: JSON.stringify({
          asunto: "Problema con análisis",
          descripcion: "No se ejecuta el análisis",
        }),
      }),
    );
    expect(r.status).toBe(201);
    const createBody = await r.json();
    expect(createBody.data.asunto).toBe("Problema con análisis");
    expect(createBody.data.status).toBe("abierto");

    const { user: adminUser, token: adminToken } = await createUser({
      nombre: "Admin",
      email: `admin_ticket_${Date.now()}@test.com`,
      rol: "admin",
    });

    const adminR = await loggedCall(patchTicket,
      await req(`http://localhost:3000/api/tickets/${createBody.data.id}`, {
        method: "PATCH",
        cookies: { token: adminToken },
        body: JSON.stringify({
          status: "respondido",
          respuesta: "Ya revisamos, era un problema de configuración.",
        }),
      }),
      { params: Promise.resolve({ id: String(createBody.data.id) }) },
    );
    expect(adminR.status).toBe(200);

    const userTicketsR = await loggedCall(getUserTickets,
      await req("http://localhost:3000/api/tickets", {
        method: "GET",
        cookies: { token },
      }),
    );
    expect(userTicketsR.status).toBe(200);
    const userTickets = await userTicketsR.json();
    const found = userTickets.data.find(
      (t: any) => t.id === createBody.data.id,
    );
    expect(found).toBeDefined();
  });
});
