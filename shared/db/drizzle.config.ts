import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  out: "./migrations",
  dbCredentials: {
    url: "postgres://pymeadmin:liter%40lvin123@pymetracker-db.postgres.database.azure.com:5432/postgres?sslmode=require",
  },
});