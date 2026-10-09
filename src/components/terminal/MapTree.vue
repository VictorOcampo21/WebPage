<script setup>
// Mobile version of the lineage map: output of `tree`, every branch is a button.
import { computed } from 'vue'
import { sections } from '../../data/terminal.js'

const props = defineProps({ visited: { type: Object, required: true }, name: { type: String, required: true } })
const emit = defineEmits(['navigate'])

const byId = Object.fromEntries(sections.map((s) => [s.id, s]))
const rows = computed(() =>
  [
    ['about', '├── '],
    ['projects', '├── '],
    ['experience', '├── '],
    ['education', '│   └── '],
    ['skills', '├── '],
    ['certifications', '│   └── '],
    ['contact', '└── '],
  ].map(([id, prefix]) => ({ ...byId[id], prefix, done: props.visited.has(id) })),
)
</script>

<template>
  <div class="font-mono text-sm">
    <p class="text-fg">{{ name.toLowerCase().replaceAll(' ', '_') }}/</p>
    <ul class="mt-1">
      <li v-for="r in rows" :key="r.id">
        <button
          type="button"
          class="flex w-full items-center rounded-md py-2 pr-2 text-left transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
          :aria-label="`${r.title}: run ${r.cmd}${r.done ? ' (explored)' : ''}`"
          @click="emit('navigate', r.id)"
        >
          <span class="whitespace-pre text-muted" aria-hidden="true">{{ r.prefix }}</span>
          <span :class="r.featured ? 'font-semibold text-accent' : 'text-fg'">{{ r.label }}</span>
          <span v-if="r.featured" class="ml-1 text-warn" aria-hidden="true">★</span>
          <span class="ml-auto pl-3 text-[11px]" :class="r.done ? 'text-accent' : 'text-muted'" aria-hidden="true">
            {{ r.done ? '✓' : `[${r.key}]` }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>
