<script setup>
const route = useRoute();
const posthog = usePostHog();

const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection("blog").path(route.path).first(),
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

// Two most recent posts that aren't the one we're reading — "keep reading".
const { data: related } = await useAsyncData(
  `blog-related-${route.path}`,
  () =>
    queryCollection("blog")
      .where("path", "<>", route.path)
      .order("date", "DESC")
      .limit(2)
      .all(),
);

// Flatten the generated table of contents to the headings we surface (h2/h3).
const tocLinks = computed(() => {
  const links = post.value?.body?.toc?.links ?? [];
  return links.flatMap((link) => [
    link,
    ...(link.children ?? []).map((child) => ({ ...child, depth: 3 })),
  ]);
});

const activeHeading = useActiveSection(tocLinks.value.map((l) => l.id));

function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

useSeoMeta({
  title: () => `${post.value?.title} — Murphy Facey`,
  description: () => post.value?.description,
});

onMounted(() => {
  posthog?.capture("blog_post_viewed", {
    post_slug: post.value?.path,
    post_title: post.value?.title,
    post_category: post.value?.category,
  });
});
</script>

<template>
  <div class="w-full px-4">
    <article
      v-if="post"
      class="w-full max-w-4xl mx-auto pt-28 pb-24 md:pt-32 md:pb-28"
    >
      <!-- Back link -->
      <NuxtLink
        to="/blog"
        class="group inline-flex items-center gap-x-2 font-geist-mono text-[11px] uppercase tracking-[0.25em] text-text-300 hover:text-primary transition-colors"
      >
        <IconsArrowLeft
          class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
        />
        Back to blog
      </NuxtLink>

      <!-- Header -->
      <header class="mt-8">
        <!-- Meta row -->
        <div
          class="flex flex-wrap items-center gap-x-4 gap-y-2 font-geist-mono text-xs text-text-300"
        >
          <span
            v-if="post.category"
            class="inline-flex items-center gap-x-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-primary"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {{ post.category }}
          </span>
          <span class="inline-flex items-center gap-x-1.5">
            <IconsCalendar class="w-3.5 h-3.5" />
            {{ formatDate(post.date) }}
          </span>
          <span v-if="post.duration" class="inline-flex items-center gap-x-1.5">
            <IconsClock class="w-3.5 h-3.5" />
            {{ post.duration }}
          </span>
          <span
            v-if="post.lastEdited && post.lastEdited !== post.date"
            class="inline-flex items-center gap-x-1.5 text-text-300"
          >
            <IconsCalendar class="w-3.5 h-3.5" />
            Updated {{ formatDate(post.lastEdited) }}
          </span>
        </div>

        <h1
          class="mt-5 font-syne text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-100 leading-[1.1]"
        >
          {{ post.title }}
        </h1>

        <p
          v-if="post.description"
          class="mt-5 max-w-2xl text-base md:text-lg text-text-200 leading-relaxed"
        >
          {{ post.description }}
        </p>

        <ul
          v-if="post.tags?.length"
          class="mt-6 flex flex-wrap gap-2 font-geist-mono text-[11px]"
        >
          <li
            v-for="tag in post.tags"
            :key="tag"
            class="inline-flex items-center gap-x-1.5 rounded-md border border-border-100 bg-background-200/60 px-2.5 py-0.5 text-text-300"
          >
            <span
              class="h-1.5 w-1.5 rounded-full bg-primary/70"
              aria-hidden="true"
            />
            {{ tag }}
          </li>
        </ul>
      </header>

      <div class="mt-8 h-px w-full bg-border-100" />

      <!-- Body + table of contents -->
      <div
        class="mt-10 lg:grid lg:grid-cols-[1fr_13rem] lg:gap-x-12 lg:items-start"
      >
        <div class="prose min-w-0">
          <ContentRenderer :value="post" />
        </div>

        <aside
          v-if="tocLinks.length"
          class="hidden lg:block sticky top-24 self-start"
        >
          <div class="flex items-center gap-x-3">
            <span class="h-px w-6 bg-primary" />
            <span
              class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
            >
              // On this page
            </span>
          </div>
          <nav class="mt-4 flex flex-col gap-y-2 border-l border-border-100">
            <a
              v-for="link in tocLinks"
              :key="link.id"
              :href="`#${link.id}`"
              :class="[
                '-ml-px border-l-2 pl-4 text-sm leading-snug transition-colors',
                link.depth === 3 ? 'pl-7' : '',
                activeHeading === link.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-300 hover:text-text-100',
              ]"
            >
              {{ link.text }}
            </a>
          </nav>
        </aside>
      </div>

      <!-- Engagement: likes, reactions, comments (client-only — counts and
           session state are resolved in the browser) -->
      <ClientOnly>
        <section class="mt-16 pt-10 border-t border-border-100">
          <div class="flex flex-wrap items-center gap-3">
            <BlogLikes :slug="post.path" />
            <BlogReactions :slug="post.path" />
          </div>
        </section>

        <div class="mt-16">
          <BlogComments :slug="post.path" />
        </div>
      </ClientOnly>

      <!-- Keep reading -->
      <section v-if="related?.length" class="mt-20 pt-10 border-t border-border-100">
        <div class="flex items-center gap-x-3">
          <span class="h-px w-6 md:w-10 bg-primary" />
          <span
            class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
          >
            // Related
          </span>
        </div>
        <h2
          class="mt-3 font-syne text-2xl md:text-3xl font-extrabold tracking-tight text-text-100"
        >
          Keep reading
        </h2>

        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NuxtLink
            v-for="item in related"
            :key="item.path"
            :to="item.path"
            class="group flex flex-col rounded-lg border border-border-100 bg-background-200/40 p-5 transition-colors hover:border-primary/40"
            @click="posthog?.capture('related_post_clicked', { from_slug: post?.path, to_slug: item.path, to_title: item.title })"
          >
            <span
              v-if="item.category"
              class="font-geist-mono text-[10px] uppercase tracking-[0.2em] text-primary"
            >
              {{ item.category }}
            </span>
            <div class="mt-2 flex items-start justify-between gap-x-3">
              <h3
                class="text-base font-medium text-text-100 transition-colors group-hover:text-primary"
              >
                {{ item.title }}
              </h3>
              <IconsArrowUpRight
                class="mt-0.5 w-3.5 h-3.5 shrink-0 text-text-300 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
            <p
              v-if="item.description"
              class="mt-2 text-sm text-text-200 leading-relaxed line-clamp-2"
            >
              {{ item.description }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
.prose {
  color: var(--color-text-200);
  font-size: 1rem;
  line-height: 1.75;
}

.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  color: var(--color-text-100);
  font-family: var(--font-syne), sans-serif;
  font-weight: 700;
  letter-spacing: -0.01em;
  scroll-margin-top: 6rem;
}

.prose :deep(h1) {
  font-size: 1.875rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}

.prose :deep(h2) {
  font-size: 1.5rem;
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.prose :deep(p),
.prose :deep(ul),
.prose :deep(ol),
.prose :deep(blockquote) {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.prose :deep(a:not(.not-prose a)) {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Auto-generated heading anchors inherit the heading colour, not link styling.
   `!important` beats the broader link rule above without specificity games. */
.prose :deep(h1 > a),
.prose :deep(h2 > a),
.prose :deep(h3 > a),
.prose :deep(h4 > a) {
  color: inherit !important;
  text-decoration: none !important;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.5rem;
}

.prose :deep(ul) {
  list-style: disc;
}

.prose :deep(ol) {
  list-style: decimal;
}

.prose :deep(li) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose :deep(li::marker) {
  color: var(--color-text-300);
}

.prose :deep(strong) {
  color: var(--color-text-100);
  font-weight: 600;
}

.prose :deep(blockquote) {
  border-left: 2px solid var(--color-primary);
  padding-left: 1rem;
  color: var(--color-text-300);
  font-style: italic;
}

.prose :deep(hr) {
  border: 0;
  border-top: 1px solid var(--color-border-100);
  margin: 2.5rem 0;
}

.prose :deep(img) {
  border-radius: 0.5rem;
  border: 1px solid var(--color-border-100);
  margin: 1.5rem 0;
}

/* Tables */
.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: 0.9rem;
}

.prose :deep(th),
.prose :deep(td) {
  border: 1px solid var(--color-border-100);
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.prose :deep(th) {
  color: var(--color-text-100);
  font-weight: 600;
  background-color: var(--color-background-200);
}

/* Inline code */
.prose :deep(:not(pre) > code) {
  font-family: var(--font-geist-mono), monospace;
  font-size: 0.85em;
  color: var(--color-primary);
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
}
</style>
