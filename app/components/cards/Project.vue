<script lang="ts" setup>
defineProps<{
  projectName: string;
  description: string;
  techStack: string[];
  sourceUrl?: string;
  liveUrl?: string;
}>();
</script>

<template>
  <div
    class="group h-full flex flex-col p-6 border border-border-100 rounded-lg bg-background-200/40 hover:border-primary/40 transition-colors"
  >
    <div class="flex items-start justify-between gap-x-4">
      <h3 class="text-base md:text-lg text-text-100 font-medium">
        {{ projectName }}
      </h3>
      <a v-if="sourceUrl" :href="sourceUrl" target="_blank" class="shrink-0">
        <IconsArrowUpRight
          class="w-4 h-4 text-text-300 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
        />
      </a>
      <IconsArrowUpRight v-else class="w-4 h-4 text-text-300 shrink-0" />
    </div>

    <p class="mt-3 text-sm text-text-200 leading-relaxed line-clamp-2">
      {{ description }}
    </p>

    <div class="mt-auto pt-5 flex items-center justify-between gap-x-3">
      <div
        class="flex flex-wrap gap-x-3 gap-y-1 font-geist-mono text-xs text-text-300"
      >
        <span v-for="(tech, index) in techStack" :key="`tech-${index}`">
          {{ tech }}
        </span>
      </div>

      <a
        v-if="liveUrl"
        :href="liveUrl"
        target="_blank"
        class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
      >
        <span>Live Site</span>
        <IconsArrowUpRight class="w-3 h-3" />
      </a>
    </div>
  </div>
</template>
