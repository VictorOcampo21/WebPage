<script setup>
// Slow scrolling band of core technologies. Pauses on hover; static with reduced motion.
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <div class="marquee relative overflow-hidden border-y border-line bg-surface/60 py-4">
    <p class="sr-only">Core stack: {{ items.join(', ') }}</p>
    <div
      class="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent"
      aria-hidden="true"
    ></div>
    <div
      class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent"
      aria-hidden="true"
    ></div>
    <div class="marquee-track flex w-max" aria-hidden="true">
      <ul v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
        <li
          v-for="item in items"
          :key="item"
          class="flex items-center gap-6 px-6 font-mono text-sm font-medium whitespace-nowrap text-muted"
        >
          {{ item }}
          <span class="size-1.5 rounded-full bg-accent-2/60"></span>
        </li>
      </ul>
    </div>
  </div>
</template>
