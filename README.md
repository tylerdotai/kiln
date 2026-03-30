# KILN — Fire your SaaS.

**Pick a template. Configure your keys. Ship a deployed, monetized business in 30 minutes — not 30 hours.**

[KILN](https://kiln.build) is a SaaS launcher built on Next.js 15, Fly.io, Better Auth, Resend, Polar.sh, and Trigger.dev. Each "fire" spins up a customer's own deployed Fly.io app with their configured API keys.

---

## The Stack

| Layer | Tool |
|-------|------|
| Web | Next.js 15 (App Router) |
| Deploy | Fly.io (each customer gets their own app) |
| Auth | Better Auth + Drizzle ORM |
| Email | Resend + React Email |
| Payments | Polar.sh |
| Jobs | Trigger.dev |
| Styling | Tailwind CSS 3 |
| Fonts | Fraunces + Instrument Sans + JetBrains Mono |

---

## Quick Start

```bash
git clone https://github.com/tylerdotai/kiln.git
cd kiln
npm install
cp .env.example .env.local
# Fill in .env.local with your API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Fly.io

```bash
# Authenticate
fly auth login

# Launch the app
fly launch

# Set secrets
fly secrets set BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
fly secrets set RESEND_API_KEY=re_xxx
fly secrets set POLAR_ACCESS_TOKEN=polar_live_xxx
fly secrets set POLAR_WEBHOOK_SECRET=whsec_xxx
fly secrets set DATABASE_URL=libsql://xxx.turso.io

# Deploy
fly deploy
```

Or connect the GitHub repo to Fly.io for automatic deploys on push to `main`.

---

## Environment Variables

```env
BETTER_AUTH_SECRET=        # openssl rand -base64 32
BETTER_AUTH_URL=          # https://your-domain.com
RESEND_API_KEY=           # re_xxx from resend.com
EMAIL_DOMAIN=             # your verified domain
POLAR_ACCESS_TOKEN=      # polar_live_xxx from polar.sh
POLAR_WEBHOOK_SECRET=    # whsec_xxx from polar.sh
NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY= # pol_live_xxx
DATABASE_URL=             # libsql://xxx.turso.io or file:local.db
FLY_API_TOKEN=           # from fly.io/settings/tokens
FLY_ORG=                 # usually "personal"
TRIGGER_SECRET_KEY=       # td_live_xxx from trigger.dev
```

See `.env.example` for the complete list including Polar.sh price IDs.

---

## How It Works

1. **Pick a template** — SaaS Starter, API Only, Agent Panel, Blog + CMS, Marketplace, or Dashboard
2. **Configure your keys** — Add Resend, Polar.sh, Trigger.dev, and Fly.io credentials
3. **Fire the kiln** — KILN spins up your own Fly.io app with all keys wired
4. **Your SaaS is live** — Custom subdomain on Fly.io, auth working, billing connected

---

## Project Structure

```
kiln/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page (Kiln Fire hero)
│   │   ├── pricing/           # 3-tier pricing
│   │   ├── how-it-works/      # 4-step visual
│   │   ├── checkout/           # Template + key config → Polar
│   │   ├── dashboard/         # User deployments, settings, billing
│   │   ├── auth/              # Sign in / sign up
│   │   ├── docs/              # Docs hub + dynamic slugs
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact form
│   │   ├── legal/             # Privacy + terms
│   │   └── api/              # API routes
│   │       ├── auth/         # Better Auth handlers
│   │       ├── checkout/      # Polar checkout creation
│   │       ├── deploy/        # Fly.io app creation
│   │       ├── webhooks/      # Polar + Resend webhooks
│   │       └── subscriptions/ # Subscription management
│   ├── lib/
│   │   ├── auth.ts           # Better Auth + Drizzle adapter
│   │   ├── db/schema.ts      # Drizzle schema (users, sessions, deployments, api_keys)
│   │   ├── email.ts         # Resend client + send helpers
│   │   ├── polar.ts         # Polar.sh SDK client
│   │   ├── fly.ts           # Fly.io API client
│   │   ├── env.ts           # Type-safe env access
│   │   └── cost-tracking.ts  # Usage limits + billing helpers
│   └── emails/               # React Email templates
│       ├── WelcomeEmail.tsx
│       ├── PaymentFailedEmail.tsx
│       ├── DeploymentLiveEmail.tsx
│       └── ReceiptEmail.tsx
├── triggers/                   # Trigger.dev task definitions (stub)
├── Dockerfile                 # Multi-stage Fly.io build
├── fly.toml                   # Fly.io app config
├── tailwind.config.js         # Tailwind CSS 3 + custom brand tokens
├── .env.example               # All env vars documented
└── DEPLOY.md                 # Fly.io deployment guide
```

---

## Brand

- **Background:** `#F9F7F4` — warm off-white
- **Surface:** `#EFECEA`
- **Text:** `#1A1816` — warm near-black
- **Accent:** `#E85D26` — terracotta orange
- **Fonts:** Fraunces (display), Instrument Sans (body), JetBrains Mono (code)

---

## Development

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm test             # Run tests (Vitest)
```

---

## Status

KILN is in active development. The core landing page, checkout flow, auth, and Fly.io deployment pipeline are wired. Some pages (ops dashboard, full billing portal) are stubbed pending real API integration.

---

Built by [Flume SaaS Factory](https://flumeusa.com)
