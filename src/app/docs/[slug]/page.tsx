import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';



// ─── Doc Content Registry ────────────────────────────────────────────────────

const docs: Record<string, {
  title: string;
  description: string;
  icon: string;
  content: () => React.ReactNode;
}> = {
  'getting-started': {
    title: 'Quick start guide',
    description: 'Get KILN running locally in 10 minutes.',
    icon: '⚡',
    content: GettingStartedContent,
  },
  templates: {
    title: 'Template documentation',
    description: 'Browse templates and understand what each includes.',
    icon: '📦',
    content: TemplatesContent,
  },
  'api-keys': {
    title: 'API key configuration',
    description: 'Get your API keys and wire everything together.',
    icon: '🔑',
    content: ApiKeysContent,
  },
  deployment: {
    title: 'Deployment guide',
    description: 'Ship to production with custom domains and SSL.',
    icon: '🚀',
    content: DeploymentContent,
  },
  troubleshooting: {
    title: 'Troubleshooting FAQ',
    description: 'Fix common issues and edge cases.',
    icon: '🔧',
    content: TroubleshootingContent,
  },
};

const allSlugs = Object.keys(docs);

export async function generateStaticParams() {
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = docs[slug];
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function DocSidebar({ current }: { current: string }) {
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        position: 'sticky',
        top: 88,
        alignSelf: 'flex-start',
        paddingRight: 32,
        borderRight: '1px solid var(--color-border)',
      }}
    >
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--color-secondary)',
          marginBottom: 12,
        }}
      >
        Documentation
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {allSlugs.map((slug) => {
          const doc = docs[slug];
          const active = slug === current;
          return (
            <Link
              key={slug}
              href={`/docs/${slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--color-accent)' : 'var(--color-secondary)',
                background: active ? 'var(--color-accent-light)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.1s ease',
              }}
            >
              <span style={{ fontSize: 14 }}>{doc.icon}</span>
              {doc.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ─── Content Wrappers ────────────────────────────────────────────────────────

function DocContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 48px',
        flex: 1,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

function DocH2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-headline)',
        fontSize: '1.5rem',
        fontWeight: 600,
        marginTop: 40,
        marginBottom: 16,
        paddingTop: 40,
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      {children}
    </h2>
  );
}

function DocH3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-headline)',
        fontSize: '1.15rem',
        fontWeight: 600,
        marginTop: 28,
        marginBottom: 12,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </h3>
  );
}

function DocP({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 15,
        color: 'var(--color-secondary)',
        lineHeight: 1.8,
        marginBottom: 16,
      }}
    >
      {children}
    </p>
  );
}

function DocCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        padding: '2px 6px',
        borderRadius: 4,
        color: 'var(--color-text)',
      }}
    >
      {children}
    </code>
  );
}

function DocPre({ children }: { children: React.ReactNode }) {
  return (
    <pre
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        background: '#1A1816',
        color: '#F9F7F4',
        padding: '20px 24px',
        borderRadius: 8,
        overflowX: 'auto',
        marginBottom: 20,
        lineHeight: 1.7,
      }}
    >
      {children}
    </pre>
  );
}

function DocList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        fontSize: 15,
        color: 'var(--color-secondary)',
        lineHeight: 1.8,
        marginBottom: 16,
        paddingLeft: 20,
      }}
    >
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function DocNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-accent-light)',
        border: '1px solid rgba(232,93,38,0.2)',
        borderRadius: 8,
        padding: '16px 20px',
        marginBottom: 20,
        fontSize: 14,
        color: 'var(--color-text)',
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

// ─── Content Components ──────────────────────────────────────────────────────

function GettingStartedContent() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
        Quick start guide
      </h1>
      <p style={{ color: 'var(--color-secondary)', marginBottom: 32, fontSize: 15 }}>
        Get KILN running locally in 10 minutes. No credit card required.
      </p>

      <DocH2>Prerequisites</DocH2>
      <DocList items={[
        'Node.js 20 or later',
        'npm or pnpm',
        'Git',
        'A code editor (we like Zed or VS Code)',
      ]} />

      <DocH2>1. Clone the repo</DocH2>
      <DocP>Start with the template you want. We'll use the SaaS Starter for this guide.</DocP>
      <DocPre>{`git clone https://github.com/flumesaas/kiln-saas-starter.git my-saas
cd my-saas
npm install`}</DocPre>

      <DocH2>2. Copy your env file</DocH2>
      <DocP>KILN needs a few environment variables. Copy the example and fill in your keys.</DocP>
      <DocPre>{`cp .env.example .env`}</DocPre>
      <DocNote>
        <strong>Don't have API keys yet?</strong> Head to the{' '}
        <Link href="/docs/api-keys" style={{ color: 'var(--color-accent)' }}>API key guide</Link>{' '}
        to get set up with Resend, Polar, Trigger.dev, and PostHog.
      </DocNote>

      <DocH2>3. Run the dev server</DocH2>
      <DocPre>{`npm run dev`}</DocPre>
      <DocP>Your app is running at <DocCode>http://localhost:3000</DocCode>.</DocP>

      <DocH2>4. Fire KILN</DocH2>
      <DocP>When you're ready to deploy, run:</DocP>
      <DocPre>{`npx kiln fire`}</DocPre>
      <DocP>This will run migrations, generate auth tables, and prepare everything for production.</DocP>

      <DocH2>What's next?</DocH2>
      <DocList items={[
        'Customize your template — swap logos, colors, copy',
        'Deploy to production — see the Deployment guide',
        'Read about all integrations in Template docs',
      ]} />
    </>
  );
}

function TemplatesContent() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
        Template documentation
      </h1>
      <p style={{ color: 'var(--color-secondary)', marginBottom: 32, fontSize: 15 }}>
        Each template is a complete, runnable project. Pick your starting point.
      </p>

      <DocH2>Available templates</DocH2>

      <DocH3>SaaS Starter</DocH3>
      <DocP>The full-stack starting point. Everything wired, everything typed.</DocP>
      <DocList items={[
        'Better Auth — magic link, password, Google OAuth',
        'Drizzle ORM with Neon Postgres schema',
        'Resend for transactional email',
        'Polar for subscriptions and one-time payments',
        'PostHog for product analytics',
        'Trigger.dev for background jobs',
        'Admin dashboard for user and billing management',
      ]} />

      <DocH3>Marketplace Starter</DocH3>
      <DocP>Two-sided marketplace template. Buyers, sellers, listings, and escrow.</DocP>
      <DocList items={[
        'Everything in SaaS Starter',
        'Multi-tenant schema — orgs, roles, permissions',
        'Escrow payment flow via Polar',
        'Listing and order management',
        'Email notifications for both sides',
      ]} />

      <DocH3>API Backend</DocH3>
      <DocP>Headless API with auth and webhooks. Bring your own frontend.</DocP>
      <DocList items={[
        'Better Auth with API key authentication',
        'Drizzle ORM with clean schema',
        'Resend for system emails',
        'Trigger.dev for webhook processing',
        'PostHog for API usage analytics',
      ]} />

      <DocH2>Customizing templates</DocH2>
      <DocP>Templates are yours. Edit anything — the logo, the copy, the database schema, the email templates. KILN doesn't lock you into its defaults.</DocP>
      <DocNote>
        When you pull template updates, use <DocCode>git merge</DocCode> or <DocCode>git rebase</DocCode>. If you've modified shared files, you'll need to resolve conflicts manually.
      </DocNote>
    </>
  );
}

function ApiKeysContent() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
        API key configuration
      </h1>
      <p style={{ color: 'var(--color-secondary)', marginBottom: 32, fontSize: 15 }}>
        Four services power KILN. Here's how to get the keys and where they go.
      </p>

      <DocH2>Resend (Email)</DocH2>
      <DocP>Resend handles all transactional email — magic link logins, onboarding, receipts.</DocP>
      <DocList items={[
        'Sign up at resend.com (free tier: 100 emails/day)',
        'Create an API key in your Resend dashboard',
        'Add a domain or use resend.dev for testing',
        'Set: RESEND_API_KEY=re_...',
      ]} />

      <DocH2>Polar (Payments)</DocH2>
      <DocP>Polar manages subscriptions, one-time payments, invoices, and webhooks.</DocP>
      <DocList items={[
        'Sign up at polar.sh (free to start, usage-based pricing)',
        'Create a new organization in Polar',
        'Create an API key with read/write webhooks permission',
        'Set: POLAR_ACCESS_TOKEN=po_...',
        'Set: POLAR_WEBHOOK_SECRET=whsec_...',
      ]} />
      <DocNote>
        You'll also need to configure your Polar webhook URL in your app to point at{' '}
        <DocCode>/api/webhooks/polar</DocCode>.
      </DocNote>

      <DocH2>Trigger.dev (Background Jobs)</DocH2>
      <DocP>Trigger.dev handles scheduled jobs, webhooks, and long-running tasks.</DocP>
      <DocList items={[
        'Sign up at trigger.dev (free tier: 30k runs/month)',
        'Create a new project',
        'Copy your Trigger URL and secret key',
        'Set: TRIGGER_SECRET_KEY=tr_...',
        'Set: TRIGGER_URL=https://trigger.dev',
      ]} />

      <DocH2>PostHog (Analytics)</DocH2>
      <DocP>PostHog gives you product analytics, session recordings, and feature flags.</DocP>
      <DocList items={[
        'Sign up at posthog.com (free tier: 1M events/month)',
        'Create a new project',
        'Copy your API key and PostHog host URL',
        'Set: POSTHOG_API_KEY=phc_...',
        'Set: NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com',
      ]} />

      <DocH2>All environment variables</DocH2>
      <DocPre>{`# Required
RESEND_API_KEY=re_...
POLAR_ACCESS_TOKEN=po_...
POLAR_WEBHOOK_SECRET=whsec_...
TRIGGER_SECRET_KEY=tr_...
POSTHOG_API_KEY=phc_...

# Database (Neon)
DATABASE_URL=postgresql://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000`}</DocPre>
    </>
  );
}

function DeploymentContent() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
        Deployment guide
      </h1>
      <p style={{ color: 'var(--color-secondary)', marginBottom: 32, fontSize: 15 }}>
        Ship to production. Custom domains, SSL, and environment variables — all covered.
      </p>

      <DocH2>Railway (Recommended)</DocH2>
      <DocP>Railway is the fastest path to production. One-click deploy with Postgres, autoscaling, and zero config.</DocP>
      <DocList items={[
        'Push your repo to GitHub',
        'Connect the repo to Railway',
        'Add your environment variables (see API key guide)',
        'Deploy — Railway auto-detects the build',
        'Add a custom domain in Railway settings',
      ]} />

      <DocH2>Fly.io</DocH2>
      <DocP>Fly.io runs your app close to your users with native autoscaling.</DocP>
      <DocList items={[
        'Install flyctl: curl -L https://fly.io/install.sh | sh',
        'Run: fly launch',
        'Set secrets: fly secrets set RESEND_API_KEY=re_...',
        'Deploy: fly deploy',
        'Add a custom domain: fly certs add yourdomain.com',
      ]} />

      <DocH2>Self-hosted (Docker)</DocH2>
      <DocP>Run KILN on any Docker-compatible host — VPS, bare metal, or your own server.</DocP>
      <DocPre>{`# Build
docker build -t my-saas .

# Run
docker run -d \\
  --env-file .env \\
  -p 3000:3000 \\
  my-saas`}</DocPre>

      <DocH2>Custom domain & SSL</DocH2>
      <DocList items={[
        'Point your DNS A record at your server IP (or CNAME at your platform)',
        'Your platform handles SSL automatically (Railway, Fly.io, Vercel)',
        'For self-hosted: use Caddy or nginx with Let\'s Encrypt',
        'Update NEXT_PUBLIC_APP_URL to your production domain',
        'Update your Resend/Polar/Trigger webhook URLs to use HTTPS',
      ]} />

      <DocH2>Post-deployment checklist</DocH2>
      <DocList items={[
        '✓ Verify auth — sign up, log in, magic link, Google OAuth',
        '✓ Verify payments — test a subscription or one-time payment',
        '✓ Verify emails — check Resend delivery logs',
        '✓ Verify webhooks — check Polar webhook delivery',
        '✓ Check PostHog — confirm events are flowing',
        '✓ Check Trigger.dev — confirm jobs are registered',
      ]} />
    </>
  );
}

function TroubleshootingContent() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
        Troubleshooting
      </h1>
      <p style={{ color: 'var(--color-secondary)', marginBottom: 32, fontSize: 15 }}>
        Common problems, real solutions. If you're stuck, check here first.
      </p>

      <DocH2>Auth issues</DocH2>

      <DocH3>Magic link never arrives</DocH3>
      <DocP>Check these in order:</DocP>
      <DocList items={[
        'Spam folder — Resend emails sometimes land there',
        'Verify your RESEND_API_KEY is correct and active',
        'Check Resend delivery logs in your dashboard',
        'For dev: use the Resend dev email (add .test to the domain)',
        'Confirm NEXT_PUBLIC_APP_URL uses HTTPS in production',
      ]} />

      <DocH3>Google OAuth fails</DocH3>
      <DocP>Make sure your Google OAuth redirect URI is set to:<br />
      <DocCode>https://yourdomain.com/auth/oauth/google/callback</DocCode></DocP>

      <DocH2>Payment issues</DocH2>

      <DocH3>Webhooks not firing</DocH3>
      <DocP>Polar webhooks require HTTPS. Localhost won't work for live webhooks.</DocP>
      <DocList items={[
        'Use ngrok for local webhook testing: ngrok http 3000',
        'Update Polar webhook URL to your ngrok URL during dev',
        'Check Polar webhook delivery logs for error details',
        'Verify POLAR_WEBHOOK_SECRET matches exactly',
      ]} />

      <DocH2>Database issues</DocH2>

      <DocH3>Migration fails</DocH3>
      <DocPre>{`# Check your DATABASE_URL is correct
echo $DATABASE_URL

# Run migrations manually
npm run db:migrate

# Push schema directly (dev only)
npm run db:push`}</DocPre>

      <DocH2>Email issues</DocH2>

      <DocH3>Emails sending to spam</DocH3>
      <DocList items={[
        'Use a custom domain in Resend (not @resend.dev)',
        'Set up SPF, DKIM, and DMARC records for your sending domain',
        'Warm up your domain by gradually increasing volume',
        'Check Resend\'s deliverability guide for full setup',
      ]} />

      <DocH2>Still stuck?</DocH2>
      <DocP>
        We read every message. <Link href="/contact" style={{ color: 'var(--color-accent)' }}>Send us what you're seeing</Link> and we'll help you figure it out.
      </DocP>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DocSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = docs[slug];

  if (!doc) {
    notFound();
  }

  const DocBody = doc.content;

  return (
    <div>
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          <DocSidebar current={slug} />
          <DocContent>
            <DocBody />
          </DocContent>
        </div>
      </section>
    </div>
  );
}
