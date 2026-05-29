<script lang="ts" setup>
withDefaults(
  defineProps<{ delay?: number }>(),
  { delay: 0 },
);

const target = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
      isVisible.value = true;
      stop();
    }
  },
  { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
);
</script>

<template>
  <div
    ref="target"
    :style="{ transitionDelay: `${delay}ms` }"
    :class="[
      'transition-all duration-700 ease-out will-change-[opacity,transform]',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
    ]"
  >
    <slot />
  </div>
</template>
