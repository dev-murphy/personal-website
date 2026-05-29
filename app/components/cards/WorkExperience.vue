<script lang="ts" setup>
defineProps<{
  tenure: {
    start: string;
    end: string;
  };
  position: string;
  company: string;
  companyUrl?: string;
  description: string;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-y-2 gap-x-8 py-6 border-b border-border-100"
  >
    <p class="font-geist-mono text-xs text-text-300 pt-1">
      {{ tenure.start }} — {{ tenure.end }}
    </p>

    <div>
      <h3 class="text-base md:text-lg text-text-100">
        {{ position }}
        <span class="text-text-300">@</span>
        <a
          v-if="companyUrl"
          :href="companyUrl"
          target="_blank"
          class="text-primary hover:underline underline-offset-4"
        >
          {{ company }}
        </a>
        <span v-else class="text-primary">{{ company }}</span>
      </h3>
      <p class="mt-2 max-w-2xl text-sm text-text-200 leading-relaxed">
        {{ description }}
      </p>
    </div>
  </div>
</template>
