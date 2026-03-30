"use client";

/**
 * Pricing Page — /pricing
 * 3-column pricing, feature comparison, annual toggle, FAQ, CTAs.
 */

import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    id: "starter",
    name: "KILN Starter",
    price: 0,
    priceLabel: "Free",
    description: "Perfect for trying out KILN and deploying your first integration.",
    cta: "Start Free",
    ctaHref: "/signup",
    featured: false,
    limits: {
      deployments: 1,
      emails: "100/mo",
      webhooks: 1,
      customDomain: false,
      teamMembers: false,
      prioritySupport: false,
    },
    features: [
      "1 deployment",
      "100 emails per month",
      "1 webhook",
      "Basic templates",
      "Community support",
      "7-day deploy history",
    ],
  },
  {
    id: "pro",
    name: "KILN Pro",
    price: 29,
    priceLabel: "$29/mo",
    annualPrice: 24,
    annualLabel: "$24/mo",
    description: "For growing teams building serious integrations with KILN.",
    cta: "Go Pro",
    ctaHref: "/signup?plan=pro",
    featured: true,
    badge: "Most Popular",
    limits: {
      deployments: 5,
      emails: "Unlimited",
      webhooks: 5,
      customDomain: true,
      teamMembers: false,
      prioritySupport: false,
    },
    features: [
      "5 deployments",
      "Unlimited emails",
      "5 webhooks",
      "Custom domain",
      "Priority queue",
      "30-day deploy history",
      "Email support",
    ],
  },
  {
    id: "team",
    name: "KILN Team",
    price: 99,
    priceLabel: "$99/mo",
    annualPrice: 82,
    annualLabel: "$82/mo",
    description: "For teams that need unlimited scale and dedicated support.",
    cta: "Contact Sales",
    ctaHref: "/contact",
    featured: false,
    limits: {
      deployments: "Unlimited",
      emails: "Unlimited",
      webhooks: "Unlimited",
      customDomain: true,
      teamMembers: true,
      prioritySupport: true,
    },
    features: [
      "Unlimited deployments",
      "Unlimited emails",
      "Unlimited webhooks",
      "Custom domain",
      "Team members (unlimited)",
      "Priority support",
      "90-day deploy history",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

const COMPARISON_FEATURES = [
  { label: "Deployments", starter: "1", pro: "5", team: "Unlimited" },
  { label: "Emails per month", starter: "100", pro: "Unlimited", team: "Unlimited" },
  { label: "Webhooks", starter: "1", pro: "5", team: "Unlimited" },
  { label: "Custom domain", starter: false, pro: true, team: true },
  { label: "Team members", starter: false, pro: false, team: true },
  { label: "Priority support", starter: false, pro: false, team: true },
  { label: "Deploy history", starter: "7 days", pro: "30 days", team: "90 days" },
  { label: "Priority queue", starter: false, pro: true, team: true },
  { label: "Custom integrations", starter: false, pro: false, team: true },
  { label: "SLA guarantee", starter: false, pro: false, team: true },
];

const FAQS = [
  {
    q: "What counts as a deployment?",
    a: "Each time you deploy a new integration to production, it counts as one deployment. Re-deploying the same integration (updating it) does not count as an additional deployment.",
  },
  {
    q: "What happens when I hit my email limit?",
    a: "On the Starter plan, you'll receive an email notification at 80% usage. Once you hit 100, additional emails will be queued until your next billing period resets. Upgrade to Pro or Team for unlimited emails.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Yes. You can upgrade or downgrade at any time. When upgrading, you'll be charged a prorated amount. When downgrading, the change takes effect at the end of your current billing period.",
  },
  {
    q: "What is a webhook invocation?",
    a: "Each time KILN triggers an outbound webhook event (e.g., a form submission, a deployment event, a custom trigger), that's one invocation. Webhook failures due to bad URLs don't count against you.",
  },
  {
    q: "Does the annual discount apply automatically?",
    a: "Yes. Toggle the 'Annual' switch above any plan to see the discounted price. Annual plans are billed upfront for 12 months and save you 2 months compared to monthly billing.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) and debit cards via Polar.sh. For Team plans, we can also arrange invoice billing.",
  },
  {
    q: "Is there a free trial for Pro or Team?",
    a: "KILN Starter is free forever. For Pro, we don't currently offer a trial, but you can upgrade and cancel within your first billing period — you'll only be charged if you don't cancel before the period ends.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "You can export all your data at any time. After cancellation, your account and data are retained for 30 days before being permanently deleted.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Simple, honest pricing.
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            No hidden fees. No per-seat nonsense. Just straightforward plans
            that scale with what you actually build.
          </p>

          {/* Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2">
            <span className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isAnnual ? "bg-orange-500" : "bg-gray-300"}`}
              aria-label="Toggle annual pricing"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAnnual ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-400"}`}>
              Annual
            </span>
            <span className="text-xs text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
              2 months free
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.featured
                  ? "border-orange-500 bg-white shadow-xl shadow-orange-100/50 ring-2 ring-orange-500"
                  : "border-gray-200 bg-white shadow-sm"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {isAnnual && plan.annualPrice !== undefined
                      ? `$${plan.annualPrice}`
                      : plan.price === 0
                      ? "Free"
                      : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 text-sm mb-1">
                      {isAnnual && plan.annualPrice !== undefined ? plan.annualLabel : plan.priceLabel}
                    </span>
                  )}
                </div>
                {isAnnual && plan.annualPrice !== undefined && (
                  <p className="text-xs text-orange-600 font-medium mt-1">
                    Billed annually — save ${(plan.price - plan.annualPrice) * 12}/yr
                  </p>
                )}
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`w-full py-2.5 px-4 rounded-lg text-center text-sm font-semibold transition-colors mb-6 ${
                  plan.featured
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : plan.id === "team"
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 border-t border-gray-200 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Compare plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 font-semibold text-gray-900 w-1/2">Feature</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-3 px-4 font-semibold text-orange-600">Pro</th>
                  <th className="text-center py-3 pl-4 font-semibold text-gray-900">Team</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON_FEATURES.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4 text-gray-700">{row.label}</td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {typeof row.starter === "boolean" ? (
                        row.starter ? (
                          <svg className="w-4 h-4 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        row.starter
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <svg className="w-4 h-4 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="py-3 pl-4 text-center text-gray-600">
                      {typeof row.team === "boolean" ? (
                        row.team ? (
                          <svg className="w-4 h-4 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )
                      ) : (
                        row.team
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full py-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-medium text-gray-900">{faq.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to ship?</h2>
          <p className="mt-3 text-gray-400">
            Start for free. Upgrade when you're ready.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
            >
              Start Free
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-gray-600 text-white font-semibold hover:border-gray-400 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
