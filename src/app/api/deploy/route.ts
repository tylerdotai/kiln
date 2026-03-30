/**
 * Deploy Orchestration Route
 *
 * POST /api/deploy
 *
 * KILN's core orchestration endpoint. Called when a customer fires a deployment.
 *
 * Body:
 * {
 *   projectName: string;      // e.g., "Acme SaaS"
 *   template: string;         // e.g., "saas-starter", "api-only"
 *   userId: string;           // KILN user ID (from session)
 *   keys: {
 *     openai?: string;       // customer's OpenAI API key
 *     database?: string;     // customer's database URL (optional override)
 *     flyApiToken?: string;  // customer's own Fly.io token (future self-serve)
 *   };
 *   region?: string;          // preferred Fly.io region (default: "iad")
 * }
 *
 * Flow:
 *  1. Validate request (HMAC from Polar webhook or session token)
 *  2. Slugify project name → Fly.io app name
 *  3. Create Fly.io app via Fly API
 *  4. Store deployment record in DB
 *  5. Return app hostname to customer (Trigger task wires up async)
 */

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { deployments } from "@/lib/db/schema";
import {
  createApp,
  getAppStatus,
  getAppHostname,
  slugifyAppName,
} from "@/lib/fly";
import { env } from "@/lib/env";

const DEPLOY_HMAC_SECRET = process.env.DEPLOY_HMAC_SECRET ?? "";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function reject(status: number, message: string, details?: unknown) {
  console.error(`[deploy] Rejected (${status}): ${message}`, details ?? "");
  return new NextResponse(
    JSON.stringify({ error: message, ...(details ? { details } : {}) }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}

async function verifyHmac(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  if (!DEPLOY_HMAC_SECRET) {
    console.warn("[deploy] DEPLOY_HMAC_SECRET not set — skipping verification");
    return true;
  }
  const sigHeader = req.headers.get("x-deploy-signature") ?? "";
  if (!sigHeader) return false;

  try {
    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", DEPLOY_HMAC_SECRET)
      .update(rawBody, "utf8")
      .digest("hex");
    return expected === sigHeader;
  } catch {
    return false;
  }
}

// ─── POST /api/deploy ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // 1. Verify HMAC
  if (!(await verifyHmac(req, rawBody))) {
    return reject(401, "Invalid or missing deploy signature");
  }

  // 2. Parse + validate body
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return reject(400, "Invalid JSON body");
  }

  const projectName =
    typeof body.projectName === "string" ? body.projectName.trim() : "";
  const template =
    typeof body.template === "string" ? body.template.trim() : "";
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const keys = (body.keys as Record<string, string | undefined>) ?? {};
  const region = typeof body.region === "string" ? body.region : "iad";

  if (!projectName) return reject(400, "projectName is required");
  if (!template) return reject(400, "template is required");
  if (!userId) return reject(400, "userId is required");

  // 3. Generate unique app name
  const uniqueSuffix = randomBytes(4).toString("hex").slice(0, 8);
  const rawName = `${slugifyAppName(projectName)}-${uniqueSuffix}`;
  const appName = rawName.slice(0, 22); // Fly.io limit: 22 chars

  console.log(
    `[deploy] Firing: project="${projectName}" template="${template}" ` +
      `user="${userId}" app="${appName}" region="${region}"`
  );

  try {
    // 4. Idempotency — check if already deployed
    const [existing] = await db
      .select()
      .from(deployments)
      .where(eq(deployments.flyAppName, appName))
      .limit(1);

    if (existing && existing.status === "deployed") {
      return NextResponse.json(
        {
          deploymentId: existing.id,
          appName,
          hostname: getAppHostname(appName),
          status: existing.status,
          url: existing.deploymentUrl ?? `https://${getAppHostname(appName)}`,
        },
        { status: 200 }
      );
    }

    // 5. Create Fly.io app
    const flyApp = await createApp(appName, env.FLY_ORG);

    // 6. Store deployment record
    const [deployment] = await db
      .insert(deployments)
      .values({
        id: `dep_${randomBytes(12).toString("hex")}`,
        userId,
        templateName: template,
        subdomain: appName,
        flyAppId: flyApp.id,
        flyAppName: flyApp.name,
        region,
        status: "provisioning",
        openAiKey: keys.openai ?? null,
        databaseUrl: keys.database ?? null,
        customerFlyToken: keys.flyApiToken ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log(`[deploy] Deployment record created: ${deployment.id}`);

    // 7. Trigger async build task (once Trigger.dev is wired up)
    // await deployAgentTask.trigger({ deploymentId: deployment.id, ... });

    return NextResponse.json(
      {
        deploymentId: deployment.id,
        appName: flyApp.name,
        hostname: getAppHostname(flyApp.name),
        status: "provisioning",
        message: `Deployment "${projectName}" is being fired up. You'll receive an email when it's live.`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[deploy] Error:", err);
    return reject(500, "Failed to create deployment", String(err));
  }
}

// ─── GET /api/deploy ──────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const appName = searchParams.get("appName");
  const deploymentId = searchParams.get("deploymentId");

  if (!appName && !deploymentId) {
    return reject(400, "appName or deploymentId query param is required");
  }

  try {
    // Look up by deploymentId first, then appName
    let deployment;
    if (deploymentId) {
      [deployment] = await db
        .select()
        .from(deployments)
        .where(eq(deployments.id, deploymentId))
        .limit(1);
    } else if (appName) {
      [deployment] = await db
        .select()
        .from(deployments)
        .where(eq(deployments.flyAppName, appName))
        .limit(1);
    }

    if (!deployment) {
      return reject(404, "Deployment not found");
    }

    const flyStatus = await getAppStatus(deployment.flyAppName ?? appName!);
    const hostname = getAppHostname(deployment.flyAppName ?? appName!);

    return NextResponse.json({
      deploymentId: deployment.id,
      appName: deployment.flyAppName,
      hostname,
      dbStatus: deployment.status,
      flyStatus: flyStatus.status,
      url:
        deployment.status === "deployed"
          ? deployment.deploymentUrl ?? `https://${hostname}`
          : null,
    });
  } catch (err) {
    console.error("[deploy] Error checking status:", err);
    return reject(500, "Failed to check deployment status", String(err));
  }
}
