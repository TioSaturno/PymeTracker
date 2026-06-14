import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url =
  process.env.DATABASE_URL ?? "postgres://loky:loky@localhost:5433/IngSoft";

console.log("url", url);

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://neondb_owner:npg_2EOswb7lXhno@ep-lucky-term-ac6cyx9t-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Singleton — reutiliza el pool en toda la app
const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export type DB = typeof db;
