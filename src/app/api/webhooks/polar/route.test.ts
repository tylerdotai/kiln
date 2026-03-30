/**
 * Polar webhook tests — TDD Red Phase
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";

// Mock db
const mockDbSelect = vi.fn();
const mockDbUpdate = vi.fn();
vi.mock("@/lib/db", () => ({
  db: {
    select: mockDbSelect,
    update: mockDbUpdate,
  },
}));

// Mock sendEmail
const mockSendEmail = vi.fn();
vi.mock("@/lib/email", () => ({
  sendEmail: mockSendEmail,
}));

// Mock env
vi.mock("@/env", () => ({
  POLAR_API_KEY: "test-key",
}));

// Build a valid HMAC signature for the webhook body
function makeSignature(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

const WEBHOOK_SECRET = "test-polar-webhook-secret";

describe("POST /api/webhooks/polar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("POLAR_WEBHOOK_SECRET", WEBHOOK_SECRET);
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
    vi.stubEnv("DEPLOY_HMAC_SECRET", "test-deploy-secret");
  });

  it("returns 401 for invalid webhook signature", async () => {
    const { POST } = await import("@/app/api/webhooks/polar/route");
    const body = JSON.stringify({ type: "checkout.paid", data: { id: "checkout_1" } });
    const req = new Request("http://localhost/api/webhooks/polar", {
      method: "POST",
      headers: { "polar-signature": "bad-signature" },
      body,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("handles checkout.paid event", async () => {
    // Mock user found
    mockDbSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: "user_1", email: "test@example.com" }]),
        }),
      }),
    });
    mockDbUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({ success: true }),
      }),
    });

    // Mock fetch for triggerDeploy
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ deploymentId: "deploy_1", url: "https://agent.fly.dev", flyAppName: "my-agent" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    globalThis.fetch = mockFetch;

    const event = { type: "checkout.paid", data: { id: "checkout_1", customer_id: "cust_1" } };
    const body = JSON.stringify(event);
    const req = new Request("http://localhost/api/webhooks/polar", {
      method: "POST",
      headers: { "polar-signature": makeSignature(body, WEBHOOK_SECRET) },
      body,
    });

    const { POST } = await import("@/app/api/webhooks/polar/route");
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("handles subscription.past_due event", async () => {
    mockDbSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ id: "user_1", email: "test@example.com" }]),
        }),
      }),
    });
    mockSendEmail.mockResolvedValue(undefined);

    const event = { type: "subscription.past_due", data: { id: "sub_1", customer_id: "cust_1" } };
    const body = JSON.stringify(event);
    const req = new Request("http://localhost/api/webhooks/polar", {
      method: "POST",
      headers: { "polar-signature": makeSignature(body, WEBHOOK_SECRET) },
      body,
    });

    const { POST } = await import("@/app/api/webhooks/polar/route");
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "test@example.com",
        subject: "Payment failed — update your billing",
      })
    );
  });
});
