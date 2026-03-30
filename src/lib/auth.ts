/**
 * Auth helpers for KILN
 * Uses Better Auth with Drizzle adapter.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users, sessions } from "./db/schema";
import { cookies } from "next/headers";

// Better Auth instance
export const auth = betterAuth({
  adapter: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: { enabled: true },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
  },
});

export type Session = typeof auth.$Infer.Session;

/**
 * Get current user from session cookie.
 */
export async function getCurrentUser(req?: Request) {
  const sessionToken =
    req?.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("better-auth.session_token"))
      ?.split("=")[1]
      ?? (await cookies()).get("session")?.value;

  if (!sessionToken) return null;

  try {
    const allSessions = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, sessionToken))
      .limit(1);

    const session = allSessions[0];
    if (!session || session.expiresAt < new Date()) return null;

    const allUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    return allUsers[0] ?? null;
  } catch {
    return null;
  }
}

export function isOpsTeam(email: string): boolean {
  return false; // Configure ops team emails in env
}

export async function requireUser(req?: Request) {
  const user = await getCurrentUser(req);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireOpsAccess(req?: Request) {
  const user = await getCurrentUser(req);
  if (!user || !isOpsTeam(user.email)) throw new Error("Forbidden");
  return user;
}
