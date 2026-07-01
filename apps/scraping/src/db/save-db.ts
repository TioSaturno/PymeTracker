import { db } from "@pymetracker/db/create-client";
import { analisis, usuarios, tiendas, inventarios } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";

export async function obtenerDatosTiendaBase(analisisId: number) {
  // 1. Obtener la tiendaId del análisis
  const [analisisDb] = await db
    .select({ tiendaId: analisis.tiendaId })
    .from(analisis)
    .where(eq(analisis.id, analisisId))
    .limit(1);

  if (!analisisDb || !analisisDb.tiendaId) return null;

  // 2. Obtener la tienda
  const [tienda] = await db
    .select({ nombre: tiendas.nombre })
    .from(tiendas)
    .where(eq(tiendas.id, analisisDb.tiendaId))
    .limit(1);

  if (!tienda) return null;

  // 3. Obtener los productos
  const productos = await db
    .select({
      nombre: inventarios.nombre,
      categoria: inventarios.categoria,
      precio: inventarios.precio,
    })
    .from(inventarios)
    .where(eq(inventarios.tiendaId, analisisDb.tiendaId));

  return {
    nombre: tienda.nombre,
    productos,
  };
}
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

export async function updateProcesado(
  analisisId: number,
  payloadProcesado: any,
) {
  await db
    .update(analisis)
    .set({ payloadProcesado, procesado: true })
    .where(eq(analisis.id, analisisId));

  console.log("✅ Payload procesado guardado");
}

export async function obtenerEmailUsuario(
  analisisId: number,
): Promise<string | null> {
  const result = await db
    .select({ email: usuarios.email })
    .from(analisis)
    .innerJoin(usuarios, eq(analisis.usuarioId, usuarios.id))
    .where(eq(analisis.id, analisisId))
    .limit(1);

  return result.length > 0 ? result[0].email : null;
}
