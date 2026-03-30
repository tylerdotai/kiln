import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    deployments: { used: 0, limit: 5 },
    emails: { used: 0, limit: 1000 },
    webhooks: { used: 0, limit: 10 },
  });
}
