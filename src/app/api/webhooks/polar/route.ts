/**
 * Polar.sh Webhook Handler
 * Verifies HMAC signature and handles payment events.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, deployments } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("polar-signature") ?? "";
  const secret = process.env.POLAR_WEBHOOK_SECRET ?? "";

  if (!verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);
  const eventType = event.type;

  try {
    switch (eventType) {
      case "payment.created":
        // Handle payment created
        break;
      case "payment.succeeded": {
        const customerId = event.data.customer_id;
        const user = await db.query.users.findFirst({
          where: eq(users.polarCustomerId, customerId),
        });
        if (user) {
          // Mark deployment as deployed
          await sendEmail({
            to: user.email,
            subject: "Your KILN deployment is live!",
            html: `<p>Your SaaS is deployed and running. Log in to see your dashboard.</p>`,
          });
        }
        break;
      }
      case "payment.failed": {
        const customerId = event.data.customer_id;
        const user = await db.query.users.findFirst({
          where: eq(users.polarCustomerId, customerId),
        });
        if (user) {
          await sendEmail({
            to: user.email,
            subject: "Payment failed — update your billing",
            html: `<p>We could not process your payment. Please update your billing info.</p>`,
          });
        }
        break;
      }
      default:
        console.log(`[Polar] Unhandled event: ${eventType}`);
    }
  } catch (err) {
    console.error("[Polar] Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
