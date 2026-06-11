<script lang="ts" setup>
import ProjectCard from "~/components/cards/Project.vue";

const { projects, loading, error, logoUrl, refresh } = useProjects();

const search = ref("");
const selectedTech = ref<string[]>([]);
const selectedTypes = ref<string[]>([]);
// Archived projects stay visible (with their badge); this filter narrows to
// only archived when on.
const archivedOnly = ref(false);

// On small screens the filter sidebar collapses into a toggleable panel.
const filtersOpen = ref(false);

const posthog = usePostHog();

const toggleTech = (value: string) => {
  const isAdding = !selectedTech.value.includes(value);
  selectedTech.value = isAdding
    ? [...selectedTech.value, value]
    : selectedTech.value.filter((v) => v !== value);
  posthog?.capture("project_filter_applied", { filter_type: "tech", filter_value: value, action: isAdding ? "add" : "remove" });
};

const toggleType = (value: string) => {
  const isAdding = !selectedTypes.value.includes(value);
  selectedTypes.value = isAdding
    ? [...selectedTypes.value, value]
    : selectedTypes.value.filter((v) => v !== value);
  posthog?.capture("project_filter_applied", { filter_type: "type", filter_value: value, action: isAdding ? "add" : "remove" });
};

const clearFilters = () => {
  search.value = "";
  selectedTech.value = [];
  selectedTypes.value = [];
  archivedOnly.value = false;
};

const activeFilterCount = computed(
  () =>
    (search.value.trim() ? 1 : 0) +
    selectedTech.value.length +
    selectedTypes.value.length +
    (archivedOnly.value ? 1 : 0),
);

const hasFilters = computed(() => activeFilterCount.value > 0);

// All projects are listed by default — archived ones surface with a badge.
// Facet counts and the grid both derive from this set, so counts always match
// what's actually listed.
const base = computed(() => projects.value);

const archivedCount = computed(
  () => projects.value.filter((p) => p.is_archived).length,
);

const countBy = <T>(
  items: readonly T[],
  getValues: (p: T) => readonly string[],
) => {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const value of getValues(item)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const techCounts = computed(() =>
  countBy(base.value, (p) => p.tech_stack ?? []),
);
const typeCounts = computed(() =>
  countBy(base.value, (p) => p.type ?? []),
);

// Search matches name/description/type/tools. Each facet is OR within itself.
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return base.value.filter((p) => {
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.type ?? []).some((t) => t.toLowerCase().includes(q)) ||
      (p.tech_stack ?? []).some((t) => t.toLowerCase().includes(q));

    const matchesTech =
      selectedTech.value.length === 0 ||
      (p.tech_stack ?? []).some((t) => selectedTech.value.includes(t));

    const matchesType =
      selectedTypes.value.length === 0 ||
      (p.type ?? []).some((t) => selectedTypes.value.includes(t));

    const matchesArchived = !archivedOnly.value || p.is_archived;

    return matchesSearch && matchesTech && matchesType && matchesArchived;
  });
});

useSeoMeta({
  title: "Projects — Murphy Facey",
  description: "A catalog of things I've built, filterable by the tools used.",
});
</script>

<template>
  <div class="w-full px-4">
    <div class="w-full max-w-310 mx-auto pt-28 pb-24 md:pt-32 md:pb-28">
      <!-- Header -->
      <header class="mb-12">
        <div class="flex items-center gap-x-3">
          <span class="h-px w-6 md:w-10 bg-primary" />
          <span
            class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
          >
            // Things I've built
          </span>
        </div>
        <h1
          class="mt-4 font-syne text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-text-100"
        >
          Projects
        </h1>
        <p
          class="mt-4 max-w-xl text-sm md:text-base text-text-200 leading-relaxed"
        >
          A catalog of things I've built. Filter by type or the tools used, or
          search by name.
        </p>
      </header>

      <div class="flex flex-col gap-10 md:flex-row md:gap-12">
        <!-- Sidebar -->
        <aside class="md:w-64 md:shrink-0">
          <!-- Mobile filter toggle -->
          <button
            type="button"
            class="flex w-full items-center justify-between gap-x-3 rounded-md border border-border-100 bg-background-200/40 px-4 py-2.5 font-geist-mono text-[11px] uppercase tracking-[0.25em] text-text-200 transition-colors hover:border-primary/30 hover:text-text-100 md:hidden"
            :aria-expanded="filtersOpen"
            @click="filtersOpen = !filtersOpen"
          >
            <span class="flex items-center gap-x-2">
              Filters
              <span
                v-if="activeFilterCount"
                class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/15 px-1 text-primary"
              >
                {{ activeFilterCount }}
              </span>
            </span>
            <svg
              class="h-4 w-4 shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': filtersOpen }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <div
            class="mt-4 flex-col gap-6 md:mt-0 md:sticky md:top-24 md:flex"
            :class="filtersOpen ? 'flex' : 'hidden'"
          >
            <!-- Search -->
            <div class="relative">
              <IconsSearch
                class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-300"
              />
              <input
                v-model="search"
                type="search"
                placeholder="Search projects…"
                class="w-full rounded-md border border-border-100 bg-background-200/40 py-2 pl-9 pr-3 text-sm text-text-100 placeholder:text-text-300 focus:border-primary/50 focus:outline-none"
              />
            </div>

            <!-- Type filter -->
            <div v-if="typeCounts.length">
              <div class="mb-3 flex items-center justify-between">
                <span
                  class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-text-300"
                >
                  // Type
                </span>
              </div>
              <ul class="flex flex-wrap gap-2 md:flex-col md:gap-1.5">
                <li v-for="type in typeCounts" :key="type.name">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between gap-x-3 rounded-md border px-3 py-1.5 font-geist-mono text-xs transition-colors"
                    :class="
                      selectedTypes.includes(type.name)
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border-100 bg-background-200/40 text-text-200 hover:border-primary/30 hover:text-text-100'
                    "
                    @click="toggleType(type.name)"
                  >
                    <span class="truncate">{{ type.name }}</span>
                    <span
                      class="shrink-0 tabular-nums"
                      :class="
                        selectedTypes.includes(type.name)
                          ? 'text-primary'
                          : 'text-text-300'
                      "
                    >
                      {{ type.count }}
                    </span>
                  </button>
                </li>
              </ul>
            </div>

            <!-- Tech filter -->
            <div>
              <div class="mb-3 flex items-center justify-between">
                <span
                  class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-text-300"
                >
                  // Tools
                </span>
                <button
                  v-if="hasFilters"
                  type="button"
                  class="font-geist-mono text-[11px] text-text-300 underline-offset-4 hover:text-text-100 hover:underline"
                  @click="clearFilters"
                >
                  Clear
                </button>
              </div>

              <ul
                v-if="techCounts.length"
                class="flex flex-wrap gap-2 md:flex-col md:gap-1.5"
              >
                <li v-for="tech in techCounts" :key="tech.name">
                  <button
                    type="button"
                    class="flex w-full items-center justify-between gap-x-3 rounded-md border px-3 py-1.5 font-geist-mono text-xs transition-colors"
                    :class="
                      selectedTech.includes(tech.name)
                        ? 'border-primary/50 bg-primary/10 text-primary'
                        : 'border-border-100 bg-background-200/40 text-text-200 hover:border-primary/30 hover:text-text-100'
                    "
                    @click="toggleTech(tech.name)"
                  >
                    <span class="truncate">{{ tech.name }}</span>
                    <span
                      class="shrink-0 tabular-nums"
                      :class="
                        selectedTech.includes(tech.name)
                          ? 'text-primary'
                          : 'text-text-300'
                      "
                    >
                      {{ tech.count }}
                    </span>
                  </button>
                </li>
              </ul>
              <p v-else class="font-geist-mono text-xs text-text-300">
                No tools yet.
              </p>
            </div>

            <!-- Status filter -->
            <div v-if="archivedCount" class="border-t border-border-100 pt-5">
              <div class="mb-3 flex items-center justify-between">
                <span
                  class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-text-300"
                >
                  // Status
                </span>
              </div>
              <button
                type="button"
                class="flex w-full items-center justify-between gap-x-3 rounded-md border px-3 py-1.5 font-geist-mono text-xs transition-colors"
                :class="
                  archivedOnly
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-500'
                    : 'border-border-100 bg-background-200/40 text-text-200 hover:border-amber-500/30 hover:text-text-100'
                "
                :aria-pressed="archivedOnly"
                @click="archivedOnly = !archivedOnly"
              >
                <span class="truncate">Archived</span>
                <span
                  class="shrink-0 tabular-nums"
                  :class="archivedOnly ? 'text-amber-500' : 'text-text-300'"
                >
                  {{ archivedCount }}
                </span>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main content -->
        <div class="min-w-0 flex-1">
          <!-- Loading -->
          <div v-if="loading" class="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div
              v-for="i in 4"
              :key="i"
              class="h-40 rounded-lg border border-border-100 bg-background-200/40 animate-pulse"
            />
          </div>

          <!-- Error -->
          <div
            v-else-if="error"
            class="flex items-center gap-x-3 rounded-lg border border-border-100 bg-background-200/40 p-4 text-sm text-text-200"
          >
            <p>
              Failed to load projects.
              <button
                class="font-medium text-primary underline-offset-4 hover:underline"
                @click="refresh()"
              >
                Try again
              </button>
            </p>
          </div>

          <!-- Empty -->
          <p
            v-else-if="filtered.length === 0"
            class="font-geist-mono text-sm text-text-300"
          >
            {{
              hasFilters
                ? "No projects match these filters."
                : "No projects yet."
            }}
          </p>

          <!-- Grid -->
          <template v-else>
            <p
              class="mb-5 font-geist-mono text-[11px] uppercase tracking-[0.25em] text-text-300"
            >
              {{ filtered.length }}
              {{ filtered.length === 1 ? "project" : "projects" }}
            </p>
            <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ProjectCard
                v-for="project in filtered"
                :key="project.id"
                :project-name="project.name"
                :description="project.description"
                :tech-stack="[...(project.tech_stack ?? [])]"
                :source-url="project.source_url"
                :live-url="project.live_url"
                :logo-url="logoUrl(project)"
                :source-private="project.source_private"
                :types="[...(project.type ?? [])]"
                :creation-date="project.creation_date"
                :archived="project.is_archived"
                :pinned="project.is_pinned"
                :selected-tech="selectedTech"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
