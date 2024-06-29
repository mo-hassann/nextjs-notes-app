import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgres://postgres:postgres@localhost:3001/todo`,
  },
  verbose: true,
  strict: true,
});
