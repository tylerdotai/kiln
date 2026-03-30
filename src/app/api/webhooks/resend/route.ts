import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";

/**
 * Resend webhook handler.
 * Verifies the webhook signature and logs email events:
 *   email.delivered, email.bounced, email.opened
 */

const RESEND_SIGNATURE_HEADER = "resend-signature";

/** Verify the Resend webhook signature using HMAC-SHA256. */
async function verifySignature(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  const signatureHeader = req.headers.get(RESEND_SIGNATURE_HEADER) ?? "";

  if (!signatureHeader) return false;

  const secret = env.RESEND_API_KEY;

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  try {
    return (
      crypto.timingSafeEqual(
        Buffer.from(expectedSig, "hex"),
        Buffer.from(signatureHeader, "hex")
      ) ?? false
    );
  } catch {
    return false;
  }
}

function reject(status: number, message: string) {
  console.error(`[resend-webhook] Rejected (${status}): ${message}`);
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  console.log(`[resend-webhook] Received event`);

  // 1. Verify signature
  const isValid = await verifySignature(req, rawBody);
  if (!isValid) {
    return reject(401, "Invalid webhook signature");
  }

  // 2. Parse payload
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return reject(400, "Invalid JSON payload");
  }

  const eventType = (payload.type as string) ?? "unknown";

  console.log(`[resend-webhook] Processing event: ${eventType}`, {
    emailId: payload.email_id,
    from: payload.from,
    to: payload.to,
    timestamp: payload.timestamp,
  });

  switch (eventType) {
    case "email.delivered":
      handleDelivered(payload);
      break;
    case "email.bounced":
      handleBounced(payload);
      break;
    case "email.opened":
      handleOpened(payload);
      break;
    default:
      console.log(`[resend-webhook] Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}

function handleDelivered(payload: Record<string, unknown>) {
  console.log(`[resend-webhook] email.delivered`, {
    emailId: payload.email_id,
    to: payload.to,
    deliveredAt: payload.timestamp,
  });
  // TODO: update email tracking status in DB if needed
}

function handleBounced(payload: Record<string, unknown>) {
  console.log(`[resend-webhook] email.bounced`, {
    emailId: payload.email_id,
    to: payload.to,
    bounceReason: (payload as Record<string, unknown>).bounce_reason,
  });
  // TODO: mark recipient as bounced, suppress future sends
}

function handleOpened(payload: Record<string, unknown>) {
  console.log(`[resend-webhook] email.opened`, {
    emailId: payload.email_id,
    to: payload.to,
    firstOpenedAt: (payload as Record<string, unknown>).opened_at,
  });
  // TODO: record open event for analytics / engagement tracking
}
