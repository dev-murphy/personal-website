<script lang="ts" setup>
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="w-full px-4 border-t border-border-100">
    <div
      class="w-full max-w-310 mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-y-3 font-geist-mono text-xs text-text-300"
    >
      <p>© {{ currentYear }} Murphy Facey. Built with care.</p>

      <div class="flex items-center gap-x-4">
        <a
          href="https://github.com/dev-murphy"
          target="_blank"
          class="hover:text-text-100 transition-colors"
        >
          github
        </a>
        <span class="text-border-100">·</span>
        <a href="#changelog" class="hover:text-text-100 transition-colors">
          changelog
        </a>
      </div>
    </div>
  </footer>
</template>
