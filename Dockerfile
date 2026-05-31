# syntax=docker/dockerfile:1

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Add Python and build tools needed for better-sqlite3 (no prebuilt musl binary)
RUN apk add --no-cache python3 make g++

# Enable pnpm via corepack (pin to the version in package.json#packageManager).
# Pin the store to a fixed path so we can mount it as a persistent BuildKit cache.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV npm_config_store_dir="/pnpm/store"
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Fetch dependencies from the lockfile ONLY. `pnpm fetch` never reads
# package.json, so this layer is NOT invalidated when semantic-release bumps
# the version field on every release. Combined with the cache mount, the
# package downloads and the native better-sqlite3 build survive across deploys.
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch --frozen-lockfile

# Install from the local store (offline — no network round-trips), then build.
COPY package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --offline

# Copy source and build. The Nuxt/Vite build cache is mounted so incremental
# rebuilds reuse prior compilation work.
COPY . .
RUN --mount=type=cache,id=nuxt-build,target=/app/node_modules/.cache \
    pnpm run build

# Stage 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

# better-sqlite3 (via @nuxt/content) is a native addon that links against
# libstdc++ at runtime. node:alpine doesn't ship it, so the server would crash
# on startup with "Error loading shared library libstdc++.so.6".
RUN apk add --no-cache libstdc++

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3002

# Copy built output from builder
COPY --from=builder /app/.output /app/.output

EXPOSE 3002

CMD ["node", ".output/server/index.mjs"]
