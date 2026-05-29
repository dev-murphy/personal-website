<script lang="ts" setup>
import type { TechItem } from "~/components/logos";

const props = withDefaults(
  defineProps<{
    techStack: TechItem[];
    category: string;
    speed?: number;
    delay?: number;
    reverse?: boolean;
    pauseOnHover?: boolean;
    gap?: number;
  }>(),
  {
    speed: 60,
    delay: 0,
    reverse: false,
    pauseOnHover: true,
    gap: 0,
  },
);

const reducedMotion = usePreferredReducedMotion();
const isReduced = computed(() => reducedMotion.value === "reduce");

const baseItems = props.techStack.map((item) => ({
  logo: markRaw(item.logo),
  name: item.name,
}));

const SETS = computed(() => (isReduced.value ? 1 : 3));
const marqueeItems = computed(() =>
  Array.from({ length: SETS.value }, () => baseItems).flat(),
);

const trackRef = useTemplateRef("trackRef");
const isPaused = ref(false);

const setPaused = (pause: boolean) => {
  isPaused.value = pause;
};

let observer: ResizeObserver | null = null;

const recalc = () => {
  const el = trackRef.value;
  if (!el) return;
  const fullWidth = el.scrollWidth;
  const setWidth = fullWidth / SETS.value;
  el.style.setProperty("--marquee-duration", `${setWidth / props.speed}s`);
};

onMounted(() => {
  const el = trackRef.value;
  if (!el) return;
  nextTick(recalc);
  observer = new ResizeObserver(recalc);
  observer.observe(el);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

watch([() => props.speed, SETS], () => nextTick(recalc));
</script>

<template>
  <div
    aria-label="Logo marquee"
    class="w-full relative overflow-hidden"
    @mouseenter="pauseOnHover && setPaused(true)"
    @mouseleave="pauseOnHover && setPaused(false)"
  >
    <p
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/15 text-xl md:text-2xl font-syne font-extrabold uppercase tracking-[0.5rem] pointer-events-none select-none"
    >
      {{ category }}
    </p>

    <!-- edge fades -->
    <div
      class="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-linear-to-r from-background-100 to-transparent"
    ></div>
    <div
      class="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-linear-to-l from-background-100 to-transparent"
    ></div>

    <div
      ref="trackRef"
      :style="{
        gap: gap ? `${gap}px` : undefined,
        animationDelay: delay ? `${delay}ms` : undefined,
        animationDirection: reverse ? 'reverse' : undefined,
        animationPlayState:
          isReduced || isPaused ? 'paused' : 'running',
      }"
      class="flex w-max marquee-anim"
    >
      <AppMarqueeItem
        v-for="(item, index) in marqueeItems"
        :key="index"
        :logo="item.logo"
        :name="item.name"
        icon-padding="12px 28px"
      />
    </div>
  </div>
</template>

<style scoped>
.marquee-anim {
  animation: _marquee-scroll var(--marquee-duration, 30s) linear infinite;
}

.marquee-anim > :deep(*) {
  flex-shrink: 0;
}

@keyframes _marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% / v-bind("SETS")));
  }
}
</style>
