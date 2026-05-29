# Personal Website

My personal portfolio website — a landing page with project and work-experience
sections, theming (light/dark), and SEO.

## Tech stack

- [Nuxt 4](https://nuxt.com) (Vue 3, Nitro server)
- [@nuxt/content](https://content.nuxt.com) v3 — Markdown content, backed by SQLite (`better-sqlite3`)
- [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite`
- [@nuxt/image](https://image.nuxt.com), [@nuxt/fonts](https://fonts.nuxt.com)
- [@nuxtjs/seo](https://nuxtseo.com) (sitemap, robots, OG image, schema.org)
- [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) for theming
- Package manager: **pnpm** (pinned via `packageManager` in `package.json`)

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start the dev server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production build

```bash
pnpm build           # build the Nitro server output into .output/
pnpm preview         # locally preview the production build
```

The server entry point is `.output/server/index.mjs`. It listens on `HOST`/`PORT`
(defaults `0.0.0.0:3000`, or whatever you set via env).

## Docker

The included [`Dockerfile`](./Dockerfile) is a multi-stage build (Alpine):

```bash
docker build -t personal-website .
docker run -p 3002:3002 personal-website
```

The container serves on **port 3002** (`PORT`/`HOST` are set as `ENV`; override at
runtime if your platform injects its own `$PORT`).

### Native dependency note (important)

`@nuxt/content` v3 uses `better-sqlite3`, a **native C++ addon**, to serve content
from a SQLite database. This affects the Docker build in two ways:

1. **Build stage** needs `python3 make g++` to compile `better-sqlite3` (no musl
   prebuilt binary ships for Alpine).
2. **Runtime stage** needs **`libstdc++`** installed — the compiled addon links
   against it at load time. The base `node:alpine` image does *not* include it,
   so without `apk add libstdc++` the server crashes on startup with
   `Error loading shared library libstdc++.so.6`, and the container never comes
   up (a fronting proxy will show a generic 500 / "temporarily unavailable").

Both are already handled in the `Dockerfile` — keep them if you edit it.

## Releases

This repo uses [semantic-release](https://semantic-release.gitbook.io) with
Conventional Commits. Versioning and `CHANGELOG.md` are generated automatically
from commit messages in CI.

## Learn more

- [Nuxt documentation](https://nuxt.com/docs)
- [Nuxt deployment guide](https://nuxt.com/docs/getting-started/deployment)
