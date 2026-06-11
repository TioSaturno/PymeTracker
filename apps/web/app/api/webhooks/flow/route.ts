import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { suscripciones, usuarios } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import * as flow from "@/lib/flow";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string | null;

    if (!token) {
      return NextResponse.json({ error: "Token requerido" }, { status: 400 });
    }

    const paymentStatus = await flow.getPaymentStatus(token);

    if (paymentStatus.status !== 1) {
      console.warn(
        `[Webhook Flow] Pago no exitoso para commerceOrder ${paymentStatus.commerceOrder}: status ${paymentStatus.status}`,
      );
      return NextResponse.json({ received: true });
    }

    const subscriptionId = paymentStatus.commerceOrder;

    const [suscripcion] = await db
      .select()
      .from(suscripciones)
      .where(eq(suscripciones.referenciaPago, subscriptionId))
      .limit(1);

    if (!suscripcion) {
      console.warn(
        `[Webhook Flow] Suscripción local no encontrada para subscriptionId: ${subscriptionId}`,
      );
      return NextResponse.json({ received: true });
    }

    const fechaFin = new Date(suscripcion.fechaFin);
    const ahora = new Date();

    if (fechaFin <= ahora) {
      const nuevoFin = new Date(ahora);
      nuevoFin.setMonth(nuevoFin.getMonth() + 1);
      await db
        .update(suscripciones)
        .set({
          estado: "activa",
          fechaFin: nuevoFin,
        })
        .where(eq(suscripciones.id, suscripcion.id));
    } else {
      await db
        .update(suscripciones)
        .set({ estado: "activa" })
        .where(eq(suscripciones.id, suscripcion.id));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook Flow]", error);
    return NextResponse.json({ received: true });
  }
}
