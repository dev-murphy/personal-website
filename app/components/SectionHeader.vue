<script lang="ts" setup>
defineProps<{
  number: string;
  kicker: string;
  title: string;
  meta?: string;
}>();
</script>

<template>
  <div
    class="sticky top-14 z-20 -mx-4 px-4 bg-background-100/95 backdrop-blur-md border-b border-border-100 py-5 md:py-7"
  >
    <div class="flex items-center justify-between gap-x-4">
      <div class="flex items-center gap-x-3">
        <span class="h-px w-6 md:w-10 bg-primary"></span>
        <span
          class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
        >
          // #{{ number }} — {{ kicker }}
        </span>
      </div>
      <span
        v-if="meta"
        class="font-geist-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-text-300"
      >
        {{ meta }}
      </span>
    </div>
    <h2
      class="mt-3 font-syne text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-text-100"
    >
      {{ title }}
    </h2>
  </div>
</template>
