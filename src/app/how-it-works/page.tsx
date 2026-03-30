import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Pick your template",
    description:
      "Choose from battle-tested SaaS starters — fully wired with auth, billing, emails, and a database. Each template is production-ready from day one.",
    detail: "Starter · Pro · API-only ·更多 coming soon",
  },
  {
    number: "02",
    title: "Configure your keys",
    description:
      "Connect your own API keys and credentials. Add your OpenAI key, database connection, Resend for email, and your Fly.io token so KILN can deploy on your behalf.",
    detail: "OpenAI · Database · Fly.io · Resend",
  },
  {
    number: "03",
    title: "Fire",
    description:
      "Hit the button. KILN orchestrates the deployment — spinning up a dedicated Fly.io app, injecting your secrets, and launching your SaaS in minutes.",
    detail: "~3–5 minute average deploy time",
  },
  {
    number: "04",
    title: "Your SaaS, live",
    description:
      "Your app goes live at yourname.fly.dev. You get the URL, credentials, and a dashboard to manage it. No infrastructure to maintain. No servers to babysit.",
    detail: "https://your-app.fly.dev",
  },
];

const faqs = [
  {
    q: "Who owns the deployed app?",
    a: "You do. KILN orchestrates the deployment to Fly.io under your configured token. Your app, your Fly.io org, your infrastructure.",
  },
  {
    q: "What does it cost?",
    a: "KILN's subscription covers the orchestration. Your Fly.io usage is billed directly by Fly.io — shared-cpu VMs start at ~$1.86/mo. You only pay for what you use.",
  },
  {
    q: "Can I use my own Fly.io account?",
    a: "Yes. During configuration, you provide your own Fly.io API token. KILN creates the app under your org — we never store your token after the deploy.",
  },
  {
    q: "What templates are available?",
    a: "Currently: SaaS Starter (Next.js + Better Auth + Polar billing + Resend emails). API-only and more templates are in the works.",
  },
  {
    q: "How does billing work?",
    a: "You subscribe to KILN via Polar.sh. Your subscription unlocks deployment credits. Each fire consumes credits based on the template.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-32 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-orange-500/10 px-3 py-1 text-sm text-orange-500">
            How KILN works
          </span>
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            From template to deployed SaaS in minutes
          </h1>
          <p className="text-xl text-muted-foreground">
            KILN handles the infrastructure. You handle the product.
            Pick a template, inject your keys, fire — and your SaaS is live on Fly.io.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Start building
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Steps ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-16 text-center text-3xl font-bold">
            Four steps to production
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-border bg-card p-8"
              >
                <span className="mb-4 block text-6xl font-bold text-orange-500/20">
                  {step.number}
                </span>
                <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
                <p className="mb-4 text-muted-foreground">{step.description}</p>
                <span className="inline-block rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flow Diagram ─────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            The full flow
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            {[
              "Pick Template",
              "Configure Keys",
              "KILN → Fly.io API",
              "App Created",
              "Secrets Injected",
              "Docker Build",
              "Deployed",
            ].map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <div className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white">
                  {label}
                </div>
                {i < 6 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Everything after "Configure Keys" happens automatically.
            KILN talks to Fly.io's API, provisions your VM, builds your Docker image,
            and deploys — no human in the loop.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold">FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border p-6"
              >
                <h3 className="mb-2 font-semibold">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-3xl font-bold">Ready to fire?</h2>
          <p className="mb-8 text-muted-foreground">
            Deploy your first SaaS in minutes. No credit card required to start.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Start for free →
          </Link>
        </div>
      </section>
    </main>
  );
}
