# KILN — Next.js on Fly.io
FROM node:22-alpine AS base

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps && npm install @libsql/linux-x64-musl@0.5.29 --legacy-peer-deps

# Rebuild the source code when the app changes
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and start up
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the Next.js standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy the native SQLite binding for libsql (needed for /data/kiln.db)
COPY --from=deps /app/node_modules/@libsql/linux-x64-musl/ ./node_modules/@libsql/linux-x64-musl/
COPY --from=deps /app/node_modules/@neon-rs/load/ ./node_modules/@neon-rs/load/
COPY --from=deps /app/node_modules/detect-libc/ ./node_modules/detect-libc/

# Pre-create the data directory and DB file
RUN mkdir -p /data && touch /data/kiln.db && chown -R nextjs:nodejs /data

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
