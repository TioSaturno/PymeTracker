import { db } from "../create-client";
import * as schema from "../schema";
import { eq, and } from "drizzle-orm";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Iniciando el proceso de seed...");

  try {
    // 1. Leer el archivo JSON de datos extraídos
    const jsonPath = path.join(__dirname, "executed.json");
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`No se encontró el archivo ${jsonPath}`);
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    // 2. Crear o usar Ciudad (Santiago)
    console.log("🏙️ Buscando o insertando ciudad...");
    const existingCiudad = await db
      .select()
      .from(schema.ciudades)
      .where(
        and(
          eq(schema.ciudades.nombre, "Santiago"),
          eq(schema.ciudades.region, "Metropolitana"),
        ),
      )
      .limit(1);
    const ciudad =
      existingCiudad[0] ??
      (
        await db
          .insert(schema.ciudades)
          .values({ nombre: "Santiago", region: "Metropolitana" })
          .returning()
      )[0];

    // 3. Crear o usar Empresa (Pyme de ejemplo)
    console.log("🏢 Buscando o insertando empresa...");
    const existingEmpresa = await db
      .select()
      .from(schema.empresas)
      .where(eq(schema.empresas.rut, "76.543.210-K"))
      .orderBy(schema.empresas.id)
      .limit(1);
    const empresa =
      existingEmpresa[0] ??
      (
        await db
          .insert(schema.empresas)
          .values({
            nombre: "Sushi Master",
            rubro: "Sushi",
            rut: "76.543.210-K",
            direccion: "Providencia 1234",
            comuna: "Providencia",
            telefono: "+56912345678",
          })
          .returning()
      )[0];

    // 4. Crear o usar Usuario (Admin)
    console.log("👤 Buscando o insertando usuario...");
    const existingUsuario = await db
      .select()
      .from(schema.usuarios)
      .where(eq(schema.usuarios.email, "marcoscarreno78@gmail.com"))
      .limit(1);
    const usuario =
      existingUsuario[0] ??
      (
        await db
          .insert(schema.usuarios)
          .values({
            nombre: "Marcos Admin",
            email: "marcoscarreno78@gmail.com",
            passwordHash: await bcrypt.hash("dummy", 10),
            rol: "admin",
          })
          .returning()
      )[0];

    // 5. Enlazar usuario con la empresa en la tabla puente
    console.log("🔗 Verificando la relación usuario-empresa...");
    const existingUsuarioEmpresa = await db
      .select()
      .from(schema.usuarioEmpresas)
      .where(eq(schema.usuarioEmpresas.usuarioId, usuario.id))
      .limit(1);

    if (existingUsuarioEmpresa.length === 0) {
      await db.insert(schema.usuarioEmpresas).values({
        usuarioId: usuario.id,
        empresaId: empresa.id,
        rol: "admin",
      });
    } else if (existingUsuarioEmpresa[0].empresaId !== empresa.id) {
      await db
        .update(schema.usuarioEmpresas)
        .set({ empresaId: empresa.id })
        .where(
          and(
            eq(schema.usuarioEmpresas.usuarioId, usuario.id),
            eq(schema.usuarioEmpresas.empresaId, existingUsuarioEmpresa[0].empresaId),
          ),
        );
    }

    // 6. Crear o usar Tienda (Sucursal de la empresa)
    console.log("🏪 Buscando o insertando tienda...");
    const existingTienda = await db
      .select()
      .from(schema.tiendas)
      .where(
        and(
          eq(schema.tiendas.empresaId, empresa.id),
          eq(schema.tiendas.nombre, "Sushi Master - Centro"),
        ),
      )
      .limit(1);
    const tienda =
      existingTienda[0] ??
      (
        await db
          .insert(schema.tiendas)
          .values({
            empresaId: empresa.id,
            ciudadId: ciudad.id,
            nombre: "Sushi Master - Centro",
            direccion: "Serrano 468, Santiago",
          })
          .returning()
      )[0];

    // 7. Insertar Análisis si no existe
    console.log("📊 Verificando análisis de competencia...");
    const existingAnalisis = await db
      .select()
      .from(schema.analisis)
      .where(
        and(
          eq(schema.analisis.tiendaId, tienda.id),
          eq(schema.analisis.usuarioId, usuario.id),
          eq(schema.analisis.status, "completed"),
        ),
      )
      .limit(1);
    if (existingAnalisis.length === 0) {
      await db.insert(schema.analisis).values({
        tiendaId: tienda.id,
        usuarioId: usuario.id,
        status: "completed",
        payloadData: data,
      });
    }

    console.log("✅ Seed completado con éxito.");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
