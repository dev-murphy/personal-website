<script setup lang="ts">
withDefaults(
  defineProps<{
    /** "info" | "tip" | "warning" */
    type?: "info" | "tip" | "warning";
  }>(),
  { type: "info" },
);
</script>

<template>
  <aside
    class="not-prose my-6 flex gap-x-3 rounded-lg border border-border-100 border-l-2 border-l-primary bg-primary/5 px-4 py-3"
  >
    <span
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
      aria-hidden="true"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </span>
    <div class="text-sm leading-relaxed text-text-200 [&>p]:m-0 [&>p+p]:mt-2">
      <slot />
    </div>
  </aside>
</template>
