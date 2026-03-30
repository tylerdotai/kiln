import { auth } from "./auth";
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");

  if (!sessionToken?.value) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${sessionToken.value}`,
    },
  });

  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
