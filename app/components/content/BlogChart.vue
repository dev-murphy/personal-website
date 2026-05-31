<script setup lang="ts">
import type { BulletLegendItemInterface } from "vue-chrts";

type Row = Record<string, string | number>;

const props = withDefaults(
  defineProps<{
    /** Card title shown above the chart. */
    title?: string;
    /** Smaller line under the title. */
    subtitle?: string;
    /** "area" | "line" | "bar" */
    type?: "area" | "line" | "bar";
    /** The rows to plot. */
    data: Row[];
    /** Field used for the x-axis (defaults to the first non-numeric key). */
    index?: string;
    /** Explicit series definitions. Derived from numeric keys when omitted. */
    categories?: Record<string, BulletLegendItemInterface>;
    /** Chart body height in pixels. */
    height?: number;
    /** Suffix appended to y-axis values, e.g. "ms". */
    unit?: string;
  }>(),
  {
    type: "area",
    height: 260,
    data: () => [],
  },
);

const { isDark } = useTheme();

// A calm, green-led palette that reads on both themes.
const palette = computed(() =>
  isDark.value
    ? ["#4fd47e", "#38bdf8", "#a78bfa", "#fbbf24"]
    : ["#2aad57", "#0284c7", "#7c3aed", "#d97706"],
);

const rows = computed<Row[]>(() => (Array.isArray(props.data) ? props.data : []));

// The x-axis key: prefer an explicit prop, otherwise the first string field.
const indexKey = computed(() => {
  if (props.index) return props.index;
  const first = rows.value[0] ?? {};
  return Object.keys(first).find((k) => typeof first[k] === "string") ?? Object.keys(first)[0] ?? "label";
});

// Build series from numeric columns when none were provided.
const categories = computed<Record<string, BulletLegendItemInterface>>(() => {
  if (props.categories) {
    return Object.fromEntries(
      Object.entries(props.categories).map(([key, value], i) => [
        key,
        { color: palette.value[i % palette.value.length], ...value },
      ]),
    );
  }
  const first = rows.value[0] ?? {};
  const numericKeys = Object.keys(first).filter(
    (k) => k !== indexKey.value && typeof first[k] === "number",
  );
  return Object.fromEntries(
    numericKeys.map((key, i) => [
      key,
      {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        color: palette.value[i % palette.value.length],
      },
    ]),
  );
});

const seriesKeys = computed(() => Object.keys(categories.value));
const multiSeries = computed(() => seriesKeys.value.length > 1);

const xFormatter = (i: number) => String(rows.value[i]?.[indexKey.value] ?? "");
const yFormatter = (value: number) =>
  props.unit ? `${value}${props.unit}` : `${value}`;
</script>

<template>
  <figure
    class="not-prose my-8 overflow-hidden rounded-xl border border-border-100 bg-background-200/40"
  >
    <figcaption
      v-if="title || subtitle"
      class="flex items-start justify-between gap-x-4 border-b border-border-100 px-5 py-4"
    >
      <div>
        <p class="text-sm font-medium text-text-100">{{ title }}</p>
        <p v-if="subtitle" class="mt-0.5 text-xs text-text-300">{{ subtitle }}</p>
      </div>
      <span
        class="font-geist-mono text-[10px] uppercase tracking-[0.2em] text-text-300"
      >
        {{ type }}
      </span>
    </figcaption>

    <div class="px-2 pt-4 pb-2 md:px-4">
      <ClientOnly>
        <AreaChart
          v-if="type === 'area'"
          :data="rows"
          :height="height"
          :categories="categories"
          :curve-type="CurveType.MonotoneX"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :y-num-ticks="4"
          :y-grid-line="true"
          :hide-legend="!multiSeries"
          :legend-position="LegendPosition.TopLeft"
        />
        <LineChart
          v-else-if="type === 'line'"
          :data="rows"
          :height="height"
          :categories="categories"
          :curve-type="CurveType.MonotoneX"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :y-num-ticks="4"
          :y-grid-line="true"
          :hide-legend="!multiSeries"
          :legend-position="LegendPosition.TopLeft"
        />
        <BarChart
          v-else
          :data="rows"
          :height="height"
          :categories="categories"
          :y-axis="seriesKeys"
          :x-formatter="xFormatter"
          :y-formatter="yFormatter"
          :y-num-ticks="4"
          :y-grid-line="true"
          :hide-legend="!multiSeries"
          :legend-position="LegendPosition.TopLeft"
        />

        <template #fallback>
          <div
            class="flex items-center justify-center text-xs text-text-300"
            :style="{ height: `${height}px` }"
          >
            Loading chart…
          </div>
        </template>
      </ClientOnly>
    </div>
  </figure>
</template>
