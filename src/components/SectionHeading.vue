<script setup>
// Numbered label ("01  About") + large heading, with a rule that draws in when visible.
defineProps({
  id: { type: String, required: true },
  index: { type: Number, required: true },
  label: { type: String, required: true },
  title: { type: String, required: true },
})
</script>

<template>
  <header v-reveal class="mb-10 sm:mb-12">
    <div class="flex items-center gap-3" aria-hidden="true">
      <span
        class="grid h-7 min-w-9 place-items-center rounded-md border border-accent/30 bg-accent-soft px-1.5 font-mono text-xs font-medium text-accent"
      >
        {{ String(index).padStart(2, '0') }}
      </span>
      <span class="text-sm font-bold tracking-wide text-muted">{{ label }}</span>
      <span class="rule-draw ml-2 h-px flex-1 bg-gradient-to-r from-line via-line to-transparent"></span>
    </div>
    <h2 :id="id" class="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
      {{ title }}
    </h2>
  </header>
</template>
