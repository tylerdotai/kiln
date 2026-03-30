# KILN — Quick Start Guide

Everything you need to pull to wire up KILN and test it end-to-end.

---

## Step 1 — Generate Better Auth Secret

```bash
openssl rand -base64 32
```

Copy the output. That's your `BETTER_AUTH_SECRET`.

---

## Step 2 — Fly.io

### FLY_API_TOKEN
1. Go to [fly.io/settings/tokens](https://fly.io/settings/tokens)
2. Click "Create token"
3. Name it "KILN" or "kiln-deploy"
4. Copy the token — starts with `fly_`

### FLY_ORG
- Leave as `personal` (default) unless you have a specific org

### FLY_APP_NAME (for KILN itself)
- Your KILN control plane app — call it `kiln` or `kiln-prod`

---

## Step 3 — Resend (Email)

1. Sign up at [resend.com](https://resend.com)
2. Add and verify a domain (or use `resend.com` for testing)
3. Go to API Keys → Create API Key → name it "KILN"
4. Copy the key — starts with `re_`

`RESEND_API_KEY=re_xxxx`
`EMAIL_DOMAIN=yourdomain.com` (or `resend.com` for testing)

---

## Step 4 — Polar.sh (Payments)

1. Sign up at [polar.sh](https://polar.sh)
2. Go to Settings → API Keys → Create access token
3. Copy the key — starts with `polar_live_`

**POLAR_ACCESS_TOKEN:** `polar_live_xxxx`
**NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY:** from the same page

### Set up Products

In Polar.sh Dashboard → Products:

**Starter (Free)**
- Name: "KILN Starter"
- Type: Recurring
- Price: $0/mo or free trial
- Get the Price ID → `NEXT_PUBLIC_POLAR_PRICE_STARTER_MONTHLY`

**Pro ($15/mo)**
- Name: "KILN Pro"
- Type: Recurring
- Price: $15/mo
- Get the Price ID → `NEXT_PUBLIC_POLAR_PRICE_PRO_MONTHLY`

**Team ($49/mo)**
- Name: "KILN Team"
- Type: Recurring
- Price: $49/mo
- Get the Price ID → `NEXT_PUBLIC_POLAR_PRICE_TEAM_MONTHLY`

### Set up Webhook

1. Polar.sh → Settings → Webhooks
2. Add webhook: `https://your-domain.com/api/webhooks/polar`
3. Events to listen for: `payment.created`, `payment.succeeded`, `payment.failed`
4. Copy the webhook secret → `POLAR_WEBHOOK_SECRET`

---

## Step 5 — Database

For local testing, use SQLite (no setup needed):

```
DATABASE_URL=file:local.db
```

For production, use Turso (free tier):
1. Sign up at [turso.tech](https://turso.tech)
2. Create a database: `turso db create kiln`
3. Get the URL: `turso db show kiln --url`
4. Copy as `DATABASE_URL=libsql://your-db.turso.io`

---

## Step 6 — LLM Providers (for your agents)

### Groq (Free — recommended for Starter)
1. Go to [groq.com](https://groq.com)
2. Sign up (free, no credit card)
3. API Keys → Create → copy
4. Key starts with `gsk_`

### OpenRouter (Free models)
1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create key → copy
3. Key starts with `sk-or-`

### Google Gemini (Free tier)
1. Go to [aistudio.google.com/app/apikeys](https://aistudio.google.com/app/apikeys)
2. Create API Key → copy
3. Key starts with `AIza`

### OpenAI (BYOK)
1. [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create key → copy

### Anthropic (BYOK)
1. [console.anthropic.com/api-keys](https://console.anthropic.com/api-keys)
2. Create key → copy

---

## Step 7 — Channel Tokens (Discord/Telegram/Slack)

### Discord Bot Token
1. Go to [discord.com/developers](https://discord.com/developers) → Applications
2. Create app → Bot → Reset Token → copy
3. Enable: Message Content Intent, Server Members Intent
4. OAuth2 → URL Generator → add redirect: `https://your-agent.fly.dev/setup`
5. Generate invite link → add bot to your server

### Telegram Bot Token
1. Open Telegram → chat with [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow prompts, copy the token (like `123456789:ABCdef...`)

### Slack Bot Token
1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. OAuth & Permissions → add Bot Token Scopes:
   - `chat:write`
   - `commands`
   - `app_mentions:read`
3. Install to Workspace → copy Bot OAuth Token (starts with `xoxb-`)

---

## Step 8 — Deploy KILN to Fly.io

```bash
cd ~/kiln

# Authenticate
fly auth login

# Launch app
fly launch --app kiln --region iad --yes

# Set all secrets
fly secrets set BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
fly secrets set DATABASE_URL="file:local.db"
fly secrets set RESEND_API_KEY="re_xxxx"
fly secrets set EMAIL_DOMAIN="resend.com"
fly secrets set POLAR_ACCESS_TOKEN="polar_live_xxxx"
fly secrets set POLAR_WEBHOOK_SECRET="whsec_xxxx"
fly secrets set NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY="pol_live_xxxx"
fly secrets set FLY_API_TOKEN="fly_xxxx"
fly secrets set FLY_ORG="personal"
fly secrets set NEXT_PUBLIC_APP_URL="https://kiln.fly.dev"

# Deploy
fly deploy --remote-only
```

---

## Step 9 — Wire Polar Webhook

In Polar.sh Dashboard → Settings → Webhooks:
- URL: `https://kiln.fly.dev/api/webhooks/polar`
- Events: `payment.created`, `payment.succeeded`, `payment.failed`

---

## Step 10 — Test the Flow

1. Go to `https://kiln.fly.dev`
2. Click "Deploy an agent"
3. Pick Starter (Free) → Start free
4. Pick channel (Discord/Telegram)
5. Add Groq API key (free, no card)
6. Add your Discord/Telegram bot token
7. Click "Fire the kiln"
8. Wait 2-3 minutes for deploy
9. Go to your agent URL → complete channel setup in the wizard

---

## All Env Vars Summary

```env
# Auth
BETTER_AUTH_SECRET=generated_above

# Database
DATABASE_URL=file:local.db

# Email
RESEND_API_KEY=re_xxxx
EMAIL_DOMAIN=resend.com

# Payments
POLAR_ACCESS_TOKEN=polar_live_xxxx
POLAR_WEBHOOK_SECRET=whsec_xxxx
NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY=pol_live_xxxx
NEXT_PUBLIC_POLAR_PRICE_STARTER_MONTHLY=pri_xxxx
NEXT_PUBLIC_POLAR_PRICE_PRO_MONTHLY=pri_xxxx
NEXT_PUBLIC_POLAR_PRICE_TEAM_MONTHLY=pri_xxxx

# Fly.io
FLY_API_TOKEN=fly_xxxx
FLY_ORG=personal

# App
NEXT_PUBLIC_APP_URL=https://kiln.fly.dev
DEPLOY_HMAC_SECRET=any_random_string

# LLM (for your agents)
GROQ_API_KEY=gsk_xxxx
OPENROUTER_API_KEY=sk-or-xxxx
GEMINI_API_KEY=AIza_xxxx
```

---

## Troubleshooting

**"BETTER_AUTH_SECRET not set" error:**
Run the `openssl rand -base64 32` command and set the secret.

**Polar webhook not firing:**
- Check webhook URL is `https://your-domain.com/api/webhooks/polar` (not `/polar/`)
- Verify webhook secret matches exactly
- Check Polar dashboard → Webhooks → recent deliveries

**Deploy failing:**
- Run `fly logs -a kiln` to see error logs
- Verify `FLY_API_TOKEN` is valid
- Check `fly.io` dashboard → your app → deployments

**Email not sending:**
- Verify domain is confirmed in Resend
- Check Resend → Webhooks for bounce/complaint events
