/**
 * Database client for KILN
 * Uses Drizzle ORM with libsql.
 * Local: file:local.db
 * Production (Fly): file:/data/kiln.db (persistent volume)
 */
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./db/schema";

function getDbUrl() {
  const env = process.env.NODE_ENV;
  if (env === "production") {
    return process.env.DATABASE_URL ?? "file:/data/kiln.db";
  }
  return process.env.DATABASE_URL ?? "file:local.db";
}

const client = createClient({ url: getDbUrl() });
export const db = drizzle(client, { schema });
