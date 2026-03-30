# KILN — Next.js on Fly.io
FROM node:22-alpine AS base

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code when the app changes
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the native SQLite binding — Next.js standalone drops it, we must restore it
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@libsql/linux-x64-musl/ ./node_modules/@libsql/linux-x64-musl/

# Pre-create the data directory and DB file
RUN mkdir -p /data && touch /data/kiln.db && chown -R nextjs:nodejs /data

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
