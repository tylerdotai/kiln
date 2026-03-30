import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // @ts-ignore — Better Auth 1.5 api types don't expose this cleanly
    const session = await (auth as any).api.signInEmailAndPassword({
      body: {
        email: body.email,
        password: body.password,
      },
    });

    return NextResponse.json({ user: session?.user ?? null });
  } catch (error: any) {
    console.error("[signin]", error?.message ?? error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
