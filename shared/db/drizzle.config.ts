import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  out: "./migrations",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://neondb_owner:npg_2EOswb7lXhno@ep-lucky-term-ac6cyx9t-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
