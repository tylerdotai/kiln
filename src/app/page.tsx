"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { prepare, layout } from "@chenglou/pretext";

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
            Help
          </Link>
          <Link href="/auth/signin" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-semibold px-5 py-2 bg-[var(--color-accent)] text-white rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Get your agent
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Pretext hook ─────────────────────────────────── */
function usePretext(text: string, font: string, maxWidth: number, lineHeight: number) {
  const [result, setResult] = useState<{ height: number; lineCount: number } | null>(null);
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    const prepared = prepare(text, font);
    const measured = layout(prepared, maxWidth, lineHeight);
    setResult(measured);
  }, [text, font, maxWidth, lineHeight]);
  return result;
}

/* ─── Terminal line ────────────────────────────────── */
const FONT = "13px JetBrains Mono, Fira Code, Consolas, monospace";
const LINE_HEIGHT = 20;

interface TerminalLineProps {
  text: string;
  color?: string;
  prefix?: string;
  delay?: number;
}

function TerminalLine({ text, color = "#a0a0a0", prefix, delay = 0 }: TerminalLineProps) {
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const measured = usePretext(text, FONT, 480, LINE_HEIGHT);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(showTimer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        setTyped(text.slice(0, i));
        i++;
        setTimeout(type, 22);
      }
    };
    type();
  }, [visible, text]);

  const height = measured?.height ?? LINE_HEIGHT;

  return (
    <div
      style={{
        height: visible ? height : 0,
        opacity: visible ? 1 : 0,
        overflow: "hidden",
        transition: "height 0.3s ease, opacity 0.3s ease",
        fontFamily: FONT,
        fontSize: 13,
        lineHeight: `${LINE_HEIGHT}px`,
      }}
    >
      <span style={{ color: "#3D8B6E" }}>{prefix}</span>
      <span style={{ color }}>{typed}</span>
      {visible && typed.length < text.length && (
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: LINE_HEIGHT - 4,
            background: "#E85D26",
            marginLeft: 1,
            verticalAlign: "middle",
            animation: "blink 0.8s step-end infinite",
          }}
        />
      )}
    </div>
  );
}

/* ─── Hero ─────────────────────────────────────────── */
function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 3500);
    const t3 = setTimeout(() => setPhase(3), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6">
      <div className="w-full max-w-3xl text-center">

        {/* Terminal demo */}
        <div
          className="rounded-2xl bg-[#0d0d0d] border border-[#2a2a2a] overflow-hidden mb-10 text-left"
          style={{ maxWidth: 560, margin: "0 auto 40px" }}
        >
          {/* Titlebar */}
          <div
            style={{
              background: "#1a1a1a",
              borderBottom: "1px solid #2a2a2a",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C43D26" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C47F17" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3D8B6E" }} />
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "#6B6560",
                fontFamily: FONT,
              }}
            >
              kiln — your-agent
            </span>
          </div>

          {/* Terminal body */}
          <div style={{ padding: "20px 20px 24px" }}>
            <TerminalLine text="$ connect discord --token ****" color="#E85D26" delay={200} />
            <TerminalLine text="Connected to Discord server." color="#3D8B6E" delay={1400} />
            <TerminalLine text="$ ask --model gpt-4o" color="#E85D26" prefix="" delay={2200} />
            <TerminalLine
              text="Your AI agent is live. Ask it anything."
              color="#a0a0a0"
              delay={3200}
            />
            {phase >= 1 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #2a2a2a" }}>
                <TerminalLine
                  text="Ready in Discord and Telegram."
                  color="#3D8B6E"
                  delay={4400}
                />
              </div>
            )}
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-6xl font-black text-[var(--color-text)] mb-6 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your AI agent,<br />
          <span className="text-[var(--color-accent)]">in your chat.</span>
        </h1>

        <p className="text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto mb-10 leading-relaxed">
          We build, host, and manage your OpenClaw agent. You just chat with it in Discord or Telegram — like talking to a teammate.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="px-10 py-4 bg-[var(--color-accent)] text-white font-semibold rounded-full hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] text-lg"
          >
            Get your AI agent
          </Link>
          <Link
            href="/how-it-works"
            className="px-8 py-3 border border-[var(--color-border)] text-[var(--color-text)] font-semibold rounded-full hover:border-[var(--color-accent)] transition-colors"
          >
            How it works
          </Link>
        </div>

        <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
          No credit card required to start free
        </p>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

/* ─── How It Works ──────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell us your channel",
      body: "Pick Discord or Telegram. We'll walk you through creating a bot account — it's free and takes 5 minutes.",
    },
    {
      n: "02",
      title: "Connect your API key",
      body: "Point us to your OpenAI, Anthropic, or Google account. You keep control of your data and billing.",
    },
    {
      n: "03",
      title: "We handle the rest",
      body: "We deploy, host, and maintain your agent 24/7. It stays online even when your computer is off.",
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Up in minutes.
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-16 max-w-xl mx-auto">
          No technical knowledge needed. We handle all the infrastructure.
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
  { label: "Always online", desc: "Your agent runs on our servers, 24/7, even when you're asleep" },
  { label: "Discord", desc: "Works in servers and DMs. Understands threads and context" },
  { label: "Telegram", desc: "Chat with it directly or in groups. Stays synced across devices" },
  { label: "Your data, your keys", desc: "Bring your own API keys. You pay your provider directly" },
  { label: "Memory", desc: "Remembers your conversations. Learns from your preferences" },
  { label: "Simple pricing", desc: "Flat monthly plans. No surprise bills or usage spikes" },
];

function Features() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4 text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Built for everyday use.
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-16">
          Your own personal AI, living where you already chat.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    price: "$49",
    period: "/mo",
    desc: "For individuals.",
    features: ["1 AI agent", "Discord or Telegram", "1GB RAM", "All free LLM models", "Community support"],
    cta: "Start Starter",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$149",
    period: "/mo",
    desc: "For power users.",
    features: ["1 AI agent", "Discord and Telegram", "2GB RAM", "GPT-4o, Claude, Gemini", "Priority support"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$299",
    period: "/mo",
    desc: "For teams and businesses.",
    features: ["5 AI agents", "Discord and Telegram", "4GB RAM", "All models included", "Dedicated support"],
    cta: "Contact us",
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
          Plus your API key costs. No surprises.
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
                    <span className="text-[var(--color-success)]">&#x2713;</span> {f}
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
    q: "What is this, exactly?",
    a: "KILN is a hosted AI agent service. You pick Discord or Telegram, we build and run your OpenClaw agent on our servers. You just chat with it like any other contact — no technical setup required.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. If you can set up a Discord bot or Telegram bot (we walk you through it), you can use KILN. Everything else — servers, deployment, maintenance — is handled by us.",
  },
  {
    q: "What API keys do I need?",
    a: "Just an OpenAI, Anthropic, or Google account to pay for the AI model directly. You'll set up your own account at whichever provider you choose, so you own your data and control your spending. KILN doesn't mark up AI costs.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT is a chatbot you visit in a browser. A KILN agent lives where you already chat — Discord or Telegram — and can be configured for specific tasks, remember context, and integrate with your workflows.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your agent stops working and your account is deleted. Your API keys remain yours — you just stop using our hosting. No lock-in.",
  },
  {
    q: "Who builds and manages the agent?",
    a: "We do. Flume SaaS Factory sets up, hosts, and maintains your agent. You just tell us what you want it to do.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-[var(--color-text)] mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Questions?
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-bg)]">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-[var(--color-text)] font-medium"
              >
                {faq.q}
                <span className="text-[var(--color-accent)] text-lg">{open === i ? "-" : "+"}</span>
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
          Ready to meet your agent?
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-10 text-lg">
          Set up takes less than 10 minutes. No credit card needed to start free.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block px-10 py-4 bg-[var(--color-accent)] text-white font-bold text-lg rounded-full hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Get your AI agent
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
          <Link href="/docs" className="text-xs text-[var(--color-text-secondary)]">Help</Link>
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
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
