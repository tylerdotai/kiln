/**
 * Polar.sh API client for KILN billing operations.
 * Handles subscription management, checkout creation, and invoice fetching.
 */

import { POLAR_API_KEY } from "@/env";

const POLAR_API_BASE = "https://api.polar.sh/v1";

interface PolarHeaders {
  Authorization: string;
  "Content-Type": string;
}

const headers: Record<string, string> = {
  Authorization: `Bearer ${POLAR_API_KEY}`,
  "Content-Type": "application/json",
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PolarProduct {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PolarPrice {
  id: string;
  product_id: string;
  amount: number; // in cents
  currency: string;
  recurring_interval: "month" | "year" | null;
  type: "one_time" | "recurring";
  created_at: string;
}

export interface PolarSubscription {
  id: string;
  organization_id: string;
  customer_id: string;
  price_id: string;
  status: "active" | "cancelled" | "past_due" | "trialing" | "paused";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown>;
}

export interface PolarCheckout {
  id: string;
  url: string;
  status: "pending" | "completed" | "expired" | "cancelled";
  price_id: string;
  customer_id: string;
  created_at: string;
}

export interface PolarInvoice {
  id: string;
  customer_id: string;
  subscription_id: string;
  amount: number; // in cents
  currency: string;
  status: "paid" | "open" | "void" | "uncollectible";
  invoice_url: string | null;
  period_start: string;
  period_end: string;
  created_at: string;
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getPolarProducts(): Promise<PolarProduct[]> {
  const res = await fetch(`${POLAR_API_BASE}/products`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

export async function getPolarProduct(productId: string): Promise<PolarProduct> {
  const res = await fetch(`${POLAR_API_BASE}/products/${productId}`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  return res.json();
}

// ─── Prices ──────────────────────────────────────────────────────────────────

export async function getPolarPrices(productId: string): Promise<PolarPrice[]> {
  const res = await fetch(`${POLAR_API_BASE}/products/${productId}/prices`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function getPolarSubscription(
  subscriptionId: string
): Promise<PolarSubscription> {
  const res = await fetch(`${POLAR_API_BASE}/subscriptions/${subscriptionId}`, {
    headers,
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  return res.json();
}

export async function getPolarSubscriptions(customerId: string): Promise<PolarSubscription[]> {
  const res = await fetch(
    `${POLAR_API_BASE}/subscriptions?customer_id=${customerId}&limit=10`,
    { headers, next: { revalidate: 30 } }
  );
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

export async function cancelPolarSubscription(subscriptionId: string): Promise<void> {
  const res = await fetch(`${POLAR_API_BASE}/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
}

export async function pausePolarSubscription(subscriptionId: string): Promise<void> {
  const res = await fetch(`${POLAR_API_BASE}/subscriptions/${subscriptionId}/pause`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
}

// ─── Checkouts ───────────────────────────────────────────────────────────────

export async function createPolarCheckout(params: {
  priceId: string;
  customerId?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}): Promise<PolarCheckout> {
  const res = await fetch(`${POLAR_API_BASE}/checkouts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      price_id: params.priceId,
      customer_id: params.customerId,
      customer_email: params.customerEmail,
      success_url: params.successUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: params.cancelUrl ?? `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: params.metadata ?? {},
    }),
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  return res.json();
}

// ─── Invoices ────────────────────────────────────────────────────────────────

export async function getPolarInvoices(customerId: string): Promise<PolarInvoice[]> {
  const res = await fetch(`${POLAR_API_BASE}/invoices?customer_id=${customerId}&limit=20`, {
    headers,
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  const data = await res.json();
  return data.items ?? [];
}

// ─── Organizations (for ops dashboard) ────────────────────────────────────────

export async function getPolarOrganizationStats(): Promise<{
  total_subscriptions: number;
  active_subscriptions: number;
  mrr: number;
  churn_rate: number;
}> {
  const res = await fetch(`${POLAR_API_BASE}/organizations/current`, {
    headers,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);
  const org = await res.json();
  return {
    total_subscriptions: org.total_subscriptions ?? 0,
    active_subscriptions: org.active_subscriptions ?? 0,
    mrr: org.mrr ?? 0,
    churn_rate: org.churn_rate ?? 0,
  };
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

export function verifyPolarWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Polar uses HMAC-SHA256 signatures
  const crypto = require("crypto");
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return signature === `sha256=${expectedSig}`;
}
