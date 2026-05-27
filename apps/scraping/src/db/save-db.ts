import { db } from "@pymetracker/db/create-client";
import { analisis } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";

export async function updateStatus(
  analisisId: number,
  status: string,
  payloadData?: any,
) {
  const updateData: any = { status };

  if (payloadData !== undefined) {
    updateData.payloadData = payloadData;
  }

  await db.update(analisis).set(updateData).where(eq(analisis.id, analisisId));
}

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
