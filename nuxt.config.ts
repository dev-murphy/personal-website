import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxt/image", "@nuxtjs/seo", "@nuxt/content"],

  // Assets
  css: ["./app/assets/css/main.css"],

  // Vite Config
  vite: {
    plugins: [tailwindcss()],
  },

  // OG Image
  ogImage: {
    zeroRuntime: true,
  },
});
