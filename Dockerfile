# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Add Python and build tools needed for better-sqlite3
RUN apk add --no-cache python3 make g++

# Enable pnpm via corepack (pin to the version in package.json#packageManager)
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Copy lockfile and package manifest, then install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

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