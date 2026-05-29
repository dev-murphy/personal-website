<template>
  <div class="w-full px-4">
    <div class="w-full max-w-3xl mx-auto pt-28 pb-24 md:pt-32 md:pb-28">
      <!-- Header -->
      <header class="mb-14">
        <div class="flex items-center gap-x-3">
          <span class="h-px w-6 md:w-10 bg-primary" />
          <span
            class="font-geist-mono text-[11px] uppercase tracking-[0.25em] text-primary"
          >
            // What changes happened
          </span>
        </div>
        <h1
          class="mt-4 font-syne text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-text-100"
        >
          Changelog
        </h1>
        <p class="mt-4 max-w-xl text-sm md:text-base text-text-200 leading-relaxed">
          A complete history of releases for
          <a
            href="https://github.com/dev-murphy/personal-website"
            target="_blank"
            class="text-primary hover:underline underline-offset-4"
          >dev-murphy/personal-website</a>.
        </p>
      </header>

      <!-- Loading state -->
      <div v-if="pending" class="relative">
        <span
          class="absolute left-2 top-2 bottom-0 w-px bg-border-100"
          aria-hidden="true"
        />
        <div v-for="i in 3" :key="i" class="relative pl-10 pb-12 space-y-3">
          <span
            class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-background-100 bg-background-200 animate-pulse"
          />
          <div class="h-4 w-28 rounded bg-background-200 animate-pulse" />
          <div class="h-3 w-1/2 rounded bg-background-200 animate-pulse" />
          <div class="h-3 w-3/4 rounded bg-background-200 animate-pulse" />
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="flex items-center gap-x-3 p-4 rounded-lg border border-border-100 bg-background-200/40 text-sm text-text-200"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0 text-text-300"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>
          Failed to load changelog.
          <button
            class="font-medium text-primary hover:underline underline-offset-4 cursor-pointer"
            @click="refresh()"
          >
            Try again
          </button>
        </p>
      </div>

      <!-- Changelog timeline -->
      <div v-else class="relative">
        <span
          class="absolute left-2 top-2 bottom-0 w-px bg-border-100"
          aria-hidden="true"
        />

        <div
          v-for="release in releases"
          :key="release.version"
          class="relative pl-10 pb-12 last:pb-0"
        >
          <span
            class="absolute left-0 top-1.5 rounded-full border-2 border-background-100"
            :class="[
              release.type === 'patch' ? 'bg-text-300' : 'bg-primary',
              release.type === 'major' ? 'w-4 h-4' : 'w-3.5 h-3.5',
            ]"
          />

          <div class="flex items-center flex-wrap gap-x-3 gap-y-2">
            <a
              v-if="release.compareUrl"
              :href="release.compareUrl"
              target="_blank"
              class="font-syne text-lg font-bold text-text-100 hover:text-primary transition-colors"
            >{{ release.version }}</a>
            <span
              v-else
              class="font-syne text-lg font-bold text-text-100"
            >{{ release.version }}</span>
            <span class="font-geist-mono text-xs text-text-300">{{ release.date }}</span>
            <span
              v-if="release.badge"
              class="font-geist-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
            >
              {{ release.badge }}
            </span>
          </div>

          <div
            v-for="group in release.groups"
            :key="group.category"
            class="mt-5"
          >
            <div
              class="flex items-center gap-x-2 font-geist-mono text-[11px] uppercase tracking-[0.2em]"
              :class="categoryColor(group.type)"
            >
              <svg v-if="group.type === 'bug'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 9c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V9z"/><path d="M5 9h4M15 9h4M5 15h4M15 15h4M12 3v4M8 3l1.5 2M16 3l-1.5 2"/></svg>
              <svg v-else-if="group.type === 'feature'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <svg v-else-if="group.type === 'docs'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <svg v-else-if="group.type === 'cicd'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              <svg v-else-if="group.type === 'refactor'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              {{ group.category }}
            </div>
            <ul class="mt-2">
              <li
                v-for="entry in group.entries"
                :key="entry.hash"
                class="flex items-start gap-x-3 py-2 border-b border-border-100/60 last:border-0 text-sm leading-relaxed"
              >
                <span
                  class="mt-2 w-1 h-1 rounded-full bg-text-300 shrink-0"
                  aria-hidden="true"
                />
                <span class="flex-1 text-text-200">{{ entry.message }}</span>
                <a
                  :href="entry.url"
                  target="_blank"
                  class="font-geist-mono text-xs text-text-300 hover:text-primary transition-colors shrink-0"
                >{{ entry.hash }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

// ---------------------------------------------------------------------------
// Per-category accent colors and type mappings
// ---------------------------------------------------------------------------

const CATEGORY_MAP = {
  'bug fixes':      { label: 'Bug fixes',      type: 'bug' },
  'bug fix':        { label: 'Bug fixes',      type: 'bug' },
  'features':       { label: 'Features',       type: 'feature' },
  'feature':        { label: 'Features',       type: 'feature' },
  'documentation':  { label: 'Documentation',  type: 'docs' },
  'ci/cd':          { label: 'CI/CD',          type: 'cicd' },
  'ci':             { label: 'CI/CD',          type: 'cicd' },
  'miscellaneous':  { label: 'Miscellaneous',  type: 'misc' },
  'misc':           { label: 'Miscellaneous',  type: 'misc' },
  'code refactors': { label: 'Code refactors', type: 'refactor' },
  'refactor':       { label: 'Code refactors', type: 'refactor' },
}

const CATEGORY_COLORS = {
  bug:      'text-rose-500',
  feature:  'text-primary',
  docs:     'text-sky-500',
  cicd:     'text-violet-500',
  refactor: 'text-amber-500',
  misc:     'text-text-300',
}

function categoryColor(type) {
  return CATEGORY_COLORS[type] ?? 'text-text-300'
}

function resolveCategory(raw) {
  const key = raw.replace(/^[^\w]+/, '').trim().toLowerCase()
  for (const [pattern, meta] of Object.entries(CATEGORY_MAP)) {
    if (key.includes(pattern)) return meta
  }
  return { label: raw.replace(/^[^\w]+/, '').trim(), type: 'misc' }
}

function resolveVersionType(version) {
  const parts = version.replace(/^v/, '').split('.').map(Number)
  if (parts[1] === 0 && parts[2] === 0) return 'major'
  if (parts[2] === 0) return 'minor'
  return 'patch'
}

// ---------------------------------------------------------------------------
// Extract plain text from a marked inline token array
// ---------------------------------------------------------------------------
function tokensToText(tokens = []) {
  return tokens
    .map(t => {
      if (t.type === 'text' || t.type === 'codespan') return t.text ?? t.raw
      if (t.type === 'link') return tokensToText(t.tokens)
      if (t.tokens) return tokensToText(t.tokens)
      return t.raw ?? ''
    })
    .join('')
}

// ---------------------------------------------------------------------------
// Markdown parser — uses marked lexer to walk tokens
// ---------------------------------------------------------------------------
function parseChangelog(markdown) {
  const tokens = marked.lexer(markdown)
  const releases = []
  let current = null
  let currentGroup = null

  for (const token of tokens) {
    // ── Release heading: ## [1.1.3](url) (YYYY-MM-DD) ──────────────────────
    if (token.type === 'heading' && token.depth === 2) {
      const text = token.text // raw heading text (markdown links kept)

      const versionMatch = text.match(/\[?([\d]+\.[\d]+\.[\d]+)\]?/)
      if (!versionMatch) continue

      const rawVersion = versionMatch[1]
      const version = `v${rawVersion}`
      const compareUrlMatch = text.match(/\]\((https?:\/\/[^)]+)\)/)
      const compareUrl = compareUrlMatch ? compareUrlMatch[1] : null
      const dateMatch = text.match(/\((\d{4}-\d{2}-\d{2})\)/)
      let date = ''
      if (dateMatch) {
        date = new Intl.DateTimeFormat('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
        }).format(new Date(dateMatch[1] + 'T00:00:00'))
      }

      const type = resolveVersionType(version)
      const badge = type === 'minor' ? 'minor' : null

      current = { version, date, type, compareUrl, badge, groups: [] }
      currentGroup = null
      releases.push(current)
      continue
    }

    if (!current) continue

    // ── Category heading: ### 🐛 Bug Fixes ─────────────────────────────────
    if (token.type === 'heading' && token.depth >= 3) {
      const rawCat = token.text.replace(/^[^\w]+/, '').trim()
      const { label, type: catType } = resolveCategory(rawCat)
      currentGroup = { category: label, type: catType, entries: [] }
      current.groups.push(currentGroup)
      continue
    }

    // ── Bullet list of commit entries ───────────────────────────────────────
    if (token.type === 'list' && currentGroup) {
      for (const item of token.items) {
        // Flatten all inline tokens inside the list item to plain text
        const fullText = tokensToText(item.tokens)

        // Extract trailing commit link: ([abc1234](url))
        const commitMatch = fullText.match(/\[([a-f0-9]{7,})\]\((https?:\/\/[^)]+)\)/)
        const hash = commitMatch ? commitMatch[1].slice(0, 7) : ''
        const url  = commitMatch ? commitMatch[2] : '#'

        // Message: strip the trailing ([ hash ]( url )) group and any remaining links
        const message = fullText
          .replace(/\s*\(\[([a-f0-9]+)\]\([^)]+\)\)/, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .trim()

        if (message) {
          currentGroup.entries.push({ message, hash, url })
        }
      }
      continue
    }

    // ── Fallback: bold-wrapped category (**Bug Fixes**) ────────────────────
    if (token.type === 'paragraph' && !currentGroup) {
      const paragraphText = tokensToText(token.tokens ?? [])
      const boldMatch = paragraphText.match(/^\*\*([^*]+)\*\*$/)
      if (boldMatch && current) {
        const { label, type: catType } = resolveCategory(boldMatch[1])
        currentGroup = { category: label, type: catType, entries: [] }
        current.groups.push(currentGroup)
      }
    }
  }

  // Mark the last release as the initial release if it's a major version
  const last = releases[releases.length - 1]
  if (last && last.type === 'major') {
    last.badge = 'initial release'
  }

  return releases
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

const { data: rawMarkdown, pending, error, refresh } = await useFetch('/api/changelog', {
  responseType: 'text',
})

const releases = computed(() => {
  if (!rawMarkdown.value) return []
  return parseChangelog(rawMarkdown.value)
})

useSeoMeta({
  title: 'Changelog — Murphy Facey',
  description: 'A complete history of releases for dev-murphy/personal-website.',
})
</script>