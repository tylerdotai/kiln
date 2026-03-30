"use client";
import Link from "next/link";

const docLinks = [
  {
    href: "/docs/getting-started",
    title: "Getting started",
    desc: "How to set up your Discord or Telegram bot and connect it to KILN.",
    tag: "Start here",
  },
  {
    href: "/docs/discord",
    title: "Discord setup",
    desc: "Step-by-step guide to creating your Discord bot and getting your bot token.",
    tag: "Channels",
  },
  {
    href: "/docs/telegram",
    title: "Telegram setup",
    desc: "How to create a Telegram bot using BotFather and get your token.",
    tag: "Channels",
  },
  {
    href: "/docs/api-keys",
    title: "Connecting your AI",
    desc: "How to use your OpenAI, Anthropic, or Google account with your agent.",
    tag: "Setup",
  },
  {
    href: "/docs/troubleshooting",
    title: "Troubleshooting",
    desc: "Common issues and how to fix them. Or, just message us.",
    tag: "Help",
  },
];

function DocCard({ href, title, desc, tag }: (typeof docLinks)[0]) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 28px",
        textDecoration: "none",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h3
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: 17,
                fontWeight: 600,
                color: "var(--color-text)",
              }}
            >
              {title}
            </h3>
            <span className="tag">{tag}</span>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-secondary)", lineHeight: 1.6 }}>
            {desc}
          </p>
        </div>
        <span style={{ color: "var(--color-accent)", fontSize: 18, marginTop: 2 }}>&#x2192;</span>
      </div>
    </Link>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section
        style={{
          padding: "48px 24px 40px",
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          Help & Setup Guides
        </h1>
        <p
          style={{
            fontSize: 17,
            color: "var(--color-secondary)",
            lineHeight: 1.6,
          }}
        >
          Everything you need to get your AI agent up and running.
        </p>
      </section>

      {/* Doc Cards */}
      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {docLinks.map((link) => (
            <DocCard key={link.href} {...link} />
          ))}
        </div>
      </section>

      {/* Still stuck */}
      <section
        style={{
          borderTop: "1px solid var(--color-border)",
          padding: "48px 24px",
          textAlign: "center",
          background: "var(--color-surface)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "1.4rem",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Still have questions?
        </h2>
        <p style={{ color: "var(--color-secondary)", marginBottom: 20, fontSize: 15 }}>
          Message us and we'll help you get set up.
        </p>
        <Link href="/contact" className="btn btn--secondary">
          Talk to us
        </Link>
      </section>
    </div>
  );
}
