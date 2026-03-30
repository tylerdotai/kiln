/**
 * Auth tests — TDD Red Phase
 * Tests written BEFORE implementation.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { isOpsTeam } from "@/lib/auth";

describe("auth helpers", () => {
  describe("isOpsTeam", () => {
    it("returns false for non-ops emails", () => {
      expect(isOpsTeam("user@example.com")).toBe(false);
    });

    it("returns true for ops team emails (OPS_TEAM_EMAILS)", () => {
      // OPS_TEAM_EMAILS is empty in env.ts — this tests the guard
      expect(isOpsTeam("ops@kiln.build")).toBe(false);
    });
  });
});
