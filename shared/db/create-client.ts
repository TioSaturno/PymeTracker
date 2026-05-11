import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://loky:loky@localhost:5433/IngSoft";

// Singleton — reutiliza el pool en toda la app
const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export type DB = typeof db;
