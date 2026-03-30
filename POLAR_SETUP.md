# Polar.sh Setup Guide for KILN

## Overview

KILN uses [Polar.sh](https://polar.sh) for payments, subscriptions, and billing management. This guide walks you through creating products, configuring the webhook, and setting up environment variables.

---

## 1. Create a Polar.sh Account

1. Go to [polar.sh](https://polar.sh) and sign up
2. Complete organization setup (you'll get an `ORGANIZATION_ID`)
3. Navigate to **Settings → API Keys** and create a new API key
4. Add the key to your environment:

```bash
POLAR_API_KEY=polar_live_xxxxxxxxxxxx
POLAR_ORGANIZATION_ID=org_xxxxxxxxxxxx
```

---

## 2. Create Products in Polar.sh Dashboard

Go to **Dashboard → Products → New Product**.

### Product 1: KILN Starter (Free)

| Field | Value |
|-------|-------|
| Name | KILN Starter |
| Description | Perfect for trying out KILN |
| Price Type | Free |
| Metadata | `{"tier":"starter","deployments":1,"emails_per_month":100,"webhooks":1}` |

No checkout needed — users get access on signup automatically.

---

### Product 2: KILN Pro

| Field | Value |
|-------|-------|
| Name | KILN Pro |
| Description | For growing teams building with KILN |
| Price Type | Recurring |
| Billing Interval | Monthly |
| Price | $29.00 USD |
| Metadata | `{"tier":"pro","deployments":5,"emails_per_month":-1,"webhooks":5,"custom_domain":true}` |

**Annual Price (optional toggle):** $290.00/year (2 months free)

---

### Product 3: KILN Team

| Field | Value |
|-------|-------|
| Name | KILN Team |
| Description | For teams that need unlimited everything |
| Price Type | Recurring |
| Billing Interval | Monthly |
| Price | $99.00 USD |
| Metadata | `{"tier":"team","deployments":-1,"emails_per_month":-1,"webhooks":-1,"team_members":true,"custom_domain":true,"priority_support":true}` |

**Annual Price (optional toggle):** $990.00/year (2 months free)

---

## 3. Get Price IDs and Add to Environment Variables

After creating each product/price, Polar generates a `PRICE_ID`. Find it in the product detail page under **Prices**.

Add to your `.env.local`:

```bash
# Polar Price IDs
POLAR_PRICE_STARTER=price_xxxxxxxxxxxx
POLAR_PRICE_PRO_MONTHLY=price_xxxxxxxxxxxx
POLAR_PRICE_PRO_ANNUAL=price_xxxxxxxxxxxx
POLAR_PRICE_TEAM_MONTHLY=price_xxxxxxxxxxxx
POLAR_PRICE_TEAM_ANNUAL=price_xxxxxxxxxxxx

# Webhook signing secret (from Polar Settings → Webhooks)
POLAR_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Public env vars (safe to expose to client)
NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY=pk_xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://kiln.build
```

---

## 4. Configure Webhook

In Polar Dashboard → **Settings → Webhooks**:

1. Click **Add Endpoint**
2. **URL:** `https://kiln.build/api/webhooks/polar`
3. **Events to listen for:**
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `checkout.created`
   - `checkout.completed`
   - `checkout.expired`
4. Copy the **Webhook Secret** (`whsec_...`) into `POLAR_WEBHOOK_SECRET`

---

## 5. Webhook Handler

The webhook handler lives at `src/app/api/webhooks/polar/route.ts`. It verifies the signature and handles:

| Event | Action |
|-------|--------|
| `subscription.created` | Create user record, set tier, grant access |
| `subscription.updated` | Update tier if changed |
| `subscription.cancelled` | Mark subscription as cancelled (end of billing period) |
| `checkout.completed` | Activate subscription, grant entitlements |
| `checkout.expired` | No-op or notify user |

---

## 6. Entitlement Limits

| Feature | Starter | Pro | Team |
|---------|---------|-----|------|
| Deployments | 1 | 5 | Unlimited (-1) |
| Emails/month | 100 | Unlimited (-1) | Unlimited (-1) |
| Webhooks | 1 | 5 | Unlimited (-1) |
| Custom Domain | ❌ | ✅ | ✅ |
| Team Members | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |

---

## 7. Testing with Polar Sandbox

Use Polar's **sandbox mode** for development:

```bash
POLAR_API_KEY=polar_test_xxxxxxxxxxxx
NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

Sandbox products and price IDs are separate from live ones. Create a duplicate set in sandbox mode.

---

## 8. Verify Setup

After setup, run the health check:

```bash
curl https://kiln.build/api/health
```

And verify webhooks are being received:

```bash
curl https://kiln.build/api/webhooks/polar \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"event":"ping","delivery_id":"test"}'
```

You should get a `401` (no signature) or `200` (if signature matches) — either way, the route is live.
