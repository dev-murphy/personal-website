<script setup lang="ts">
const route = useRoute();
const { isDark } = useTheme();
const isHome = computed(() => route.path === "/");

const sectionLinks = [
  { label: "stack", href: "#stack", id: "stack" },
  { label: "experience", href: "#experience", id: "experience" },
  { label: "work", href: "#work", id: "work" },
  { label: "contact", href: "#contact", id: "contact" },
];

const pageLinks = [
  { label: "blog", href: "/blog" },
  { label: "changelog", href: "/changelog" },
];

const activeSection = useActiveSection(sectionLinks.map((l) => l.id));

const isMenuOpened = ref(false);
const toggleMenu = () => {
  isMenuOpened.value = !isMenuOpened.value;
};
const closeMenu = () => {
  isMenuOpened.value = false;
};
</script>

<template>
  <nav
    class="fixed top-0 inset-x-0 px-4 border-b border-border-100 bg-background-100/95 backdrop-blur-xl z-50"
  >
    <div
      class="h-14 w-full max-w-310 flex items-center justify-between mx-auto md:px-4"
    >
      <NuxtLink
        to="/"
        class="font-geist-mono text-sm tracking-tight text-text-100 hover:text-primary transition-colors"
      >
        <span class="text-primary">~</span>/murphy.dev
      </NuxtLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center divide-x divide-border-100">
        <ul
          v-if="isHome"
          class="flex items-center gap-x-5 pr-4 font-geist-mono text-sm"
        >
          <li v-for="link in sectionLinks" :key="link.id">
            <a
              :href="link.href"
              :class="[
                'transition-colors',
                activeSection === link.id
                  ? 'text-primary'
                  : 'text-text-200 hover:text-text-100',
              ]"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
        <NuxtLink v-else to="/" class="pr-4 transition-colors text-text-200 hover:text-text-100">home</NuxtLink>

        <ul class="flex items-center gap-x-5 px-4 font-geist-mono text-sm">
          <li v-for="link in pageLinks" :key="link.label">
            <NuxtLink
              :to="link.href"
              :class="[
                'transition-colors',
                route.path.startsWith(link.href)
                  ? 'text-text-100'
                  : 'text-text-200 hover:text-text-100',
              ]"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>

        <div class="flex items-center gap-x-3 border-border-100 pl-4">
          <XThemeToggle />
          <a
            href="https://github.com/dev-murphy/personal-website"
            target="_blank"
            aria-label="GitHub"
            class="text-text-200 hover:text-text-100 transition-colors"
          >
            <IconsGithub class="w-6 h-6" />
          </a>
        </div>
      </div>

      <!-- Mobile Toggle -->
      <button
        class="block md:hidden text-text-100"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <IconsMenu v-show="!isMenuOpened" class="w-6" />
        <IconsClose v-show="isMenuOpened" class="w-6" />
      </button>
    </div>

    <!-- Mobile Drawer (full-width) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpened"
        class="md:hidden absolute top-full inset-x-0 bg-background-100 border-b border-border-100 font-geist-mono text-sm"
      >
        <div v-if="isHome">
          <p
            class="px-4 pt-4 pb-2 text-[10px] uppercase tracking-[0.25em] text-text-300"
          >
            // Sections
          </p>
          <a
            v-for="link in sectionLinks"
            :key="link.id"
            :href="link.href"
            :class="[
              'block px-4 py-3 border-t border-border-100 transition-colors',
              activeSection === link.id
                ? 'text-primary'
                : 'text-text-200 hover:text-text-100',
            ]"
            @click="closeMenu"
          >
            <span class="text-text-300">#</span>{{ link.label }}
          </a>
        </div>

        <p
          class="px-4 pt-4 pb-2 text-[10px] uppercase tracking-[0.25em] text-text-300 border-t border-border-100"
        >
          // Pages
        </p>
        <NuxtLink
          v-for="link in pageLinks"
          :key="link.label"
          :to="link.href"
          class="block px-4 py-3 border-t border-border-100 text-text-200 hover:text-text-100 transition-colors"
          @click="closeMenu"
        >
          {{ link.label }}
        </NuxtLink>

        <div
          class="flex items-center justify-between gap-x-2 px-4 py-3 border-t border-border-100"
        >
          <div class="flex items-center gap-x-2">
            <p>
              <span :class="{ 'font-black': !isDark }">Light</span> / 
              <span :class="{ 'font-black': isDark }">Dark</span>
            </p>
            <XThemeToggle />
          </div>
          <a
            href="https://github.com/dev-murphy/personal-website"
            target="_blank"
            aria-label="GitHub"
            class="flex items-center gap-x-2 text-text-200 hover:text-text-100 transition-colors"
          >
            <IconsGithub class="w-6" />
            Github
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>
