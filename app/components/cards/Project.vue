<script lang="ts" setup>
const props = defineProps<{
  projectName: string;
  description: string;
  techStack: string[];
  sourceUrl?: string;
  liveUrl?: string;
  logoUrl?: string | null;
  /** When true, the source isn't public — show a "private" badge, no link. */
  sourcePrivate?: boolean;
  types?: string[];
  creationDate?: string;
  archived?: boolean;
  /** When true, show a "Pinned" badge — the project is featured on the home page. */
  pinned?: boolean;
  /** Active tech filters — matching tools are pulled to the front and highlighted. */
  selectedTech?: string[];
}>();

const creationYear = computed(() => {
  if (!props.creationDate) return null;
  const year = new Date(props.creationDate).getFullYear();
  return Number.isNaN(year) ? null : year;
});

// Keep the tool row to a single line: show a couple of tools and roll the rest
// into a "+N" chip. Active filters are floated to the front and highlighted, and
// the visible count always grows to keep every matched tool on screen.
const MIN_VISIBLE_TECH = 2;

const isSelected = (tech: string) => (props.selectedTech ?? []).includes(tech);

const orderedTech = computed(() => {
  if (!(props.selectedTech ?? []).length) return props.techStack;
  return [
    ...props.techStack.filter(isSelected),
    ...props.techStack.filter((t) => !isSelected(t)),
  ];
});

const visibleCount = computed(() =>
  Math.max(MIN_VISIBLE_TECH, props.techStack.filter(isSelected).length),
);

const visibleTech = computed(() => orderedTech.value.slice(0, visibleCount.value));

const hiddenTech = computed(() => orderedTech.value.slice(visibleCount.value));

const posthog = usePostHog();
</script>

<template>
  <div
    class="group h-full flex flex-col p-6 border border-border-100 rounded-lg bg-background-200/40 hover:border-primary/40 transition-colors"
    :class="{ 'opacity-70 hover:opacity-100': archived }"
  >
    <div class="flex items-start justify-between gap-x-4">
      <div class="flex items-center gap-x-3 min-w-0">
        <img
          v-if="logoUrl"
          :src="logoUrl"
          :alt="`${projectName} logo`"
          class="h-8 w-8 shrink-0 rounded-md border border-border-100 bg-background-100 object-contain"
        />
        <h3 class="text-base md:text-lg text-text-100 font-medium truncate">
          {{ projectName }}
        </h3>
      </div>
      <a
        v-if="sourceUrl && !sourcePrivate"
        :href="sourceUrl"
        target="_blank"
        class="shrink-0"
        aria-label="View source"
        @click="posthog?.capture('project_source_clicked', { project_name: projectName, source_url: sourceUrl })"
      >
        <IconsArrowUpRight
          class="w-4 h-4 text-text-300 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
        />
      </a>
      <span
        v-else-if="sourcePrivate"
        class="shrink-0 inline-flex items-center gap-1 font-geist-mono text-[10px] uppercase tracking-wider text-text-300"
        title="Source not publicly available"
      >
        <svg
          class="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Private
      </span>
      <IconsArrowUpRight v-else class="w-4 h-4 text-text-300 shrink-0" />
    </div>

    <div
      v-if="pinned || (types && types.length) || archived || creationYear"
      class="mt-3 flex flex-wrap items-center gap-2"
    >
      <span
        v-if="pinned"
        class="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-geist-mono text-[10px] uppercase tracking-wider text-primary"
      >
        <svg
          class="w-3 h-3"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M16 3v2l-1 1v5l3 3v2h-5v6h-2v-6H6v-2l3-3V6L8 5V3z"
          />
        </svg>
        Pinned
      </span>
      <span
        v-for="type in types"
        :key="type"
        class="rounded-full bg-primary/10 px-2 py-0.5 font-geist-mono text-[10px] uppercase tracking-wider text-primary"
      >
        {{ type }}
      </span>
      <span
        v-if="archived"
        class="rounded-full border border-amber-500/40 px-2 py-0.5 font-geist-mono text-[10px] uppercase tracking-wider text-amber-500"
      >
        Archived
      </span>
      <span
        v-if="creationYear"
        class="font-geist-mono text-[11px] text-text-300"
      >
        {{ creationYear }}
      </span>
    </div>

    <p class="mt-3 text-sm text-text-200 leading-relaxed line-clamp-2">
      {{ description }}
    </p>

    <div class="mt-auto pt-5 flex items-center justify-between gap-x-3">
      <div
        class="flex flex-wrap items-center gap-x-3 gap-y-1 font-geist-mono text-xs text-text-300"
      >
        <span
          v-for="tech in visibleTech"
          :key="tech"
          :class="isSelected(tech) ? 'font-medium text-primary' : ''"
        >
          {{ tech }}
        </span>
        <span
          v-if="hiddenTech.length"
          :title="hiddenTech.join(', ')"
          class="text-text-300/70"
        >
          +{{ hiddenTech.length }}
        </span>
      </div>

      <a
        v-if="liveUrl"
        :href="liveUrl"
        target="_blank"
        class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        @click="posthog?.capture('project_live_site_clicked', { project_name: projectName, live_url: liveUrl })"
      >
        <span>Live Site</span>
        <IconsArrowUpRight class="w-3 h-3" />
      </a>
    </div>
  </div>
</template>
