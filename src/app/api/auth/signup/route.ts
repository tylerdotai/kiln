import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { initDb } from "@/lib/init-db";

// Ensure tables exist on first request
let dbInitialized = false;
async function ensureDb() {
  if (dbInitialized) return;
  await initDb();
  dbInitialized = true;
}

export async function POST(request: Request) {
  await ensureDb();

  try {
    const body = await request.json();
    // @ts-ignore — Better Auth 1.5 api types don't expose this cleanly
    const session = await (auth as any).api.signUpEmailAndPassword({
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
      },
    });

    return NextResponse.json({ user: session?.user ?? null });
  } catch (error: any) {
    console.error("[signup]", error?.message ?? error);
    return NextResponse.json({ error: "Could not create account" }, { status: 400 });
  }
}
