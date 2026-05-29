<script lang="ts" setup>
defineProps<{ logo: Component; name?: string; iconPadding: string }>();
</script>

<template>
  <div
    :title="name"
    class="flex flex-col shrink-0 items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300"
    :style="{ padding: iconPadding }"
  >
    <div class="flex items-center justify-center w-10 h-10">
      <component :is="logo" class="w-full h-full" />
    </div>
  </div>
</template>
