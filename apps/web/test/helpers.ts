import { db } from "@pymetracker/db/create-client";
import {
  usuarios,
  empresas,
  tiendas,
  usuarioEmpresas,
  analisis,
  inventarios,
  suscripciones,
  tickets,
  ciudades,
} from "@pymetracker/db/schema";
import { eq, and, gt, or, desc } from "drizzle-orm";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
export const TEST_PASSWORD = "test123456";
export const TEST_PASSWORD_HASH = bcrypt.hashSync(TEST_PASSWORD, 10);

export async function loggedCall(handler: Function, req: any, ...rest: any[]) {
  const body = req.body ? JSON.parse(req.body) : undefined;
  console.log(`\n→ ${req.method || "GET"} ${new URL(req.url).pathname}`);
  if (body) console.log(`  Body: ${JSON.stringify(body)}`);
  if (rest.length > 0) console.log(`  Extra args: ${JSON.stringify(rest)}`);

  const response = await handler(req, ...rest);

  const responseBody = await response
    .clone()
    .json()
    .catch(() => "no-json");
  const bodyStr =
    typeof responseBody === "string"
      ? responseBody
      : JSON.stringify(responseBody).substring(0, 300);
  console.log(`← ${response.status} ${bodyStr}`);

  return response;
}

function encodeSecret() {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(encodeSecret());
}

export async function createUser(overrides?: {
  nombre?: string;
  email?: string;
  passwordHash?: string;
  rol?: string;
}) {
  const data = {
    nombre: overrides?.nombre || "Test User",
    email: overrides?.email || `test_${Date.now()}@test.com`,
    passwordHash: overrides?.passwordHash || TEST_PASSWORD_HASH,
    rol: overrides?.rol || "admin",
  };

  const [user] = await db
    .insert(usuarios)
    .values(data)
    .returning();

  const token = await signToken({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    empresaActivaId: null,
    tiendaActivaId: null,
    planActivo: false,
  });

  return { user, token };
}

export async function createAdmin() {
  return createUser({
    nombre: "Admin",
    email: `admin_${Date.now()}@test.com`,
    rol: "admin",
  });
}

export async function createEmpresa(
  userId: number,
  overrides?: {
    nombre?: string;
    rubro?: string;
    direccion?: string;
    comuna?: string;
  },
) {
  const data = {
    nombre: overrides?.nombre || "Test Empresa",
    rubro: overrides?.rubro || "tecnologia",
    direccion: overrides?.direccion || null,
    comuna: overrides?.comuna || null,
  };

  const [empresa] = await db.insert(empresas).values(data).returning();

  await db.insert(usuarioEmpresas).values({
    usuarioId: userId,
    empresaId: empresa.id,
    rol: "admin",
  });

  return empresa;
}

export async function createTienda(
  empresaId: number,
  overrides?: {
    nombre?: string;
    direccion?: string;
    ciudadId?: number;
  },
) {
  const data = {
    nombre: "Test Sucursal",
    direccion: "Calle Principal 123",
    ciudadId: null as number | null,
    ...overrides,
  };

  const [tienda] = await db
    .insert(tiendas)
    .values({ ...data, empresaId })
    .returning();

  return tienda;
}

export async function createCiudad(overrides?: {
  nombre?: string;
  region?: string;
}) {
  const [ciudad] = await db
    .insert(ciudades)
    .values({
      nombre: overrides?.nombre || "Santiago",
      region: overrides?.region || "Metropolitana",
    })
    .returning();

  return ciudad;
}

export async function createAnalisis(
  userId: number,
  tiendaId: number,
  overrides?: {
    status?: string;
    payloadData?: any;
    payloadProcesado?: any;
    procesado?: boolean;
  },
) {
  const [analisisRecord] = await db
    .insert(analisis)
    .values({
      tiendaId,
      usuarioId: userId,
      status: overrides?.status || "completed",
      payloadData: overrides?.payloadData || { busqueda: { tema: "test", ubicacion: "test" }, empresas: [] },
      payloadProcesado: overrides?.payloadProcesado || null,
      procesado: overrides?.procesado ?? true,
    })
    .returning();

  return analisisRecord;
}

export async function createSuscripcion(
  userId: number,
  overrides?: {
    plan?: string;
    precio?: number;
    moneda?: string;
    estado?: string;
    fechaFin?: Date;
    referenciaPago?: string;
  },
) {
  const fechaFin =
    overrides?.fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const [suscripcion] = await db
    .insert(suscripciones)
    .values({
      usuarioId: userId,
      plan: overrides?.plan || "premium",
      precio: overrides?.precio || 50000,
      moneda: overrides?.moneda || "CLP",
      estado: overrides?.estado || "activa",
      fechaInicio: new Date(),
      fechaFin,
      referenciaPago: overrides?.referenciaPago || null,
    })
    .returning();

  return suscripcion;
}

export async function createTicket(
  userId: number,
  empresaId: number,
  overrides?: {
    asunto?: string;
    descripcion?: string;
    status?: string;
    prioridad?: string;
  },
) {
  const [ticket] = await db
    .insert(tickets)
    .values({
      usuarioId: userId,
      empresaId,
      asunto: overrides?.asunto || "Test asunto",
      descripcion: overrides?.descripcion || "Test descripción",
      status: overrides?.status || "abierto",
      prioridad: overrides?.prioridad || "media",
    })
    .returning();

  return ticket;
}

export async function cleanDatabase() {
  const tables = [
    analisis,
    inventarios,
    tickets,
    suscripciones,
    usuarioEmpresas,
    tiendas,
    ciudades,
    empresas,
    usuarios,
  ];

  for (const table of tables) {
    await db.delete(table);
  }
}

export async function createUserWithFullSetup(overrides?: {
  rubro?: string;
  conDireccion?: boolean;
}) {
  const { user, token } = await createUser();
  const empresa = await createEmpresa(user.id, {
    rubro: overrides?.rubro || "tecnologia",
  });
  const tienda = await createTienda(empresa.id, {
    direccion: overrides?.conDireccion !== false ? "Dirección Test 123" : undefined,
  });

  const updatedToken = await signToken({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    empresaActivaId: empresa.id,
    tiendaActivaId: tienda.id,
    planActivo: true,
  });

  return { user, token: updatedToken, empresa, tienda };
}
