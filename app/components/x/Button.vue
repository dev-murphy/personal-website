<script lang="ts" setup>
withDefaults(
  defineProps<{
    size?: "compact" | "expand";
    variant?: "primary" | "ghost";
    as?: "button" | "a";
    href?: string;
    target?: string;
  }>(),
  {
    size: "compact",
    variant: "primary",
    as: "button",
  },
);
defineEmits<{ (e: "trigger"): void }>();
</script>

<template>
  <component
    :is="as"
    :href="as === 'a' ? href : undefined"
    :target="as === 'a' ? target : undefined"
    :class="[
      'inline-flex items-center gap-x-2 border rounded-md cursor-pointer font-geist-mono text-sm transition-colors',
      size === 'compact' ? 'py-2 px-4' : 'py-3 px-6',
      {
        'bg-primary border-primary text-background-100 hover:bg-primary/90':
          variant === 'primary',
        'border-border-100 text-text-200 hover:text-text-100 hover:border-text-200':
          variant === 'ghost',
      },
    ]"
    @click="$emit('trigger')"
  >
    <slot />
  </component>
</template>
