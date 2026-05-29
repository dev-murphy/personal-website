<script lang="ts" setup>
const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <button
    class="w-9.5 bg-secondary border border-border-100 p-0.5 rounded-full"
    @click="toggleTheme"
  >
    <div class="relative w-full h-4">
      <div
        class="absolute w-4 h-4 bg-text-100 rounded-full"
        style="transition: transform 300ms ease-in-out"
        :style="{
          transform: isDark ? 'translateX(16px)' : 'translateX(0)',
        }"
      ></div>
    </div>
  </button>
</template>
