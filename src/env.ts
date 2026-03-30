/**
 * Environment variables for KILN
 * Centralizes access to all env vars used across the app.
 */

export const POLAR_API_KEY = process.env.POLAR_API_KEY ?? "";
export const POLAR_ORGANIZATION_ID = process.env.POLAR_ORGANIZATION_ID ?? "";
export const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET ?? "";
export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://kiln.build";
export const NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY ?? "";

// Price IDs (server-only)
export const POLAR_PRICE_PRO_MONTHLY = process.env.POLAR_PRICE_PRO_MONTHLY ?? "";
export const POLAR_PRICE_PRO_ANNUAL = process.env.POLAR_PRICE_PRO_ANNUAL ?? "";
export const POLAR_PRICE_TEAM_MONTHLY = process.env.POLAR_PRICE_TEAM_MONTHLY ?? "";
export const POLAR_PRICE_TEAM_ANNUAL = process.env.POLAR_PRICE_TEAM_ANNUAL ?? "";

// Auth
export const AUTH_SECRET = process.env.AUTH_SECRET ?? "";
export const AUTH_GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_CLIENT_ID ?? "";
export const AUTH_GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_CLIENT_SECRET ?? "";

// Ops team allowlist (comma-separated emails)
export const OPS_TEAM_EMAILS = (process.env.OPS_TEAM_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean);
