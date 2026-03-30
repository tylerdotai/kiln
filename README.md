# KILN — Deploy your OpenClaw agent to Fly.io.

**Pick your channel. Add your API keys. Fire. Your OpenClaw agent is live in 30 minutes.**

KILN is a deployment service for [OpenClaw](https://github.com/openclaw/openclaw) agents. Each deployment spins up a customer's own always-on OpenClaw instance on Fly.io — connected to Discord, Telegram, Slack, or web.

---

## What KILN Does

1. **You pick a channel** — Discord, Telegram, Slack, or web
2. **You add your API keys** — OpenAI, Anthropic, Google Gemini, or MiniMax. Plus your channel tokens.
3. **KILN fires the kiln** — We deploy your OpenClaw agent to Fly.io, wire everything, and hand you a live URL.

---

## The Stack

| Layer | Tool |
|-------|------|
| Agent gateway | [OpenClaw](https://github.com/openclaw/openclaw) |
| Deploy target | Fly.io (persistent, always-on) |
| Auth | Better Auth + Drizzle ORM |
| Email | Resend + React Email |
| Payments | Polar.sh |
| Styling | Tailwind CSS 3 |
| Fonts | Fraunces + Instrument Sans + JetBrains Mono |

---

## Quick Start

```bash
git clone https://github.com/tylerdotai/kiln.git
cd kiln
npm install
cp .env.example .env.local
# Fill in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Fly.io

```bash
fly auth login
fly launch
fly secrets set BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
fly secrets set RESEND_API_KEY=re_xxx
fly secrets set POLAR_ACCESS_TOKEN=polar_live_xxx
fly secrets set POLAR_WEBHOOK_SECRET=whsec_xxx
fly secrets set DATABASE_URL=libsql://xxx.turso.io
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

---

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| Starter | Free | 1 agent, Discord, GPT-3.5, 100 msg/day |
| Pro | $15/mo | 1 agent, all channels, all models, unlimited |
| Team | $49/mo | 5 agents, all channels, Slack workspace |

Plus your own API key costs — you pay your LLM provider directly.

---

## Project Structure

```
kiln/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page (Kiln Fire hero)
│   │   ├── pricing/           # 3-tier pricing
│   │   ├── how-it-works/      # Channel → Keys → Fire → Live
│   │   ├── checkout/           # Template + key config → Polar
│   │   ├── dashboard/         # User deployments, settings, billing
│   │   ├── auth/              # Sign in / sign up
│   │   ├── docs/              # Docs hub + dynamic slugs
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact form
│   │   └── api/              # API routes
│   │       ├── auth/
│   │       ├── checkout/
│   │       ├── deploy/        # Fly.io app creation
│   │       └── webhooks/
│   ├── lib/
│   │   ├── auth.ts           # Better Auth + Drizzle
│   │   ├── db/schema.ts      # Schema: users, deployments, api_keys
│   │   ├── email.ts         # Resend + send helpers
│   │   ├── polar.ts         # Polar.sh SDK
│   │   ├── fly.ts           # Fly.io API client
│   │   ├── env.ts           # Type-safe env
│   │   └── cost-tracking.ts
│   └── emails/               # React Email templates
├── triggers/                   # Trigger.dev tasks
├── Dockerfile                 # Multi-stage Fly.io build
├── fly.toml                   # Fly.io app config
├── tailwind.config.js         # Tailwind CSS 3 + brand tokens
├── .env.example              # All env vars
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

KILN is in active development. Core landing page, checkout flow, auth, and Fly.io deployment pipeline are wired. Some pages (ops dashboard, full billing portal) are stubbed.

---

Built by [Flume SaaS Factory](https://flumeusa.com)
