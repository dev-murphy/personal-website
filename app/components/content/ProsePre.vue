<script setup lang="ts">
const props = defineProps<{
  code?: string;
  language?: string;
  filename?: string;
  highlights?: number[];
  meta?: string;
  class?: string;
  style?: unknown;
}>();

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  if (!props.code) return;
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1600);
  } catch {
    // Clipboard unavailable (insecure context) — fail quietly.
  }
}

const label = computed(() => props.filename || props.language || "code");
</script>

<template>
  <div
    class="not-prose group relative my-6 overflow-hidden rounded-lg border border-border-100 bg-background-200"
  >
    <div
      class="flex items-center justify-between border-b border-border-100 px-4 py-2"
    >
      <span class="font-geist-mono text-[11px] text-text-300">{{ label }}</span>
      <button
        type="button"
        class="flex items-center gap-x-1.5 font-geist-mono text-[11px] text-text-300 transition-colors hover:text-primary"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy"
      >
        <svg
          v-if="!copied"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <svg
          v-else
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {{ copied ? "Copied" : "Copy" }}
      </button>
    </div>

    <pre
      :class="props.class"
      :style="props.style"
      class="overflow-x-auto px-4 py-4 text-[0.85rem] leading-relaxed"
    ><slot /></pre>
  </div>
</template>

<style scoped>
pre {
  font-family: var(--font-geist-mono), monospace;
  background: transparent;
}

pre :deep(code) {
  background: transparent;
  padding: 0;
  color: inherit;
  font-size: inherit;
}
</style>
