<script setup>
// Markdown-style heading for a view ("# about"). It is the h1 of the current screen,
// and the focus target after navigation; inside the plain document it becomes an h2.
defineProps({
  text: { type: String, required: true },
  plain: { type: Boolean, default: false },
})
</script>

<template>
  <component
    :is="plain ? 'h2' : 'h1'"
    :data-view-heading="plain ? undefined : ''"
    :tabindex="plain ? undefined : -1"
    class="font-mono text-xl font-semibold text-fg outline-none sm:text-2xl"
  >
    <span class="text-accent" aria-hidden="true"># </span>{{ text }}
  </component>
</template>
