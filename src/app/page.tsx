"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ─── Nav ─────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? "bg-[var(--color-bg)]/95 backdrop-blur border-[var(--color-border)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>K</span>
          </div>
          <span className="font-bold text-lg text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>KILN</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            How it works
          </Link>
          <Link href="/pricing" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            Docs
          </Link>
          <Link href="/auth/signin" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-semibold px-5 py-2 bg-[var(--color-accent)] text-white rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Deploy an agent
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Kiln Fire Hero ──────────────────────────────────── */
const CHANNELS = [
  { name: "Discord", color: "#5865F2", desc: "Server + channels" },
  { name: "Telegram", color: "#26A5E4", desc: "Bot + DMs" },
  { name: "Slack", color: "#4A154B", desc: "Workspace app" },
  { name: "Web", color: "#E85D26", desc: "Browser + API" },
];

function KilnFireHero() {
  const [phase, setPhase] = useState(0);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [fireLevel, setFireLevel] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1600),
      setTimeout(() => setPhase(2), 3200),
      setTimeout(() => setPhase(3), 4600),
      setTimeout(() => setFireLevel(1), 6000),
      setTimeout(() => setFireLevel(2), 6600),
      setTimeout(() => setPhase(4), 7200),
      setTimeout(() => setPhase(0), 11000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6">
      <div className="w-full max-w-4xl">
        {/* Terminal */}
        <div className="rounded-t-2xl bg-[var(--color-code-bg)] border border-[#333] border-b-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333]">
            <div className="w-3 h-3 rounded-full bg-[#C43D26]" />
            <div className="w-3 h-3 rounded-full bg-[#C47F17]" />
            <div className="w-3 h-3 rounded-full bg-[#3D8B6E]" />
            <span className="ml-3 text-xs text-[#6B6560]" style={{ fontFamily: "var(--font-mono)" }}>
              kiln — deploy openclaw
            </span>
          </div>
          <div className="p-6 min-h-[420px]">

            {/* Phase 0-1: typing prompt */}
            {phase < 2 && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px" }}>
                <p className="text-[#3D8B6E]">$ kiln deploy openclaw</p>
                <p className="text-[#a0a0a0] mt-2">
                  &gt; selecting channel
                  <span className="inline-block w-2 h-4 bg-[#E85D26] ml-1 animate-pulse" />
                </p>
              </div>
            )}

            {/* Phase 1: channel grid */}
            {phase >= 1 && (
              <div>
                <p className="text-[#3D8B6E] mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "14px" }}>
                  &gt; select channel
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {CHANNELS.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedChannel(i); setPhase(2); }}
                      className={`kiln-card p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedChannel === i
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5 kiln-glow"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:-translate-y-1"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                        <span className="text-xs font-semibold text-[var(--color-text)]">{ch.name}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)]">{ch.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 2: configuring */}
            {phase >= 2 && (
              <div className="mt-4">
                <p className="text-[#3D8B6E] mb-3" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                  &gt; configuring your agent
                </p>
                <div className="space-y-2 max-w-sm">
                  {["OPENAI_API_KEY", "DISCORD_BOT_TOKEN", "FLY_API_TOKEN"].map((key) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-[#6B6560]" style={{ fontFamily: "var(--font-mono)" }}>{key}=</span>
                      <div className="flex-1 h-6 bg-[#2a2a2a] rounded border border-[#444] px-2 flex items-center">
                        <span className="text-xs text-[#4a4a4a]" style={{ fontFamily: "var(--font-mono)" }}>••••••••••••</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setPhase(3); }}
                  className="mt-4 px-5 py-2 bg-[var(--color-accent)] text-white text-sm font-semibold rounded-full hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
                >
                  ⟐ Fire
                </button>
              </div>
            )}

            {/* Phase 3: firing */}
            {phase >= 3 && (
              <div className="mt-6">
                <p className="text-[#3D8B6E] mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                  &gt; deploying to Fly.io...
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {fireLevel === 0 && <span className="kiln-fire-ember">🪵</span>}
                    {fireLevel === 1 && <span className="kiln-fire-flame">🔥</span>}
                    {fireLevel === 2 && <span className="kiln-fire-flame text-5xl">🔥</span>}
                  </div>
                  <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-warning)] transition-all duration-1000"
                      style={{ width: phase === 4 ? "100%" : fireLevel === 2 ? "85%" : fireLevel === 1 ? "50%" : "20%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Phase 4: done */}
            {phase === 4 && (
              <div className="mt-4 kiln-slide-up">
                <p className="text-[#3D8B6E] mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                  &gt; agent deployed
                </p>
                <div className="p-4 bg-[#1a3a2a] border border-[#3D8B6E]/30 rounded-xl">
                  <p className="text-sm text-[#3D8B6E]">✓ OpenClaw agent live on Fly.io</p>
                  <p className="text-xs text-[#6B6560] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                    https://tyler-ai.fly.dev
                  </p>
                  <p className="text-xs text-[#6B6560] mt-1">Connected to Discord · Always-on</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hero text */}
        <div className="mt-10 text-center">
          <h1
            className="text-5xl md:text-6xl font-black text-[var(--color-text)] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Deploy your OpenClaw agent.<br />
            <span className="text-[var(--color-accent)]">Ship it in 30 minutes.</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto mb-8">
            Pick your channel. Add your API keys. KILN deploys your OpenClaw agent to Fly.io — always-on, connected to Discord, Telegram, or Slack.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="px-8 py-3 bg-[var(--color-accent)] text-white font-semibold rounded-full hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Deploy an agent →
            </Link>
            <Link
              href="/how-it-works"
              className="px-8 py-3 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-full hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ──────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pick your channel",
      body: "Choose Discord, Telegram, Slack, or web. Your agent connects to your existing accounts — no new apps to manage.",
    },
    {
      n: "02",
      title: "Add your API keys",
      body: "OpenAI, Anthropic, Google Gemini, or MiniMax. Plus your Discord/Telegram bot tokens. We verify everything before deployment.",
    },
    {
      n: "03",
      title: "Fire the kiln",
      body: "We spin up your OpenClaw agent on Fly.io, wire all your keys, and send you a live URL — typically under 3 minutes.",
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Three steps. Agent live.
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-16 max-w-xl mx-auto">
          No server configs. No Docker. No reading docs for three hours.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="reveal">
              <div className="text-6xl font-black text-[var(--color-border)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                {s.n}
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {s.title}
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ────────────────────────────────────────── */
const FEATURES = [
  { label: "Always-on", desc: "Your agent runs on Fly.io — not your laptop" },
  { label: "Discord", desc: "Full server access, thread-aware, slash commands" },
  { label: "Telegram", desc: "Bot token, DM support, group access" },
  { label: "Slack", desc: "Workspace app with full event API" },
  { label: "Web UI", desc: "Browser-based chat + gateway dashboard" },
  { label: "OpenAI", desc: "GPT-4o, o1, o3 with streaming" },
  { label: "Anthropic", desc: "Claude 3.5, 3 Opus with tool use" },
  { label: "Your keys", desc: "Bring your own API keys — you control costs" },
];

function Features() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Everything included.
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-16">
          One agent. All your channels. Your choice of model.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="p-5 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] hover:-translate-y-1 hover:shadow-md transition-all duration-200"
            >
              <p className="font-semibold text-[var(--color-text)] mb-1">{f.label}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ──────────────────────────────────────────── */
const PLANS = [
  {
    name: "Starter",
    price: "Free",
    desc: "For trying it out.",
    features: ["1 agent", "Discord channel", "GPT-3.5 only", "100 messages/day", "Community support"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/mo",
    desc: "For daily use.",
    features: ["1 agent", "All channels", "GPT-4o, Claude, Gemini", "Unlimited messages", "Priority support", "Always-on"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    desc: "For teams.",
    features: ["5 agents", "All channels", "All models", "Unlimited messages", "Slack workspace", "Dedicated support"],
    cta: "Contact sales",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Simple pricing.
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-16">
          Plus your API key costs. No surprise bills.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`p-8 rounded-2xl border-2 transition-all ${
                p.highlight
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/3 scale-[1.02]"
                  : "border-[var(--color-border)] bg-[var(--color-bg)]"
              }`}
            >
              {p.highlight && (
                <span className="inline-block text-xs font-semibold text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-1 rounded-full mb-4">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-black text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>
                  {p.price}
                </span>
                {p.period && <span className="text-[var(--color-text-secondary)]">{p.period}</span>}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">{p.desc}</p>
              <ul className="space-y-2 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                    <span className="text-[var(--color-success)]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-3 rounded-full font-semibold transition-colors ${
                  p.highlight
                    ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                    : "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-border)]"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────── */
const FAQS = [
  {
    q: "What is OpenClaw?",
    a: "OpenClaw is an open-source AI agent gateway that runs a persistent AI assistant connected to Discord, Telegram, Slack, or web. Think of it as your personal AI that lives in your chat channels.",
  },
  {
    q: "How is this different from just running OpenClaw myself?",
    a: "KILN handles the Fly.io deployment, persistent volumes, SSL certs, and the setup wizard. You just pick your channel, add your keys, and click Fire. No terminal, no server configs.",
  },
  {
    q: "What API keys do I need?",
    a: "A Fly.io account (free), an LLM API key (OpenAI, Anthropic, Google Gemini, or MiniMax), and your channel tokens (Discord bot token, Telegram bot token, or Slack app tokens).",
  },
  {
    q: "Can I use my own model?",
    a: "Yes. Bring your own OpenAI, Anthropic, Google Gemini, OpenRouter, or MiniMax API key. You pay your provider directly.",
  },
  {
    q: "What happens to my agent if I cancel?",
    a: "Your Fly.io app keeps running until you destroy it. Cancel anytime — your agent does not disappear.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-[var(--color-text)] mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          FAQ
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-[var(--color-text)] font-medium"
              >
                {faq.q}
                <span className="text-[var(--color-accent)] text-lg">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-24 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-[var(--color-text)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Ready to fire?
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-10 text-lg">
          Your OpenClaw agent is 30 minutes away.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block px-10 py-4 bg-[var(--color-accent)] text-white font-bold text-lg rounded-full hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Deploy an agent →
        </Link>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--color-accent)] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>K</span>
          </div>
          <span className="text-sm text-[var(--color-text-secondary)]" style={{ fontFamily: "var(--font-display)" }}>KILN</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="text-xs text-[var(--color-text-secondary)]">Docs</Link>
          <Link href="/pricing" className="text-xs text-[var(--color-text-secondary)]">Pricing</Link>
          <Link href="/legal/privacy" className="text-xs text-[var(--color-text-secondary)]">Privacy</Link>
          <Link href="/legal/terms" className="text-xs text-[var(--color-text-secondary)]">Terms</Link>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Built by Flume SaaS Factory
        </p>
      </div>
    </footer>
  );
}

/* ─── Scroll Reveal ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── Page ─────────────────────────────────────────────── */
export default function HomePage() {
  useScrollReveal();
  return (
    <main className="min-h-screen">
      <Nav />
      <KilnFireHero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
