/**
 * POST /api/deploy
 *
 * Deploys a customer's OpenClaw agent to Fly.io.
 *
 * Called by:
 * 1. Polar webhook (payment.succeeded) — automated
 * 2. Onboarding page — for free tier or after payment
 *
 * Steps:
 * 1. Validate HMAC (if from webhook)
 * 2. Create Fly.io app via API
 * 3. Call deploy-agent.ts to run flyctl deploy
 * 4. Save deployment record to DB
 * 5. Send deployment email with setup wizard link
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { deployments } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";

const FLY_API = "https://api.fly.io";

function hmacSign(body: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

function verifyHmac(req: NextRequest, secret: string): boolean {
  const signature = req.headers.get("x-deploy-signature") ?? "";
  const body = req.url.includes("?") ? req.url.split("?")[1] : "";
  const expected = hmacSign(body, secret);
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function createFlyApp(appName: string, org: string): Promise<string | null> {
  const res = await fetch(`${FLY_API}/v1/apps`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.FLY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_name: appName,
      org_slug: org,
      runtime: "firecracker",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[fly] createApp failed:", err);
    return null;
  }

  const data = await res.json();
  return data.id ?? null;
}

async function runDeploy(script: string, args: string[]): Promise<void> {
  const { spawn } = require("child_process") as any;
  return new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", `${script} ${args.join(" ")} 2>&1`]);
    let output = "";
    child.stdout?.on?.("data", (d: any) => { output += d; });
    child.stderr?.on?.("data", (d: any) => { output += d; });
    child.on?.("close", (code: any) => {
      if (code === 0) { console.log("[deploy] output:", output); resolve(); }
      else { console.error("[deploy] failed:", output); reject(new Error(`deploy exited ${code}`)); }
    });
  });
}

export async function POST(req: NextRequest) {
  // Verify HMAC for webhook calls (Polar uses x-deploy-signature)
  const body = await req.text();
  const signature = req.headers.get("x-deploy-signature") ?? "";

  if (signature && env.DEPLOY_HMAC_SECRET) {
    const expected = crypto.createHmac("sha256", env.DEPLOY_HMAC_SECRET).update(body).digest("hex");
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: Record<string, string>;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    userId,
    channel = "discord",
    anthropicKey,
    discordToken,
    telegramToken,
    slackToken,
    allowedIds,
    flyRegion = "iad",
    appName: requestedAppName,
  } = payload;

  // Generate app name if not provided
  const slug = requestedAppName ?? `kiln-${userId ?? Math.random().toString(36).slice(2, 10)}`;
  const appName = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 30);

  try {
    // 1. Create Fly app
    const flyAppId = await createFlyApp(appName, env.FLY_ORG);
    if (!flyAppId) {
      return NextResponse.json({ error: "Failed to create Fly.io app" }, { status: 500 });
    }

    // 2. Save deployment record
    const [deployment] = await db
      .insert(deployments)
      .values({
        id: `dep_${Date.now()}`,
        userId: userId ?? "anonymous",
        templateName: channel,
        subdomain: appName,
        flyAppId,
        flyAppName: appName,
        region: flyRegion,
        status: "provisioning",
        polarCheckoutId: payload.checkoutId ?? null,
        customerFlyToken: null, // encrypted separately
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 3. Run deploy script (async — customer waits via polling)
    const deployScript = `
      set -e
      export FLY_API_TOKEN="${env.FLY_API_TOKEN}"
      export FLY_APP="${appName}"
      export FLY_REGION="${flyRegion}"

      # Create volume
      fly volumes create clawd_data --region $FLY_REGION --app $FLY_APP --size 10 --encrypted --yes 2>/dev/null || true

      # Set secrets
      fly secrets set \
        OPENCLAW_GATEWAY_TOKEN="$(openssl rand -hex 16)" \
        ANTHROPIC_API_KEY="${anthropicKey}" \
        ${channel === "discord" ? `DISCORD_BOT_TOKEN="${discordToken}" \\` : ""}
        ${channel === "telegram" ? `TELEGRAM_BOT_TOKEN="${telegramToken}" \\` : ""}
        ${channel === "slack" ? `SLACK_BOT_TOKEN="${slackToken}" \\` : ""}
        --app $FLY_APP --stage 2>/dev/null || true

      # Deploy
      git clone https://github.com/tylerdotai/kiln.git /tmp/kiln-template 2>/dev/null || true
      cd /tmp/kiln-template
      fly deploy --app $FLY_APP --region $FLY_REGION --remote-only --yes 2>&1
    `;

    // Fire and forget — customer polls /api/deploy/:id for status
    const { spawn } = require("child_process") as any;
    spawn("bash", ["-c", deployScript], { detached: true, stdio: "ignore" }).unref();

    const agentUrl = `https://${appName}.fly.dev`;

    return NextResponse.json({
      deploymentId: deployment.id,
      url: agentUrl,
      status: "provisioning",
    });
  } catch (err) {
    console.error("[deploy] error:", err);
    return NextResponse.json({ error: "Deploy failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!id && !userId) {
    return NextResponse.json({ error: "id or userId required" }, { status: 400 });
  }

  try {
    const results = await db
      .select()
      .from(deployments)
      .where(id ? undefined : undefined) // simplified for now
      .limit(1);

    const dep = results[0];
    if (!dep) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: dep.id,
      status: dep.status,
      url: dep.status === "deployed" ? `https://${dep.flyAppName}.fly.dev` : null,
      updatedAt: dep.updatedAt,
    });
  } catch {
    return NextResponse.json({ status: "provisioning" });
  }
}
