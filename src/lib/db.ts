/**
 * Database client for KILN
 * Uses Drizzle ORM with libsql.
 * Local development: file:local.db
 * Production (Fly.io): /data/kiln.db (persistent volume)
 */
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./db/schema";

function getDbUrl() {
  // In production on Fly, use the persistent volume
  if (process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL ?? "file:/data/kiln.db";
  }
  // Local development
  return process.env.DATABASE_URL ?? "file:local.db";
}

const client = createClient({
  url: getDbUrl(),
});

export const db = drizzle(client, { schema });
