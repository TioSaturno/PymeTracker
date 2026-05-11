import { db } from "../create-client";
import * as schema from "../schema";
import fs from "fs";
import path from "path";

async function main() {
  console.log("🌱 Iniciando el proceso de seed...");

  try {
    // 1. Leer el archivo JSON de datos extraídos
    const jsonPath = path.join(__dirname, "executed.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`No se encontró el archivo ${jsonPath}`);
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // 2. Insertar Ciudad (Santiago)
    console.log("🏙️ Insertando ciudad...");
    const [ciudad] = await db
      .insert(schema.ciudades)
      .values({
        nombre: "Santiago",
        region: "Metropolitana",
      })
      .returning();

    // 3. Insertar Empresa (Pyme de ejemplo)
    console.log("🏢 Insertando empresa...");
    const [empresa] = await db
      .insert(schema.empresas)
      .values({
        nombre: "Sushi Master",
        rubro: "Gastronomía",
      })
      .returning();

    // 4. Insertar Usuario (Admin)
    console.log("👤 Insertando usuario...");
    const [usuario] = await db
      .insert(schema.usuarios)
      .values({
        empresaId: empresa.id,
        nombre: "Marcos Admin",
        email: "marcos@pymetracker.cl",
        passwordHash: "$2b$10$vsnCeVIR5fz9.1JrG.UHr.HJ9qVfkhHsfPbJl69My39ZQCWqOI2rO",
        rol: "admin",
      })
      .returning();

    // 5. Insertar Tienda (Sucursal de la empresa)
    console.log("🏪 Insertando tienda...");
    const [tienda] = await db
      .insert(schema.tiendas)
      .values({
        empresaId: empresa.id,
        ciudadId: ciudad.id,
        nombre: "Sushi Master - Centro",
        direccion: "Serrano 468, Santiago",
      })
      .returning();

    // 6. Insertar Analisis con la data de executed.json
    // Este registro vincula la tienda con el reporte de la competencia
    console.log("📊 Insertando análisis de competencia...");
    await db.insert(schema.analisis).values({
      tiendaId: tienda.id,
      usuarioId: usuario.id,
      status: "completed",
      payloadData: data,
    });

    console.log("✅ Seed completado con éxito.");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
