import { db } from "@pymeTracker/db/create-client";
import { analisis } from "@pymeTracker/db/schema";

export async function saveInDb(datos: any) {
  const defaultUserId = 1;
  const defaultTiendaId = 1;

  await db.insert(analisis).values({
    usuarioId: defaultUserId,
    tiendaId: defaultTiendaId,
    status: "completed",
    payloadData: datos,
  });

  console.log("✅ Datos guardados en la base de datos");
}
