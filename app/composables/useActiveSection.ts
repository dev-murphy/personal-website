export const useActiveSection = (sectionIds: string[]) => {
  const activeSection = ref<string | null>(null);
  const observers: IntersectionObserver[] = [];
  const visible = new Map<string, number>();
  const recompute = () => {
    const atBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 8;
    if (atBottom && sectionIds.length) {
      activeSection.value = sectionIds[sectionIds.length - 1] ?? null;
      return;
    }

    let best: string | null = null;
    let bestRatio = 0;
    for (const id of sectionIds) {
      const ratio = visible.get(id) ?? 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        best = id;
      }
    }
    if (best) activeSection.value = best;
  };

  const teardown = () => {
    observers.forEach((o) => o.disconnect());
    observers.length = 0;
    visible.clear();
  };

  const setup = () => {
    teardown();
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }
          recompute();
        },
        {
          // Trigger band hugs the top so the last section can land in it
          rootMargin: "-72px 0px -40% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      );
      observer.observe(el);
      observers.push(observer);
    });
  };

  let unhookPageFinish: (() => void) | undefined;

  onMounted(() => {
    useEventListener(window, "scroll", recompute, { passive: true });
    setup();

    // The header lives in the layout, so it isn't remounted on navigation. The
    // section elements, however, are destroyed and recreated when the page that
    // owns them unmounts and remounts (e.g. home -> changelog -> home). Re-run
    // observer setup after each navigation so we always observe the live nodes.
    // page:finish fires once the destination page's DOM has actually rendered
    // (after Suspense resolves) — a plain route watch + nextTick runs too early.
    const nuxtApp = useNuxtApp();
    unhookPageFinish = nuxtApp.hook("page:finish", () => {
      activeSection.value = null;
      setup();
    });
  });

  onBeforeUnmount(() => {
    teardown();
    unhookPageFinish?.();
  });

  return activeSection;
};
