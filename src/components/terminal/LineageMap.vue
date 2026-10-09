<script setup>
// Home menu as a data-lineage DAG: the source node "victor" feeds every section.
// Nodes are real buttons laid over an SVG that draws the edges; data packets travel along them.
// Visited sections turn their incoming edge solid ("materialized").
import { computed, ref } from 'vue'
import { sections } from '../../data/terminal.js'
import { useInView } from '../../composables/useInView.js'
import { useReducedMotion } from '../../composables/useReducedMotion.js'

const props = defineProps({
  visited: { type: Object, required: true },
  explored: { type: Number, required: true },
  total: { type: Number, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
})
const emit = defineEmits(['navigate'])

const W = 1000
const H = 410
const source = { x: 30, y: 140, w: 240, h: 130 }
const layout = {
  about: { x: 400, y: 10, w: 215, from: 'source' },
  projects: { x: 400, y: 92, w: 215, from: 'source' },
  experience: { x: 400, y: 174, w: 215, from: 'source' },
  skills: { x: 400, y: 256, w: 215, from: 'source' },
  contact: { x: 400, y: 338, w: 215, from: 'source' },
  education: { x: 730, y: 174, w: 240, from: 'experience' },
  certifications: { x: 730, y: 256, w: 240, from: 'skills' },
}
const NODE_H = 62

const nodes = computed(() =>
  sections.map((s) => ({ ...s, ...layout[s.id], h: NODE_H, done: props.visited.has(s.id) })),
)

const edges = computed(() =>
  nodes.value.map((n, i) => {
    const y2 = n.y + NODE_H / 2
    let d
    if (n.from === 'source') {
      const x1 = source.x + source.w
      const y1 = source.y + source.h / 2
      d = `M${x1},${y1} C${x1 + 70},${y1} ${n.x - 70},${y2} ${n.x},${y2}`
    } else {
      const p = layout[n.from]
      d = `M${p.x + p.w},${y2} L${n.x},${y2}`
    }
    return { id: `map-edge-${n.id}`, to: n.id, d, done: n.done, begin: (i * 0.37) % 2.4 }
  }),
)

const pct = (v, total) => `${(v / total) * 100}%`
const box = (b) => ({ left: pct(b.x, W), top: pct(b.y, H), width: pct(b.w, W), height: pct(b.h, H) })

const hovered = ref(null)
const root = ref(null)
const inView = useInView(root)
const reduced = useReducedMotion()
const animate = computed(() => inView.value && !reduced.value)
</script>

<template>
  <div ref="root" class="relative w-full" :style="{ aspectRatio: `${W} / ${H}` }">
    <svg :viewBox="`0 0 ${W} ${H}`" class="absolute inset-0 h-full w-full" aria-hidden="true" focusable="false">
      <path
        v-for="e in edges"
        :id="e.id"
        :key="e.id"
        :d="e.d"
        :class="['map-edge', { 'is-done': e.done, 'is-hot': hovered === e.to }]"
      />
      <g v-if="animate">
        <circle v-for="e in edges" :key="`${e.id}-p`" r="3.5" class="map-packet" opacity="0">
          <animateMotion dur="2.4s" :begin="`${e.begin}s`" repeatCount="indefinite">
            <mpath :href="`#${e.id}`" />
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.4s" :begin="`${e.begin}s`" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>

    <!-- Source node -->
    <div
      class="absolute flex flex-col justify-center rounded-lg border border-accent/60 bg-surface px-5 font-mono shadow-[0_0_0_4px_var(--accent-soft)]"
      :style="box(source)"
    >
      <p class="text-[11px] tracking-wider text-muted uppercase">source</p>
      <p class="mt-1 text-xl font-semibold text-fg">{{ name.toLowerCase().replaceAll(' ', '_') }}</p>
      <p class="mt-1 text-sm text-accent">{{ role }} · {{ location }}</p>
    </div>

    <!-- Legend -->
    <div class="absolute font-mono text-sm text-muted" :style="box({ x: 730, y: 6, w: 270, h: 160 })" aria-hidden="true">
      <p class="text-[11px] tracking-wider uppercase">lineage map</p>
      <p class="mt-1 text-fg">pick a node to run it</p>
      <p class="mt-3"><span class="text-muted">- - -</span> pending</p>
      <p class="mt-1"><span class="text-accent">───</span> explored</p>
      <p class="mt-1"><span class="text-warn">★</span> start here</p>
      <p class="mt-2 text-accent">{{ explored }}/{{ total }} explored</p>
    </div>

    <!-- Section nodes -->
    <button
      v-for="n in nodes"
      :key="n.id"
      type="button"
      :class="[
        'group absolute flex flex-col justify-center rounded-lg border bg-surface px-4 text-left font-mono transition-[border-color,transform,background-color] duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        n.featured ? 'featured-ring border-accent' : n.done ? 'border-accent/50' : 'border-line',
      ]"
      :style="box(n)"
      :aria-label="`${n.title}: run ${n.cmd}${n.done ? ' (explored)' : ''}`"
      @click="emit('navigate', n.id)"
      @pointerenter="hovered = n.id"
      @pointerleave="hovered = null"
      @focus="hovered = n.id"
      @blur="hovered = null"
    >
      <span class="flex items-center gap-2 text-[15px] font-semibold text-fg">
        {{ n.label }}
        <span v-if="n.featured" class="text-warn">★</span>
        <span class="ml-auto text-[11px] font-normal" :class="n.done ? 'text-accent' : 'text-muted'">
          {{ n.done ? 'done' : `[${n.key}]` }}
        </span>
      </span>
      <span class="mt-1 truncate text-xs text-muted group-hover:text-accent">$ {{ n.cmd }}</span>
    </button>
  </div>
</template>
