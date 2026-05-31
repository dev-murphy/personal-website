<script setup lang="ts">
const props = defineProps<{ slug: string }>();

const { count, liked, loading, error, toggle } = useLikes(props.slug);
</script>

<template>
  <div class="inline-flex flex-col items-start gap-y-1.5">
    <button
      type="button"
      :disabled="loading"
      :aria-pressed="liked"
      aria-label="Like this post"
      class="group inline-flex items-center gap-x-2 rounded-full border px-4 py-2 font-geist-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      :class="
        liked
          ? 'border-primary/40 bg-primary/10 text-primary'
          : 'border-border-100 text-text-300 hover:border-text-200 hover:text-text-100'
      "
      @click="toggle"
    >
      <svg
        class="h-4 w-4 transition-transform group-active:scale-90"
        viewBox="0 0 24 24"
        :fill="liked ? 'currentColor' : 'none'"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
        />
      </svg>
      <span class="tabular-nums">{{ count }}</span>
    </button>
    <p
      v-if="error"
      role="alert"
      class="font-geist-mono text-xs text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>
