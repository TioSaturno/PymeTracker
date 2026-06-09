import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────
// 1. EMPRESAS (Entidad Raíz)
// ─────────────────────────────────────────────
export const empresas = pgTable("empresas", {
  id: serial("id").primaryKey(),
  rut: varchar("rut", { length: 20 }),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  rubro: varchar("rubro", { length: 100 }),
  direccion: text("direccion"),
  comuna: varchar("comuna", { length: 100 }),
  telefono: varchar("telefono", { length: 50 }),
  diaSeleccionado: varchar("dia_seleccionado", { length: 10 }).default("lunes"),
  fechaRegistro: timestamp("fecha_registro").defaultNow(),
});

// ─────────────────────────────────────────────
// 2. USUARIOS (Trazabilidad de ejecución)
// ─────────────────────────────────────────────
export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  rol: varchar("rol", { length: 50 }).default("admin"),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpires: timestamp("reset_token_expires"),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});
// ─────────────────────────────────────────────
// TABLA PUENTE: USUARIO ↔ EMPRESAS
// ─────────────────────────────────────────────
export const usuarioEmpresas = pgTable("usuario_empresas", {
  id: serial("id").primaryKey(),
  usuarioId: integer("usuario_id").notNull().references(() => usuarios.id, { onDelete: "cascade" }),
  empresaId: integer("empresa_id").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  rol: varchar("rol", { length: 50 }).default("admin"),
  fechaUnion: timestamp("fecha_union").defaultNow(),
});
// ─────────────────────────────────────────────
// 3. CIUDADES (Filtro geográfico)
// ─────────────────────────────────────────────
export const ciudades = pgTable("ciudades", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }),
});

// ─────────────────────────────────────────────
// 4. TIENDAS (Sucursales de la PYME)
// ─────────────────────────────────────────────
export const tiendas = pgTable("tiendas", {
  id: serial("id").primaryKey(),
  empresaId: integer("empresa_id").references(() => empresas.id, {
    onDelete: "cascade",
  }),
  ciudadId: integer("ciudad_id").references(() => ciudades.id),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  direccion: text("direccion"),
  fechaCreacion: timestamp("fecha_creacion").defaultNow(),
});

// ─────────────────────────────────────────────
// 5. ANALISIS (Contenedor JSONB — Google Places & Scraping)
// ─────────────────────────────────────────────
export const analisis = pgTable(
  "analisis",
  {
    id: serial("id").primaryKey(),
    tiendaId: integer("tienda_id").references(() => tiendas.id, {
      onDelete: "cascade",
    }),
    usuarioId: integer("usuario_id").references(() => usuarios.id),
    status: varchar("status", { length: 20 }).default("pending"),
    /** Almacena pymesData y productos extraídos del scraper */
    payloadData: jsonb("payload_data").notNull(),
    /** Resultado del procesamiento con LLM (categorías y precios unitarios) */
    payloadProcesado: jsonb("payload_procesado"),
    /** Indica si el análisis ya fue procesado por el LLM */
    procesado: boolean("procesado").default(false),
    fechaEjecucion: timestamp("fecha_ejecucion").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Índice GIN para búsquedas rápidas dentro del JSONB
    payloadIdx: index("idx_analisis_payload").using("gin", table.payloadData),
  })
);

// ─────────────────────────────────────────────
// 6. INVENTARIOS (Productos en tiendas)
// ─────────────────────────────────────────────
export const inventarios = pgTable("inventarios", {
  id: serial("id").primaryKey(),
  tiendaId: integer("tienda_id").references(() => tiendas.id, {
    onDelete: "cascade",
  }),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  precio: integer("precio").notNull(),
  fechaAgregado: timestamp("fecha_agregado").defaultNow(),
});

// ─────────────────────────────────────────────
// RELACIONES
// ─────────────────────────────────────────────
export const empresasRelations = relations(empresas, ({ many }) => ({
  usuarios: many(usuarios),
  tiendas: many(tiendas),
}));

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  empresa: one(empresas, {
    fields: [usuarios.empresaId],
    references: [empresas.id],
  }),
  analisis: many(analisis),
}));

export const ciudadesRelations = relations(ciudades, ({ many }) => ({
  tiendas: many(tiendas),
}));

export const tiendasRelations = relations(tiendas, ({ one, many }) => ({
  empresa: one(empresas, {
    fields: [tiendas.empresaId],
    references: [empresas.id],
  }),
  ciudad: one(ciudades, {
    fields: [tiendas.ciudadId],
    references: [ciudades.id],
  }),
  analisis: many(analisis),
  inventarios: many(inventarios),
}));

export const analisisRelations = relations(analisis, ({ one }) => ({
  tienda: one(tiendas, {
    fields: [analisis.tiendaId],
    references: [tiendas.id],
  }),
  usuario: one(usuarios, {
    fields: [analisis.usuarioId],
    references: [usuarios.id],
  }),
}));

export const inventariosRelations = relations(inventarios, ({ one }) => ({
  tienda: one(tiendas, {
    fields: [inventarios.tiendaId],
    references: [tiendas.id],
  }),
}));

// ─────────────────────────────────────────────
// TIPOS INFERIDOS (para uso en la app)
// ─────────────────────────────────────────────
export type Empresa = typeof empresas.$inferSelect;
export type NuevaEmpresa = typeof empresas.$inferInsert;

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;

export type Ciudad = typeof ciudades.$inferSelect;
export type NuevaCiudad = typeof ciudades.$inferInsert;

export type Tienda = typeof tiendas.$inferSelect;
export type NuevaTienda = typeof tiendas.$inferInsert;

export type Analisis = typeof analisis.$inferSelect;
export type NuevoAnalisis = typeof analisis.$inferInsert;

export type Inventario = typeof inventarios.$inferSelect;
export type NuevoInventario = typeof inventarios.$inferInsert;