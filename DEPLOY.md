# =============================================================================
# KILN — Deployment Guide (Fly.io)
# =============================================================================

This guide covers deploying KILN to Fly.io, configuring environment variables,
setting up custom domains, and verifying webhook endpoints.

---

## 1. Prerequisites

- [flyctl](https://fly.io/docs/flyctl/install/) installed and authenticated
- A Fly.io account

### Install flyctl

```bash
# macOS
brew install flyctl

# Linux / WSL
curl -L https://fly.io/install.sh | sh

# Verify
flyctl auth whoami
```

---

## 2. Deploy KILN to Fly.io

### Option A: CLI (recommended for first deploy)

```bash
cd ~/kiln

# Authenticate (opens browser)
fly auth login

# Create the app (reads fly.toml)
fly apps create --name kiln --org personal

# Set secrets
fly secrets set BETTER_AUTH_SECRET="$(openssl rand -base64 32)"
fly secrets set BETTER_AUTH_URL="https://kiln.build"
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set RESEND_API_KEY="re_..."
fly secrets set EMAIL_DOMAIN="kiln.build"
fly secrets set POLAR_ACCESS_TOKEN="polar_live_..."
fly secrets set POLAR_WEBHOOK_SECRET="..."
fly secrets set NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY="polar_live_..."
fly secrets set TRIGGER_SECRET_KEY="tr_dev_..."
fly secrets set FLY_API_TOKEN="fly_..."
fly secrets set FLY_ORG="personal"

# Deploy
fly deploy
```

### Option B: GitHub Actions (auto-deploy on push)

1. Create a Fly.io API token:
   ```bash
   fly tokens create deploy -a kiln
   ```
2. Add the token to GitHub: **Settings → Secrets → Actions → New repository secret**
   Name: `FLY_API_TOKEN`
3. Push to `main` — GitHub Actions handles the rest.

---

## 3. Configure Custom Domain (kiln.build)

### In Fly.io Dashboard

1. Go to [fly.io/apps/kiln](https://fly.io/apps/kiln) → **Certificates → Add certificate**
2. Enter `kiln.build`
3. Fly.io will give you DNS records.

### In Cloudflare

Add the records Fly.io provides. Typical configuration:

| Type  | Name   | Content                        |
|-------|--------|--------------------------------|
| `A`   | `kiln` | `fdaa::1` (AAAA, IPv6)         |
| `A`   | `kiln` | `<Fly.io public IPv4>`        |
| `TXT` | `kiln` | `fly-verification=<token>`     |

> If kiln.build is already in Cloudflare (zone `6118506cc869536c4ef292b535b73c79` per TOOLS.md), add the new records there.

4. Wait for certificate provisioning (Fly.io uses Let's Encrypt).
5. Click **Verify** in Fly.io once DNS propagates.

---

## 4. Configure Webhooks

### Polar.sh

1. Go to [polar.sh](https://polar.sh) → **Settings → Webhooks → New Webhook**
2. **Endpoint URL:** `https://kiln.build/api/webhooks/polar`
3. **Events to subscribe to:**
   - [x] `subscription.created`
   - [x] `subscription.updated`
   - [x] `subscription.cancelled`
   - [x] `subscription.paused`
   - [x] `checkout.completed`
   - [x] `checkout.expired`
4. Copy the **Webhook Secret** and add it to Fly.io:
   ```bash
   fly secrets set POLAR_WEBHOOK_SECRET="your_secret_here"
   fly deploy
   ```

### Resend

1. Go to [resend.com](https://resend.com) → **Domains → your domain → Webhooks → New Webhook**
2. **Endpoint URL:** `https://kiln.build/api/webhooks/resend`
3. **Events:**
   - [x] `email.delivered`
   - [x] `email.bounced`
   - [x] `email.opened`
4. Resend uses the `RESEND_API_KEY` for signature verification (already set above).

---

## 5. Verify Webhook Endpoints

### Test Polar webhook locally

```bash
npm run dev

curl -X POST http://localhost:3000/api/webhooks/polar \
  -H "Content-Type: application/json" \
  -H "polar-signature: <signature>" \
  -d '{"event":"subscription.created","delivery_id":"test-123","data":{"id":"sub_123","customer_id":"cus_123","price_id":"price_123","status":"active","current_period_start":"2026-03-29T00:00:00Z","current_period_end":"2026-04-29T00:00:00Z","cancel_at_period_end":false,"metadata":{"email":"test@example.com"},"created_at":"2026-03-29T00:00:00Z","updated_at":"2026-03-29T00:00:00Z"}}'
```

Expected log:
```
[Polar Webhook] Received event: subscription.created
[Polar] Subscription upsert: user=... tier=starter status=active
```

### Test Resend webhook

```bash
curl -X POST http://localhost:3000/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -H "resend-signature: $(echo -n '<raw-body>' | openssl dgst -sha256 -hmac "$RESEND_API_KEY" -binary | xxd -p)" \
  -d '{"type":"email.delivered","email_id":"test_123","to":"user@example.com","timestamp":1743292800}'
```

---

## 6. Trigger.dev Setup

1. Go to [app.trigger.dev](https://app.trigger.dev) → **Settings → API Keys**
2. Copy your **secret key** and add to Fly.io:
   ```bash
   fly secrets set TRIGGER_SECRET_KEY="tr_dev_..."
   fly deploy
   ```
3. Run the Trigger.dev migration:
   ```bash
   npx @trigger.dev/migrate
   ```

---

## 7. Customer Deployment Flow (How KILN Works)

KILN orchestrates Fly.io app creation for each customer who fires a deployment.

### The Flow

```
Customer picks template
       ↓
KILN requests Fly.io API to create customer-app (named after their project)
       ↓
Fly.io provisions VM, assigns .fly.dev subdomain
       ↓
KILN sends customer their deployment credentials
       ↓
Customer's SaaS is live at https://<app-name>.fly.dev
```

### Customer's Own Deployment (future self-serve)

When KILN supports customer-side tokens:

1. Customer provides their own `FLY_API_TOKEN` during onboarding
2. KILN calls `POST /api/deploy` with their template, config, and token
3. KILN's Fly.io client creates the app under the customer's org
4. Customer's app is deployed autonomously — KILN never stores their token

---

## 8. Quick Reference

| Command | Description |
|---|---|
| `fly deploy` | Deploy to Fly.io |
| `fly logs -a kiln` | Tail logs |
| `fly secrets set KEY=value -a kiln` | Set a secret |
| `fly secrets list -a kiln` | List secrets |
| `fly cert add kiln.build -a kiln` | Add custom domain |
| `fly apps list` | List your apps |
| `fly apps destroy <name>` | Destroy an app |
| `fly ips list -a kiln` | Show assigned IPs |
| `npm run dev` | Local development |

---

## Troubleshooting

**Webhook signature validation failing:**
- Verify `POLAR_WEBHOOK_SECRET` is set in Fly.io secrets
- Local test: ensure your `.env.local` matches the production value
- Polar uses `polar-signature` header (HMAC-SHA256 of raw body)

**Trigger tasks not firing:**
- Confirm `TRIGGER_SECRET_KEY` is set in Fly.io secrets
- Check `npm run dev` logs for task registration errors

**Build failing:**
- Run `npm run build` locally first
- Ensure `DATABASE_URL` is set and accessible
