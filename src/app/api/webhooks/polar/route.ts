/**
 * Polar.sh Webhook Handler
 * Verifies HMAC signature and handles payment events.
 *
 * payment.created → record checkout
 * payment.succeeded → trigger deploy, send DeploymentLiveEmail
 * payment.failed → send PaymentFailedEmail
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { deployments, users } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";
import { eq } from "drizzle-orm";

function verifySignature(body: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

async function triggerDeploy(userId: string, checkoutId: string) {
  // Call our own deploy API
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/deploy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-deploy-signature": crypto
          .createHmac("sha256", process.env.DEPLOY_HMAC_SECRET ?? "")
          .update(JSON.stringify({ userId, checkoutId }))
          .digest("hex"),
      },
      body: JSON.stringify({
        userId,
        checkoutId,
        channel: "discord", // default — customer picks in onboarding
        anthropicKey: "", // customer provides in onboarding
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("[webhook] triggerDeploy failed:", err);
    return { error: "Deploy trigger failed" };
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("polar-signature") ?? "";
  const secret = process.env.POLAR_WEBHOOK_SECRET ?? "";

  if (!verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type: string; data: Record<string, string> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type;
  const d = event.data ?? {};

  console.log(`[Polar webhook] ${eventType}`);

  try {
    switch (eventType) {
      case "payment.created": {
        const checkoutId = d.id;
        console.log(`[Polar] Payment created: ${checkoutId}`);
        break;
      }

      case "payment.succeeded": {
        const customerId = d.customer_id;
        const checkoutId = d.checkout_id;
        const amount = parseInt(d.amount ?? "0") / 100;

        // Find user by polar customer id
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.polarCustomerId, customerId))
          .limit(1);

        if (user) {
          // Trigger deploy
          const deploy = await triggerDeploy(user.id, checkoutId);

          // Update deployment status
          if (deploy.deploymentId) {
            await db
              .update(deployments)
              .set({
                status: "deployed",
                polarCheckoutId: checkoutId,
                updatedAt: new Date(),
              })
              .where(eq(deployments.id, deploy.deploymentId));
          }

          // Send email
          const agentUrl = deploy.url ?? `https://${deploy.flyAppName ?? "your-agent"}.fly.dev`;
          await sendEmail({
            to: user.email,
            subject: "Your KILN agent is live!",
            html: `
              <div style="font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 48px 24px; max-width: 560px; margin: 0 auto;">
                <h1 style="font-size: 32px; font-weight: 700; color: #E85D26; margin: 0 0 24px;">Your agent is deployed.</h1>
                <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 16px;">
                  Payment confirmed. Your OpenClaw agent is spinning up on Fly.io.
                </p>
                <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                  Next: complete your channel setup by visiting your agent's setup wizard.
                </p>
                <a href="${agentUrl}/setup" style="display: inline-block; background: #E85D26; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                  Open setup wizard →
                </a>
                <p style="color: #606060; font-size: 12px; margin-top: 32px;">
                  Your agent: ${agentUrl}
                </p>
              </div>
            `,
          });
        }
        break;
      }

      case "payment.failed": {
        const customerId = d.customer_id;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.polarCustomerId, customerId))
          .limit(1);

        if (user) {
          await sendEmail({
            to: user.email,
            subject: "Payment failed — update your billing",
            html: `
              <div style="font-family: Georgia, serif; background: #0a0a0a; color: #f5f5f5; padding: 48px 24px; max-width: 560px; margin: 0 auto;">
                <h1 style="font-size: 32px; font-weight: 700; color: #f5f5f5; margin: 0 0 24px;">Payment failed.</h1>
                <p style="color: #a0a0a0; line-height: 1.6; margin: 0 0 24px;">
                  We couldn't process your payment. Your agent deployment is on hold until billing is updated.
                </p>
                <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/billing" style="display: inline-block; background: #E85D26; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                  Update billing →
                </a>
              </div>
            `,
          });
        }
        break;
      }

      default:
        console.log(`[Polar] Unhandled event: ${eventType}`);
    }
  } catch (err) {
    console.error("[Polar webhook] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
