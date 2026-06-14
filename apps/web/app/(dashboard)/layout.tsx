import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@pymetracker/db/create-client";
import { suscripciones } from "@pymetracker/db/schema";
import { eq, and, or, gt } from "drizzle-orm";
import Sidebar from "../components/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let rol = "";
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      rol = payload.rol || "";

      // Si el token no tiene planActivo, verificar suscripción en DB
      if (payload.planActivo !== true) {
        const [suscripcion] = await db
          .select()
          .from(suscripciones)
          .where(
            and(
              eq(suscripciones.usuarioId, payload.id as number),
              or(
                eq(suscripciones.estado, "activa"),
                eq(suscripciones.estado, "cancelada"),
              ),
              gt(suscripciones.fechaFin, new Date()),
            ),
          )
          .limit(1);

        if (!suscripcion) {
          redirect("/plan");
        }
      }
    } catch {
      rol = "";
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar rol={rol} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
