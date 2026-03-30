"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TEMPLATES = [
  {
    id: "saas-starter",
    name: "SaaS Starter",
    description: "Full-stack SaaS with auth, dashboard, billing, and API. Perfect for B2B tools.",
    badge: "Most popular",
    price: "$29/mo",
    features: ["Multi-tenant architecture", "Stripe billing", "User auth", "Admin panel", "Email via Resend"],
    gradient: "from-orange-400 to-rose-500",
    preview: "bg-gradient-to-br from-orange-100 to-rose-100",
  },
  {
    id: "saas-pro",
    name: "SaaS Pro",
    description: "Everything in Starter plus AI integrations, analytics, and priority support.",
    badge: "Best value",
    price: "$79/mo",
    features: ["Everything in SaaS Starter", "OpenAI / Claude integration", "PostHog analytics", "Priority support", "Custom domain"],
    gradient: "from-violet-500 to-purple-600",
    preview: "bg-gradient-to-br from-violet-100 to-purple-100",
  },
  {
    id: "api-only",
    name: "API Only",
    description: "Headless API with auth, rate limiting, and webhook support. Ship your own frontend.",
    badge: undefined,
    price: "$19/mo",
    features: ["REST + GraphQL API", "Auth middleware", "Rate limiting", "Webhook engine", "API key management"],
    gradient: "from-cyan-500 to-blue-600",
    preview: "bg-gradient-to-br from-cyan-100 to-blue-100",
  },
  {
    id: "single-tenant",
    name: "Single Tenant",
    description: "Isolated instance per customer. Best for enterprise compliance and data isolation.",
    badge: undefined,
    price: "$149/mo",
    features: ["Isolated per customer", "Dedicated database", "SOC 2 ready", "Audit logs", "Custom SLA"],
    gradient: "from-emerald-500 to-teal-600",
    preview: "bg-gradient-to-br from-emerald-100 to-teal-100",
  },
  {
    id: "agency",
    name: "Agency",
    description: "White-label solution for agencies building multiple client SaaS products.",
    badge: undefined,
    price: "$299/mo",
    features: ["Multi-project management", "White-label ready", "Client billing separation", "5 sub-accounts", "Priority everything"],
    gradient: "from-amber-500 to-orange-600",
    preview: "bg-gradient-to-br from-amber-100 to-orange-100",
  },
  {
    id: "microsaas",
    name: "Micro SaaS",
    description: "Simple single-tenant SaaS for solo founders. Auth, payments, and a landing page.",
    badge: "For solo founders",
    price: "$9/mo",
    features: ["Landing page included", "Gumroad or Lemonsqueezy", "Simple auth", "Basic analytics", "1 deployment"],
    gradient: "from-pink-400 to-rose-500",
    preview: "bg-gradient-to-br from-pink-100 to-rose-100",
  },
];

type Step = "template" | "configure" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [subdomain, setSubdomain] = useState("");
  const [email, setEmail] = useState("");
  const [resendApiKey, setResendApiKey] = useState("");
  const [polarAccessToken, setPolarAccessToken] = useState("");
  const [triggerApiKey, setTriggerApiKey] = useState("");
  const [posthogApiKey, setPosthogApiKey] = useState("");
  const [githubToken, setGithubToken] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const template = TEMPLATES.find((t) => t.id === selectedTemplate);

  function validateStep2() {
    const errors: Record<string, string> = {};

    if (!subdomain || subdomain.length < 2) {
      errors.subdomain = "Subdomain must be at least 2 characters";
    } else if (!/^[a-z0-9-]+$/.test(subdomain)) {
      errors.subdomain = "Only lowercase letters, numbers, and hyphens";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Valid email is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleFire(e: FormEvent) {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate,
          subdomain,
          email,
          resendApiKey: resendApiKey || undefined,
          polarAccessToken: polarAccessToken || undefined,
          triggerApiKey: triggerApiKey || undefined,
          posthogApiKey: posthogApiKey || undefined,
          githubToken: githubToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create checkout");
        return;
      }

      // Redirect to Polar checkout
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="font-serif text-xl font-semibold text-text">KILN</span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-secondary">
          {step !== "template" && (
            <button
              onClick={() => setStep(step === "payment" ? "configure" : "template")}
              className="hover:text-text transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
          <span>Step {step === "template" ? 1 : step === "configure" ? 2 : 3} of 3</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Step 1: Template Selection */}
        {step === "template" && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold text-text mb-2">
              Choose your fuel.
            </h1>
            <p className="text-secondary mb-10">
              Pick a template to start. You can configure your API keys on the next step.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEMPLATES.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setStep("configure");
                  }}
                  className="group text-left bg-surface border border-border rounded-2xl p-5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {t.badge && (
                    <span className="inline-block bg-accent text-white text-xs font-semibold px-2 py-0.5 rounded-full mb-3">
                      {t.badge}
                    </span>
                  )}
                  <div className={`w-full h-28 rounded-xl ${t.preview} mb-4 flex items-center justify-center`}>
                    <span className="text-4xl opacity-60">
                      {t.id === "saas-starter" && "🧱"}
                      {t.id === "saas-pro" && "🚀"}
                      {t.id === "api-only" && "⚡"}
                      {t.id === "single-tenant" && "🏛️"}
                      {t.id === "agency" && "🏗️"}
                      {t.id === "microsaas" && "🌱"}
                    </span>
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg font-semibold text-text">
                      {t.name}
                    </h3>
                    <span className="text-sm font-mono font-semibold text-accent">
                      {t.price}
                    </span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed mb-3">
                    {t.description}
                  </p>
                  <ul className="space-y-1">
                    {t.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                        <span className="w-1 h-1 rounded-full bg-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Configuration */}
        {step === "configure" && template && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-4xl font-bold text-text mb-2">
              Configure your build.
            </h1>
            <p className="text-secondary mb-10">
              Set up your subdomain and connect your API keys. All keys are encrypted at rest.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleFire} id="configure-form">
                  {/* Subdomain */}
                  <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
                    <h3 className="font-semibold text-text mb-1">Deployment</h3>
                    <p className="text-sm text-secondary mb-4">
                      Your SaaS will be live at{" "}
                      <span className="font-mono text-accent">{subdomain || "your-name"}.kiln.build</span>
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Subdomain
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={subdomain}
                          onChange={(e) => {
                            setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                            setFieldErrors((prev) => ({ ...prev, subdomain: "" }));
                          }}
                          placeholder="tyler-kiln"
                          className={`flex-1 bg-background border rounded-l-xl px-4 py-3 font-mono text-text placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors ${
                            fieldErrors.subdomain ? "border-red-400" : "border-border"
                          }`}
                        />
                        <span className="inline-flex items-center rounded-r-xl border border-l-0 border-border bg-background px-4 text-sm text-secondary">
                          .kiln.build
                        </span>
                      </div>
                      {fieldErrors.subdomain && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.subdomain}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
                    <h3 className="font-semibold text-text mb-1">Account</h3>
                    <p className="text-sm text-secondary mb-4">
                      We'll send your deployment credentials here.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFieldErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="tyler@flumeusa.com"
                        className={`w-full bg-background border rounded-xl px-4 py-3 text-text placeholder:text-secondary/50 focus:outline-none focus:border-accent transition-colors ${
                          fieldErrors.email ? "border-red-400" : "border-border"
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* API Keys */}
                  <div className="bg-surface border border-border rounded-2xl p-6 mb-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-text">API Keys</h3>
                      <span className="text-xs text-secondary bg-background border border-border px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-4">
                      Connect your services. All values are AES-256-GCM encrypted before storage.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
                          Resend API Key
                        </label>
                        <input
                          type="password"
                          value={resendApiKey}
                          onChange={(e) => setResendApiKey(e.target.value)}
                          placeholder="re_xxxxxxxxxxxx"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm text-text placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
                          Polar Access Token
                        </label>
                        <input
                          type="password"
                          value={polarAccessToken}
                          onChange={(e) => setPolarAccessToken(e.target.value)}
                          placeholder="pol_xxxxxxxxxxxx"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm text-text placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
                          Trigger API Key
                        </label>
                        <input
                          type="password"
                          value={triggerApiKey}
                          onChange={(e) => setTriggerApiKey(e.target.value)}
                          placeholder="trig_xxxxxxxxxxxx"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm text-text placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
                          PostHog API Key
                        </label>
                        <input
                          type="password"
                          value={posthogApiKey}
                          onChange={(e) => setPosthogApiKey(e.target.value)}
                          placeholder="phc_xxxxxxxxxxxx"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm text-text placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
                          GitHub Personal Access Token
                        </label>
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxx"
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 font-mono text-sm text-text placeholder:text-secondary/40 focus:outline-none focus:border-accent transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-5">
                      {error}
                    </div>
                  )}
                </form>
              </div>

              {/* Summary sidebar */}
              <div className="space-y-5">
                <div className="bg-surface border border-border rounded-2xl p-6 sticky top-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🔥</span>
                    <span className="font-serif font-semibold text-text">
                      {template.name}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Plan</span>
                      <span className="font-mono text-text">{template.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Subdomain</span>
                      <span className="font-mono text-text text-accent">
                        {subdomain || "—"}.kiln.build
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {template.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-secondary">
                        <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="submit"
                    form="configure-form"
                    disabled={loading}
                    className="w-full bg-accent text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 animate-pulse-glow"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Firing up...
                      </>
                    ) : (
                      <>
                        🔥 Fire
                      </>
                    )}
                  </button>

                  <p className="text-xs text-secondary text-center mt-3">
                    Powered by Polar. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
