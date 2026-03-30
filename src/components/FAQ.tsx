'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Can I use my own domain?',
    answer: 'Yes. Once your app is deployed, you can point any domain at it. We don\'t lock you into a subdomain. Just update your DNS records and you\'re set.',
  },
  {
    question: 'What happens if I cancel?',
    answer: 'Your app keeps running until the end of your billing period. After that, it\'s paused (not deleted) for 30 days so you can grab your data. We export everything as a ZIP — database, uploads, the works.',
  },
  {
    question: 'Is my data portable?',
    answer: 'Absolutely. Your database is just Postgres — dump it any time. Emails, files, analytics events — all yours. We\'ll never hold your data hostage or charge you to leave.',
  },
  {
    question: 'How does billing work?',
    answer: 'You pay for KILN\'s scaffolding and management layer. The underlying infrastructure (Resend, Polar, Trigger.dev) is billed directly by those providers at their rates. We\'re transparent about all costs upfront — no surprises on your first invoice.',
  },
  {
    question: 'Can I white-label the admin dashboard?',
    answer: 'The scaffolding gives you a pre-built admin dashboard for managing users and subscriptions. You can restyle it with your own brand colors and logo. Full white-labelling of the entire stack is on our roadmap.',
  },
  {
    question: 'What if I hit a service limit?',
    answer: 'Each service has its own free tier limits. Resend gives you 100 emails/day free, Polar has usage-based billing, Trigger.dev is free up to 30k runs/month. When you scale, you upgrade the underlying service directly — not through us.',
  },
  {
    question: 'Can I add my own services?',
    answer: 'Yes. The templates are starting points. Want to swap in a different email provider or add a vector DB? The code is yours to modify. KILN scaffolds the wiring — you\'re in control of the rest.',
  },
  {
    question: 'Is there a trial?',
    answer: 'You can run KILN locally for free — no API keys required to start. When you\'re ready to deploy, that\'s when you connect your service keys. We don\'t make you pay to experiment.',
  },
  {
    question: 'What stack does KILN use?',
    answer: 'Node.js with Hono, Drizzle ORM, Neon Postgres, Better Auth, Resend, Polar, Trigger.dev, and PostHog. If you know React, you\'re already there. The stack is intentionally boring — pick it up once, ship forever.',
  },
  {
    question: 'Who actually reads the contact form?',
    answer: 'Us. Flume SaaS Factory — two people who actually build and use KILN. If you send a message, you\'ll get a real reply from a human who knows the product. No support ticket queue, no bots.',
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQAccordionItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 16,
        }}
        aria-expanded={open}
      >
        <span style={{
          fontFamily: 'var(--font-headline)',
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--color-text)',
        }}>
          {question}
        </span>
        <span style={{ color: 'var(--color-secondary)', flexShrink: 0 }}>
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? 400 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.2s ease',
        }}
      >
        <p style={{
          paddingBottom: 20,
          fontSize: 15,
          color: 'var(--color-secondary)',
          lineHeight: 1.7,
        }}>
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '40px',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-headline)',
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Frequently asked questions
      </h2>
      <p style={{
        textAlign: 'center',
        color: 'var(--color-secondary)',
        marginBottom: 40,
        fontSize: 16,
      }}>
        Real answers. No marketing fluff.
      </p>

      <div>
        {faqs.map((faq, i) => (
          <FAQAccordionItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div style={{
        marginTop: 40,
        paddingTop: 32,
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 15, color: 'var(--color-secondary)', marginBottom: 16 }}>
          Still have questions?
        </p>
        <a href="/contact" className="btn btn--secondary">
          Talk to a human →
        </a>
      </div>
    </div>
  );
}
