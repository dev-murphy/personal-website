import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";

// CHANGELOG.md lives at the repo root (the source of truth maintained by
// semantic-release). Copy it into server/assets at config load so Nitro bundles
// it as a server asset (mounted under "assets:server") into .output. The
// /api/changelog endpoint then reads it via useStorage, independent of the
// runtime working directory — unlike reading the root file off disk, which is
// absent from the production image. This runs only at build/dev time (the
// config isn't evaluated in the production runtime), so the bundled copy is
// always current as of the build.
const rootDir = dirname(fileURLToPath(import.meta.url));
const changelogSrc = resolve(rootDir, "CHANGELOG.md");
if (existsSync(changelogSrc)) {
  const serverAssetsDir = resolve(rootDir, "server/assets");
  mkdirSync(serverAssetsDir, { recursive: true });
  copyFileSync(changelogSrc, resolve(serverAssetsDir, "CHANGELOG.md"));
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  site: {
    name: "ZenithCodes",
  },

  modules: [
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/seo",
    "@nuxt/content",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-charts",
    "@sentry/nuxt/module",
    "@posthog/nuxt",
  ],

  // Runtime Config
  runtimeConfig: {
    public: {
      pocketbaseUrl: "",
      posthog: {
        publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "",
        host: process.env.NUXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      },
    },
  },

  posthogConfig: {
    publicKey: process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "",
    host: process.env.NUXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    clientConfig: {
      capture_exceptions: true,
      __add_tracing_headers: ["localhost", "me.zenithcodes.xyz"],
    },
    serverConfig: {
      enableExceptionAutocapture: true,
    },
  },

  // Assets
  css: ["~/assets/css/main.css"],

  // Nuxt Content — dual-theme syntax highlighting that follows .dark-mode.
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: [
            "bash",
            "sh",
            "ts",
            "js",
            "json",
            "vue",
            "html",
            "css",
            "yaml",
            "md",
            "python",
            "go",
            "diff",
          ],
        },
      },
    },
  },

  // Vite Config
  vite: {
    plugins: [tailwindcss()],
  },

  // OG Image
  ogImage: {
    zeroRuntime: true,
  },

  // Favicon
  app: {
    head: {
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
      htmlAttrs: {
        lang: "en",
      },
      script: [
        {
          defer: true,
          src: "https://stats.zenithcodes.xyz/script.js",
          "data-website-id": "db74f217-b1c1-482f-82a3-f62f4a2b75f9",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
      ],
    },
  },

  sentry: {
    org: "zenithcodes",
    project: "javascript-nuxt"
  },

  sourcemap: {
    client: "hidden"
  }
});