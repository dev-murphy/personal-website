import PocketBase from "pocketbase";

declare module "#app" {
  interface NuxtApp {
    _pb?: PocketBase;
  }
}

/**
 * A single PocketBase client per Nuxt app instance: per-request on the server
 * (so one visitor's auth state never leaks into another's SSR render) and a
 * singleton in the browser (so the auth store and realtime connection are
 * shared across the page).
 */
export const usePocketbase = (): PocketBase => {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._pb) {
    const {
      public: { pocketbaseUrl },
    } = useRuntimeConfig();
    nuxtApp._pb = new PocketBase(pocketbaseUrl);
  }
  return nuxtApp._pb as PocketBase;
};
