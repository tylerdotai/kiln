"use client";

import { useState } from "react";

const PLANS = [
  {
    id: "microsaas",
    name: "Micro SaaS",
    price: 9,
    description: "For solo founders just getting started",
    features: ["1 deployment", "1,000 API calls/mo", "Community support", "Basic analytics"],
  },
  {
    id: "saas-starter",
    name: "SaaS Starter",
    price: 29,
    description: "For growing SaaS products",
    features: ["3 deployments", "50,000 API calls/mo", "Priority support", "Advanced analytics", "Custom domain"],
    popular: true,
  },
  {
    id: "saas-pro",
    name: "SaaS Pro",
    price: 79,
    description: "For scaling businesses",
    features: ["10 deployments", "Unlimited API calls", "Dedicated support", "Custom SLA", "White-label"],
  },
];

const INVOICES = [
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: 29, status: "paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: 29, status: "paid" },
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: 29, status: "paid" },
];

function PlanBadge({ popular }: { popular?: boolean }) {
  if (!popular) return null;
  return (
    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
      Most popular
    </span>
  );
}

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  async function handleUpgrade(planId: string) {
    setUpgrading(planId);
    // Redirect to Polar portal for plan change
    window.location.href = `/api/billing/upgrade?plan=${planId}`;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-text mb-1">
          Billing
        </h1>
        <p className="text-secondary">
          Manage your subscription, invoices, and payment method.
        </p>
      </div>

      {/* Current plan */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-text">
              Current plan
            </h2>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-serif text-3xl font-bold text-text">
                SaaS Starter
              </span>
              <span className="text-secondary">$29/month</span>
            </div>
            <p className="text-sm text-secondary mt-1">
              Billed monthly · Next invoice: Apr 1, 2026
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Active
          </span>
        </div>

        {/* Usage */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          {[
            { label: "Deployments used", value: "2 / 3" },
            { label: "API calls this month", value: "12,430 / 50,000" },
            { label: "Storage used", value: "2.4 GB" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-xs text-secondary mb-1">{label}</div>
              <div className="text-sm font-medium text-text">{value}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <a
            href="/api/billing/portal"
            className="bg-surface border border-border text-text px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-background transition-colors"
          >
            Manage payment method
          </a>
          <button className="text-sm text-secondary hover:text-red-500 transition-colors">
            Cancel subscription
          </button>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold text-text">
          Change plan
        </h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${!annual ? "text-text font-medium" : "text-secondary"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-accent" : "bg-border"}`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${annual ? "left-7" : "left-1"}`}
            />
          </button>
          <span className={`text-sm ${annual ? "text-text font-medium" : "text-secondary"}`}>
            Annual <span className="text-accent text-xs">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-surface border rounded-2xl p-6 flex flex-col ${plan.popular ? "border-accent shadow-lg shadow-accent/10" : "border-border"}`}
          >
            <PlanBadge popular={plan.popular} />

            <div className="mb-4">
              <h3 className="font-serif text-lg font-semibold text-text">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-serif text-3xl font-bold text-text">
                  ${annual ? Math.round(plan.price * 0.8) : plan.price}
                </span>
                <span className="text-secondary text-sm">
                  /mo{annual ? ", billed annually" : ""}
                </span>
              </div>
              <p className="text-xs text-secondary mt-1">{plan.description}</p>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-secondary">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.id)}
              disabled={upgrading === plan.id}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                plan.popular
                  ? "bg-accent text-white hover:opacity-90"
                  : "bg-background border border-border text-text hover:border-accent/50"
              } disabled:opacity-50`}
            >
              {upgrading === plan.id ? "Redirecting..." : plan.id === "saas-starter" ? "Current plan" : "Switch to " + plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Invoices */}
      <div>
        <h2 className="font-serif text-xl font-semibold text-text mb-4">
          Invoices
        </h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-6 py-3">
                  Invoice
                </th>
                <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-6 py-3">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-secondary uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-text">
                    {inv.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{inv.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text">
                    ${inv.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-accent hover:underline">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
