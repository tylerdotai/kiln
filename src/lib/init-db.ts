/**
 * Initialize SQLite database and tables on first startup.
 * Uses multi-statement execution for SQLite.
 * Safe to run multiple times — uses CREATE TABLE IF NOT EXISTS.
 */
import { createClient } from "@libsql/client";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text,
  password_hash text NOT NULL,
  polar_customer_id text,
  subscription_status text,
  current_period_end integer,
  cancel_at_period_end integer DEFAULT false,
  tier text DEFAULT 'starter',
  created_at integer NOT NULL,
  updated_at integer NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  expires_at integer NOT NULL,
  created_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS deployments (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  template_name text NOT NULL,
  subdomain text NOT NULL,
  fly_app_id text,
  fly_app_name text,
  region text DEFAULT 'iad',
  status text DEFAULT 'pending' NOT NULL,
  deployment_url text,
  polar_checkout_id text,
  polar_subscription_id text,
  open_ai_key text,
  database_url text,
  customer_fly_token text,
  created_at integer NOT NULL,
  updated_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS api_keys (
  id text PRIMARY KEY NOT NULL,
  user_id text NOT NULL,
  deployment_id text,
  provider text NOT NULL,
  encrypted_value text NOT NULL,
  iv text NOT NULL,
  created_at integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (deployment_id) REFERENCES deployments(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);
`;

export async function initDb(): Promise<void> {
  const url = process.env.DATABASE_URL ?? (
    process.env.NODE_ENV === "production"
      ? "file:/data/kiln.db"
      : "file:local.db"
  );

  const client = createClient({ url });

  try {
    // Execute each statement individually for SQLite
    const statements = SCHEMA_SQL.trim().split(/\s*;\s*/).filter(Boolean);
    for (const stmt of statements) {
      if (stmt.trim()) {
        await client.execute(stmt);
      }
    }
    console.log("[db] Tables initialized at", url);
  } catch (err) {
    console.error("[db] Table init error:", err);
    throw err;
  } finally {
    client.close();
  }
}

