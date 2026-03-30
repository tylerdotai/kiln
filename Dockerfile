# syntax = docker/dockerfile:1.4

# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ─── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:20-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time vars (embed at build, not runtime)
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY=${NEXT_PUBLIC_POLAR_PUBLISHABLE_KEY}

RUN npm run build

# ─── Stage 3: Runtime ─────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
