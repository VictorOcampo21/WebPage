<script setup>
// Bottom status line (tmux/vim style): current view, exploration progress, previous/next.
import { computed } from 'vue'
import { sections } from '../../data/terminal.js'

const props = defineProps({
  current: { type: Object, required: true },
  prev: { type: Object, default: null },
  next: { type: Object, default: null },
  visited: { type: Object, required: true },
  explored: { type: Number, required: true },
  total: { type: Number, required: true },
})
const emit = defineEmits(['navigate', 'help'])
const progressLabel = computed(() => `${props.explored} of ${props.total} sections explored`)
</script>

<template>
  <nav aria-label="Status and navigation" class="no-print border-t border-line bg-chrome">
    <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-1.5 font-mono text-[13px] sm:px-8">
    <button
      type="button"
      class="hidden shrink-0 rounded bg-accent px-2 py-0.5 font-semibold text-accent-fg sm:inline"
      @click="emit('navigate', 'home')"
    >
      map
    </button>
    <span class="hidden truncate text-fg sm:inline">{{ current.label }}{{ current.featured ? ' ★' : '' }}</span>

    <div class="flex items-center gap-2" :title="progressLabel">
      <span class="flex gap-0.5" aria-hidden="true">
        <span
          v-for="s in sections"
          :key="s.id"
          :class="['h-2.5 w-1.5 rounded-[1px]', visited.has(s.id) ? 'bg-accent' : 'bg-line']"
        ></span>
      </span>
      <span class="text-muted"><span class="sr-only">{{ progressLabel }}</span><span aria-hidden="true">{{ explored }}/{{ total }} explored</span></span>
    </div>

    <div class="ml-auto flex items-center gap-1">
      <button
        v-if="prev"
        type="button"
        class="rounded px-2 py-1 text-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        @click="emit('navigate', prev.id)"
      >
        ← <span class="hidden md:inline">{{ prev.label }}</span><span class="sr-only md:hidden">previous: {{ prev.label }}</span>
      </button>
      <button
        v-if="next"
        type="button"
        class="rounded px-2 py-1 text-accent transition-colors hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-accent"
        @click="emit('navigate', next.id)"
      >
        next: {{ next.label }} →
      </button>
      <button
        type="button"
        class="hidden rounded px-2 py-1 text-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-accent sm:inline"
        @click="emit('help')"
      >
        ? help
      </button>
    </div>
    </div>
  </nav>
</template>
