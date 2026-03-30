"use client";
import Link from 'next/link';

const docLinks = [
  {
    href: '/docs/getting-started',
    title: 'Quick start guide',
    desc: 'Get KILN running locally in 10 minutes. Clone, configure, fire.',
    icon: '⚡',
    tag: 'Start here',
  },
  {
    href: '/docs/templates',
    title: 'Template documentation',
    desc: 'Browse available templates, understand what each one includes, and how to customize them.',
    icon: '📦',
    tag: 'Templates',
  },
  {
    href: '/docs/api-keys',
    title: 'API key configuration',
    desc: 'How to get API keys for Resend, Polar, Trigger.dev, and PostHog — and where to put them.',
    icon: '🔑',
    tag: 'Setup',
  },
  {
    href: '/docs/deployment',
    title: 'Deployment guide',
    desc: 'Deploy to Railway, Fly.io, or your own server. Custom domains, environment variables, and SSL.',
    icon: '🚀',
    tag: 'Production',
  },
  {
    href: '/docs/troubleshooting',
    title: 'Troubleshooting FAQ',
    desc: 'Common errors, edge cases, and how to debug when things go sideways.',
    icon: '🔧',
    tag: 'Help',
  },
];

function DocCard({
  href,
  title,
  desc,
  icon,
  tag,
}: (typeof docLinks)[0]) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--color-text)',
              }}
            >
              {title}
            </h3>
            <span className="tag">{tag}</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-secondary)', lineHeight: 1.6 }}>
            {desc}
          </p>
        </div>
        <span style={{ color: 'var(--color-accent)', fontSize: 18, marginTop: 4 }}>→</span>
      </div>
    </Link>
  );
}

export default function DocsPage() {
  return (
    <div>
      {/* Header */}
      <section
        style={{
          padding: '64px 24px 48px',
          maxWidth: 800,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Documentation
        </h1>
        <p
          style={{
            fontSize: 18,
            color: 'var(--color-secondary)',
            lineHeight: 1.6,
          }}
        >
          Everything you need to build with KILN. From zero to deployed in one place.
        </p>
      </section>

      {/* Doc Cards */}
      <section
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {docLinks.map((link) => (
            <DocCard key={link.href} {...link} />
          ))}
        </div>
      </section>

      {/* Help block */}
      <section
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '48px 24px',
          textAlign: 'center',
          background: 'var(--color-surface)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Can't find what you need?
        </h2>
        <p style={{ color: 'var(--color-secondary)', marginBottom: 24, fontSize: 15 }}>
          We're two builders who actually use this thing. Send a message and we'll help you figure it out.
        </p>
        <Link href="/contact" className="btn btn--secondary">
          Talk to a human →
        </Link>
      </section>
    </div>
  );
}
