/**
 * Checkout API
 * POST /api/checkout
 *
 * Creates a Polar.sh checkout session for a given price ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { createPolarCheckout } from "@/lib/polar";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId, annual } = await req.json();

  if (!priceId) {
    return NextResponse.json({ error: "priceId is required" }, { status: 400 });
  }

  try {
    const checkout = await createPolarCheckout({
      priceId,
      customerId: user.polarCustomerId ?? undefined,
      customerEmail: user.email,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId: user.id,
        annual: annual ? "true" : "false",
      },
    });

    return NextResponse.json({ checkoutUrl: checkout.url, checkoutId: checkout.id });
  } catch (err) {
    console.error("[Checkout] Error creating checkout:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
