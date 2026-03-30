import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About KILN",
  description: "We built KILN because we were tired of scaffolding. Flume SaaS Factory — honest tools for builders.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>K</span>
            </div>
            <span className="font-bold text-lg text-[var(--color-text)]" style={{ fontFamily: "var(--font-display)" }}>KILN</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "120px 24px 80px", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            color: "var(--color-text)",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          We were tired<br />of scaffolding.
        </h1>
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--color-text-secondary)",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Every time we wanted to ship a new idea, we spent two weeks wiring up auth,
          database schemas, email templates, payment providers, and analytics.
          Then another week figuring out why the webhooks were failing.
        </p>
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--color-text-secondary)",
            maxWidth: 560,
            margin: "24px auto 0",
            lineHeight: 1.7,
          }}
        >
          That is not building SaaS. That is assembling furniture.
        </p>
      </section>

      {/* What KILN is */}
      <section style={{ padding: "0 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 16,
            padding: "40px 32px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-text)",
              marginBottom: 16,
            }}
          >
            KILN is the opposite of assembling furniture.
          </h2>
          <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
            Pick a template. Add your API keys. We deploy, wire, and fire your monetized SaaS
            — auth, billing, email, jobs, analytics — all working on day one. No YAML.
            No glue code. No two-week setup phase.
          </p>
          <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            We built it for ourselves. Then we realized others needed it too.
          </p>
        </div>
      </section>

      {/* Who we are */}
      <section style={{ padding: "0 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: 32,
          }}
        >
          Who we are
        </h2>
        <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 16 }}>
          KILN is built by{" "}
          <a href="https://flumeusa.com" className="text-[var(--color-accent)]">
            Flume SaaS Factory
          </a>
          . We build internet businesses and the tools we wish existed.
          We are a small team — no Series A, no growth hacking, no 10x engineers.
          Just people who ship.
        </p>
        <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
          We are honest about what works and what does not. When something breaks,
          we tell you. When something is not ready, we say so.
        </p>
      </section>

      {/* What else */}
      <section style={{ padding: "0 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--color-text)",
            marginBottom: 32,
          }}
        >
          What else we ship
        </h2>
        <div style={{ display: "grid", gap: 16 }}>
          {[
            {
              title: "Flume Agent Hosting",
              desc: "Always-on OpenClaw agents. Always on. Telegram + Discord.",
            },
            {
              title: "ClawPlex",
              desc: "DFW AI builders community. Meetups, intel sharing, collective learning.",
            },
            {
              title: "Open tools",
              desc: "Utilities and components that did not make it into KILN but might help someone.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: 12,
                padding: "20px 24px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  color: "var(--color-text)",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
