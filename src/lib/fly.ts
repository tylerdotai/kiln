/**
 * Fly.io API client for KILN.
 *
 * Used to orchestrate customer deployments — each "fire" event
 * creates a new Fly.io app under the KILN operator's org.
 *
 * API reference: https://fly.io/docs/flyctl/
 * Wire API: https://api.fly.io/
 */

import { env } from "@/lib/env";

const FLY_API_BASE = "https://api.fly.io";

interface FlyApp {
  id: string;
  name: string;
  org: string;
  status: string;
  created_at: string;
}

interface FlyAppStatus {
  name: string;
  status: "pending" | "success" | "failed" | "created";
  version: number;
  allocated: boolean;
}

interface CreateAppOptions {
  /** App name — must be unique across Fly.io, slug-friendly (lowercase, hyphens) */
  name: string;
  /** Organization slug (e.g., "personal" or a team org name) */
  org?: string;
  /** Preferred primary region (e.g., "iad", "dfw", "sfo") */
  region?: string;
}

/**
 * Create a new Fly.io app.
 *
 * KILN calls this when a customer fires a deployment.
 * The app is created under KILN's org by default (configurable via FLY_ORG).
 *
 * @param name  Unique app name (e.g., "acme-saas-prod")
 * @param org   Org slug — defaults to env.FLY_ORG
 */
export async function createApp(
  name: string,
  org?: string
): Promise<FlyApp> {
  const response = await fetch(`${FLY_API_BASE}/v1/apps`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FLY_API_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      org: org ?? env.FLY_ORG,
      network: "priate",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `[fly] Failed to create app "${name}": ${response.status} ${body}`
    );
  }

  const app = (await response.json()) as FlyApp;
  console.log(`[fly] Created app: ${app.name} (${app.id})`);
  return app;
}

/**
 * List all apps under the configured org.
 */
export async function listApps(): Promise<FlyApp[]> {
  const response = await fetch(
    `${FLY_API_BASE}/v1/apps?org=${encodeURIComponent(env.FLY_ORG)}`,
    {
      headers: {
        Authorization: `Bearer ${env.FLY_API_TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[fly] Failed to list apps: ${response.status} ${body}`);
  }

  const apps = (await response.json()) as FlyApp[];
  return apps;
}

/**
 * Get the status of a specific app.
 */
export async function getAppStatus(name: string): Promise<FlyAppStatus> {
  const response = await fetch(`${FLY_API_BASE}/v1/apps/${name}`, {
    headers: {
      Authorization: `Bearer ${env.FLY_API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { name, status: "failed", version: 0, allocated: false };
    }
    const body = await response.text();
    throw new Error(
      `[fly] Failed to get app status for "${name}": ${response.status} ${body}`
    );
  }

  return (await response.json()) as FlyAppStatus;
}

/**
 * Destroy (delete) a Fly.io app.
 *
 * @param name App name to destroy
 * @param force Skip confirmation (Fly.io API handles this with a token)
 */
export async function destroyApp(name: string, force = true): Promise<void> {
  const response = await fetch(`${FLY_API_BASE}/v1/apps/${name}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${env.FLY_API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `[fly] Failed to destroy app "${name}": ${response.status} ${body}`
    );
  }

  console.log(`[fly] Destroyed app: ${name}`);
}

/**
 * Get the public hostname for a deployed app.
 * Falls back to `<name>.fly.dev` if no custom cert is found.
 */
export function getAppHostname(name: string): string {
  return `${name}.fly.dev`;
}

/**
 * Slugify a string into a valid Fly.io app name.
 * Fly.io app names: lowercase, alphanumeric, hyphens only, max 22 chars.
 */
export function slugifyAppName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 22);
}
