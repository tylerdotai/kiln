"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    priceLabel: "Free",
    desc: "For trying it out.",
    features: ["1 agent", "Discord", "GPT-3.5", "100 messages/day"],
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    price: 15,
    priceLabel: "$15/mo",
    desc: "For daily use.",
    features: ["1 agent", "All channels", "All models", "Unlimited messages"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: 49,
    priceLabel: "$49/mo",
    desc: "For teams.",
    features: ["5 agents", "All channels", "All models", "Priority support"],
    cta: "Contact sales",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"plan" | "configure" | "done">("plan");
  const [plan, setPlan] = useState<string>("pro");
  const [loading, setLoading] = useState(false);

  async function handleStartFree() {
    setLoading(true);
    // Free plan — skip payment, go straight to onboarding
    router.push("/onboarding");
  }

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        // Redirect to Polar checkout
        window.location.href = data.url;
      } else {
        // Fallback: go to onboarding (dev mode)
        router.push("/onboarding");
      }
    } catch {
      router.push("/onboarding");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Minimal nav */}
      <nav className="border-b border-[var(--color-border)] px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>K</span>
          </div>
          <span className="font-bold text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>KILN</span>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {["Plan", "Configure", "Done"].map((label, i) => {
            const stages = ["plan", "configure", "done"];
            const current = stages.indexOf(step);
            return (
              <div key={label} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < current
                      ? "bg-[var(--color-success)] text-white"
                      : i === current
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                  }`}
                >
                  {i < current ? "✓" : i + 1}
                </div>
                <span className={`ml-2 text-sm ${i <= current ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`}>
                  {label}
                </span>
                {i < 2 && (
                  <div className={`w-12 h-px mx-4 ${i < current ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`} />
                )}
              </div>
            );
          })}
        </div>

        {step === "plan" && (
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
              Deploy your OpenClaw agent
            </h1>
            <p className="text-[var(--color-text-secondary)] text-center mb-10">
              Choose a plan. Upgrade later — no lock-in.
            </p>

            <div className="grid gap-4 mb-8">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    plan === p.id
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                      : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-[var(--color-text)]">{p.name}</span>
                      {p.highlight && (
                        <span className="ml-2 text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-0.5 rounded-full font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-black text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
                      {p.priceLabel}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">{p.desc}</p>
                  <ul className="space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                        <span className="text-[var(--color-success)]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {plan === "starter" ? (
              <button
                onClick={handleStartFree}
                disabled={loading}
                className="w-full py-4 rounded-full font-bold text-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
              >
                {loading ? "Setting up..." : "Start free →"}
              </button>
            ) : (
              <button
                onClick={() => { setStep("configure"); }}
                className="w-full py-4 rounded-full font-bold text-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                Continue with {PLANS.find((p) => p.id === plan)?.priceLabel} →
              </button>
            )}
          </div>
        )}

        {step === "configure" && (
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)] mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
              Almost ready
            </h1>
            <p className="text-[var(--color-text-secondary)] text-center mb-10">
              After payment, you'll configure your agent and deploy it.
            </p>

            <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)] mb-8">
              <h3 className="font-bold text-[var(--color-text)] mb-4">What happens next:</h3>
              <ol className="space-y-3">
                {[
                  "You'll be redirected to Polar.sh to complete payment",
                  "After payment, you'll set up your channel (Discord/Telegram/Slack)",
                  "Add your API keys (we verify them before deploying)",
                  "KILN fires the kiln — your agent goes live on Fly.io",
                  "You'll get an email with your agent URL and setup wizard link",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
                    <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-4 rounded-full font-bold text-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors mb-4"
            >
              {loading ? "Redirecting..." : `Pay ${PLANS.find((p) => p.id === plan)?.priceLabel} →`}
            </button>
            <button
              onClick={() => setStep("plan")}
              className="w-full py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              ← Back to plan selection
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
