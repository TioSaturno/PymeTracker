import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST as postSuscripcion } from "@/app/api/suscripcion/route";
import { POST as postCancelar } from "@/app/api/suscripcion/cancelar/route";
import { db } from "@pymetracker/db/create-client";
import { suscripciones } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import {
  cleanDatabase,
  createUser,
  createSuscripcion,
  signToken,
  loggedCall,
} from "../helpers";

vi.mock("@/lib/flow", () => ({
  createCustomer: vi
    .fn()
    .mockResolvedValue({ customerId: "cus_test_123" }),
  createSubscription: vi
    .fn()
    .mockResolvedValue({ subscriptionId: "sub_test_456" }),
  cancelSubscription: vi.fn().mockResolvedValue({ success: true }),
  getSubscription: vi
    .fn()
    .mockResolvedValue({ status: 1, cancel_at_period_end: 0 }),
  getPaymentStatus: vi.fn().mockResolvedValue({ status: 1 }),
  ensurePlan: vi.fn().mockResolvedValue({ success: true }),
}));

async function req(url: string, init?: any) {
  const { NextRequest } = await import("next/server");
  return new NextRequest(url, init);
}

describe("Suscripción tests", () => {
  beforeEach(async () => await cleanDatabase());

  describe("UT-06: Suscripción - cancelación de plan activo", () => {
    it("debe cancelar suscripción activa y cambiar estado", async () => {
      const { user, token } = await createUser();
      const sub = await createSuscripcion(user.id, { estado: "activa" });

      const r = await postCancelar(
        await req("http://localhost:3000/api/suscripcion/cancelar", {
          method: "POST",
          cookies: { token },
        }),
      );
      expect(r.status).toBe(200);

      const [actualizada] = await db
        .select()
        .from(suscripciones)
        .where(eq(suscripciones.id, sub.id));
      expect(actualizada.estado).toBe("cancelada");
      expect(actualizada.fechaCancelacion).toBeTruthy();
    });

    it("debe retornar 404 si no hay suscripción activa", async () => {
      const { token } = await createUser();

      const r = await postCancelar(
        await req("http://localhost:3000/api/suscripcion/cancelar", {
          method: "POST",
          cookies: { token },
        }),
      );
      expect(r.status).toBe(404);
    });
  });

  describe("IT-16: Suscripción - contratación con Flow", () => {
    it("debe crear suscripción activa y llamar a Flow", async () => {
      const { token } = await createUser();

      const r = await loggedCall(postSuscripcion,
        await req("http://localhost:3000/api/suscripcion", {
          method: "POST",
          cookies: { token },
          body: JSON.stringify({ plan: "premium" }),
        }),
      );
      expect(r.status).toBe(201);
      const body = await r.json();
      expect(body.data).toBeDefined();
      expect(body.data.estado).toBe("activa");
      expect(body.flowSubscriptionId).toBeDefined();

      const { createCustomer, createSubscription } = await import("@/lib/flow");
      expect(vi.mocked(createCustomer)).toHaveBeenCalled();
      expect(vi.mocked(createSubscription)).toHaveBeenCalled();
    });
  });
});
