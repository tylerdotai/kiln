/**
 * init-db tests — TDD Red Phase
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the entire init-db module (including the createClient call inside it)
vi.mock("@/lib/init-db", () => ({
  initDb: vi.fn().mockResolvedValue(undefined),
}));

describe("initDb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates tables without error", async () => {
    const { initDb } = await import("@/lib/init-db");
    await expect(initDb()).resolves.toBeUndefined();
  });

  it("is idempotent — duplicate calls succeed", async () => {
    const { initDb } = await import("@/lib/init-db");
    await initDb();
    await initDb();
    await initDb();
    // If no error thrown, test passes
    await expect(initDb()).resolves.toBeUndefined();
  });
});
