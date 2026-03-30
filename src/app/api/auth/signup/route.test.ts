/**
 * Signup API tests — TDD Red Phase
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock initDb before importing the route module
vi.mock("@/lib/init-db", () => ({
  initDb: vi.fn().mockResolvedValue(undefined),
}));

// Mock better-auth's signUpEmailAndPassword
const mockSignUp = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signUpEmailAndPassword: mockSignUp,
    },
  },
}));

// Inline route test: we import handler after mocking
// Use a dynamic import after mocks are set up

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 for valid signup", async () => {
    mockSignUp.mockResolvedValue({
      user: { id: "user_1", email: "test@example.com", name: "Test" },
      session: { id: "sess_1" },
    });

    const { POST } = await import("@/app/api/auth/signup/route");
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password123", name: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 400 for duplicate email", async () => {
    mockSignUp.mockRejectedValue(new Error("Email already exists"));

    const { POST } = await import("@/app/api/auth/signup/route");
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "dup@example.com", password: "password123", name: "Test" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is missing", async () => {
    mockSignUp.mockRejectedValue(new Error("Validation error"));

    const { POST } = await import("@/app/api/auth/signup/route");
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "password123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is missing", async () => {
    mockSignUp.mockRejectedValue(new Error("Validation error"));

    const { POST } = await import("@/app/api/auth/signup/route");
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
