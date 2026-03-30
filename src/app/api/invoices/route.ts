/**
 * Invoices API
 * GET /api/invoices — list invoices for current user
 */

import { NextRequest, NextResponse } from "next/server";
import { getPolarInvoices } from "@/lib/polar";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getCurrentUser(req);

  if (!user || !user.polarCustomerId) {
    return NextResponse.json({ invoices: [] });
  }

  try {
    const invoices = await getPolarInvoices(user.polarCustomerId);

    const formatted = invoices.map((inv) => ({
      id: inv.id,
      amount: inv.amount / 100, // convert from cents
      currency: inv.currency.toUpperCase(),
      status: inv.status,
      invoiceUrl: inv.invoice_url,
      periodStart: inv.period_start,
      periodEnd: inv.period_end,
      createdAt: inv.created_at,
    }));

    return NextResponse.json({ invoices: formatted });
  } catch (err) {
    console.error("[Invoices] Error:", err);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
