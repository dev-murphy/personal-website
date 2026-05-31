<script setup>
const { data: posts } = await useAsyncData("blog-posts", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

const postCount = computed(() => posts.value?.length ?? 0);

useSeoMeta({
  title: "Blog — Murphy Facey",
  description:
    "Notes on frontend engineering, type-safety, and shipping production interfaces.",
});
</script>

<template>
  <div class="w-full px-4">
    <div class="w-full max-w-4xl mx-auto pt-28 pb-24 md:pt-32 md:pb-28">
      <!-- Header -->
      <header class="mb-12">
        <div class="flex items-center gap-x-3">
          <span class="h-px w-6 md:w-10 bg-primary" />
          <span
            class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
          >
            // Writing
          </span>
        </div>

        <div class="mt-4 flex items-end justify-between gap-x-6">
          <h1
            class="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-100"
          >
            Blog
          </h1>
          <span
            class="shrink-0 pb-2 font-geist-mono text-xs text-text-300"
          >
            {{ postCount }} {{ postCount === 1 ? "post" : "posts" }}
          </span>
        </div>

        <p class="mt-4 max-w-xl text-sm md:text-base text-text-200 leading-relaxed">
          Notes on engineering, design, and the small choices that compound.
        </p>
      </header>

      <div class="h-px w-full bg-border-100" />

      <!-- Empty state -->
      <div
        v-if="!posts || posts.length === 0"
        class="mt-8 flex items-center gap-x-3 p-4 rounded-lg border border-border-100 bg-background-200/40 text-sm text-text-200"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-text-300" aria-hidden="true" />
        Nothing published yet — check back soon.
      </div>

      <!-- Post list -->
      <div v-else class="flex flex-col">
        <FadeInSection
          v-for="(post, index) in posts"
          :key="post.path"
          :delay="index * 80"
        >
          <NuxtLink
            :to="post.path"
            class="group grid grid-cols-1 gap-x-8 gap-y-3 border-b border-border-100 py-8 md:grid-cols-[7.5rem_1fr_auto]"
          >
            <!-- Date -->
            <div
              class="flex items-center gap-x-2 font-geist-mono text-xs text-text-300 md:pt-1"
            >
              <IconsCalendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(post.date) }}</span>
            </div>

            <!-- Body -->
            <div class="min-w-0">
              <span
                v-if="post.category"
                class="font-geist-mono text-[11px] uppercase tracking-[0.2em] text-primary"
              >
                {{ post.category }}
              </span>

              <h2
                class="mt-2 text-xl md:text-2xl font-medium tracking-tight text-text-100 transition-colors group-hover:text-primary"
              >
                {{ post.title }}
              </h2>

              <p
                v-if="post.description"
                class="mt-2 max-w-xl text-sm text-text-200 leading-relaxed line-clamp-2"
              >
                {{ post.description }}
              </p>

              <ul
                v-if="post.tags?.length"
                class="mt-4 flex flex-wrap gap-2 font-geist-mono text-[11px]"
              >
                <li
                  v-for="tag in post.tags"
                  :key="tag"
                  class="rounded-md border border-border-100 bg-background-200/60 px-2 py-0.5 text-text-300"
                >
                  #{{ tag }}
                </li>
              </ul>
            </div>

            <!-- Meta -->
            <div
              class="flex items-center justify-between md:flex-col md:items-end md:justify-start md:gap-y-3 md:pt-1"
            >
              <span
                v-if="post.duration"
                class="flex items-center gap-x-1.5 font-geist-mono text-xs text-text-300"
              >
                <IconsClock class="w-3.5 h-3.5" />
                {{ post.duration }}
              </span>
              <IconsArrowUpRight
                class="w-4 h-4 text-text-300 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
          </NuxtLink>
        </FadeInSection>
      </div>
    </div>
  </div>
</template>
