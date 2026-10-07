<script setup>
// Decorative hero illustration: generic data pipeline with packets flowing through it.
// Sources -> Ingest -> Validate -> Load -> Insights, with rejected records going to Quarantine.
// Packets run only while visible and never with reduced motion.
import { computed, ref } from 'vue'
import { useInView } from '../composables/useInView.js'
import { useReducedMotion } from '../composables/useReducedMotion.js'

const svg = ref(null)
const inView = useInView(svg)
const reduced = useReducedMotion()
const animate = computed(() => inView.value && !reduced.value)

const W = 112
const H = 46
const sources = [
  { title: 'Files', y: 34 },
  { title: 'Databases', y: 122 },
  { title: 'Logs', y: 210 },
]
const midY = 122
const stages = [
  { id: 'ingest', title: 'Ingest', sub: 'NiFi · SSIS', x: 172, y: midY },
  { id: 'validate', title: 'Validate', sub: 'rules · hashes', x: 318, y: midY, accent: true },
  { id: 'load', title: 'Load', sub: 'SQL Server', x: 464, y: midY },
]
const tail = [
  { id: 'quarantine', title: 'Quarantine', sub: 'error log', x: 318, y: 238, error: true },
  { id: 'insights', title: 'Insights', sub: 'KPIs', x: 464, y: 238, accent: true },
]

const srcW = 96
const edges = [
  ...sources.map((s, i) => ({
    id: `pipe-src-${i}`,
    d: `M${8 + srcW},${s.y + H / 2} C${140},${s.y + H / 2} ${140},${midY + H / 2} ${172},${midY + H / 2}`,
    dur: 2.4,
    begin: i * 0.8,
  })),
  { id: 'pipe-iv', d: `M${172 + W},${midY + H / 2} L${318},${midY + H / 2}`, dur: 1.2, begin: 0.6 },
  { id: 'pipe-vl', d: `M${318 + W},${midY + H / 2} L${464},${midY + H / 2}`, dur: 1.2, begin: 1.0 },
  { id: 'pipe-li', d: `M${464 + W / 2},${midY + H} L${464 + W / 2},${238}`, dur: 1.2, begin: 1.4 },
  { id: 'pipe-vq', d: `M${318 + W / 2},${midY + H} L${318 + W / 2},${238}`, dur: 1.2, begin: 2.2, error: true },
]
</script>

<template>
  <svg ref="svg" viewBox="0 0 584 300" class="h-auto w-full" aria-hidden="true" focusable="false">
    <defs>
      <marker id="pipe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,1 L9,5 L0,9 z" fill="var(--d-edge)" />
      </marker>
    </defs>

    <path
      v-for="e in edges"
      :id="e.id"
      :key="e.id"
      :d="e.d"
      :class="['pipe-edge', { 'is-error': e.error }]"
      marker-end="url(#pipe-arrow)"
    />

    <g v-for="s in sources" :key="s.title">
      <rect x="8" :y="s.y" :width="srcW" :height="H" rx="10" class="pipe-node" />
      <text :x="8 + srcW / 2" :y="s.y + H / 2" text-anchor="middle" dominant-baseline="central" class="pipe-title">
        {{ s.title }}
      </text>
    </g>

    <g v-for="n in [...stages, ...tail]" :key="n.id">
      <rect
        :x="n.x"
        :y="n.y"
        :width="W"
        :height="H"
        rx="10"
        :class="['pipe-node', { 'is-accent': n.accent, 'is-error': n.error }]"
      />
      <text :x="n.x + W / 2" :y="n.y + 18" text-anchor="middle" dominant-baseline="central" class="pipe-title">
        {{ n.title }}
      </text>
      <text :x="n.x + W / 2" :y="n.y + 34" text-anchor="middle" dominant-baseline="central" class="pipe-sub">
        {{ n.sub }}
      </text>
    </g>

    <g v-if="animate">
      <circle
        v-for="e in edges"
        :key="`${e.id}-p`"
        r="4"
        :class="['pipe-packet', { 'is-error': e.error }]"
        opacity="0"
      >
        <!-- Error packets travel once every three cycles -->
        <animateMotion
          :dur="`${e.error ? e.dur * 3 : e.dur}s`"
          :begin="`${e.begin}s`"
          repeatCount="indefinite"
          :keyPoints="e.error ? '0;1;1' : '0;1'"
          :keyTimes="e.error ? '0;0.33;1' : '0;1'"
          calcMode="linear"
        >
          <mpath :href="`#${e.id}`" />
        </animateMotion>
        <animate
          attributeName="opacity"
          :values="e.error ? '0;1;1;0;0' : '0;1;1;0'"
          :keyTimes="e.error ? '0;0.04;0.29;0.33;1' : '0;0.12;0.85;1'"
          :dur="`${e.error ? e.dur * 3 : e.dur}s`"
          :begin="`${e.begin}s`"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  </svg>
</template>
