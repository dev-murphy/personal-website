<script setup lang="ts">
import type { ReactionType } from "~/types";

const props = defineProps<{ slug: string }>();

const { counts, toggle, hasReacted, loading, error, REACTION_EMOJIS } =
  useReactions(props.slug);

const types = Object.keys(REACTION_EMOJIS) as ReactionType[];

const label = (type: ReactionType) => type.replace(/_/g, " ");
</script>

<template>
  <div class="flex flex-col gap-y-1.5">
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="type in types"
        :key="type"
        type="button"
        :disabled="loading[type]"
        :aria-pressed="hasReacted(type)"
        :aria-label="`React with ${label(type)}`"
        :title="label(type)"
        class="inline-flex items-center gap-x-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        :class="
          hasReacted(type)
            ? 'border-primary/40 bg-primary/10'
            : 'border-border-100 hover:border-text-200'
        "
        @click="toggle(type)"
      >
        <span class="text-base leading-none">{{ REACTION_EMOJIS[type] }}</span>
        <span
          v-if="counts[type]"
          class="font-geist-mono text-xs tabular-nums"
          :class="hasReacted(type) ? 'text-primary' : 'text-text-300'"
        >
          {{ counts[type] }}
        </span>
      </button>
    </div>
    <p
      v-if="error"
      role="alert"
      class="font-geist-mono text-xs text-red-600 dark:text-red-400"
    >
      {{ error }}
    </p>
  </div>
</template>
