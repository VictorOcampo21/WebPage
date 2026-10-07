<script setup>
// Renders a diagram definition from src/diagrams/ as an inline SVG.
// Layout: nodes sit on a grid of lanes (columns) and rows; edges are routed orthogonally.
// Motion: draws itself in when scrolled into view, then data "packets" travel along the edges.
// Hovering a node highlights its connections. All motion is skipped with prefers-reduced-motion.
// Colors come from CSS variables (--d-*) defined in style.css, so light and dark themes work.
import { computed, nextTick, ref, useId, watch } from 'vue'
import { useInView } from '../composables/useInView.js'
import { useReducedMotion } from '../composables/useReducedMotion.js'

const props = defineProps({ diagram: { type: Object, required: true } })

const LANE_W = 204
const NODE_W = 150
const ROW_H = 88
const PAD = 12
const LINE_H = 16
const CYL_RY = 6
const NODE_STEP = 110 // ms between rows during draw-in
const PACKET_DUR = 1.8 // s per edge

const uid = useId()
const svg = ref(null)
const inView = useInView(svg, { rootMargin: '0px 0px -15% 0px' })
const reduced = useReducedMotion()

const pending = ref(true)
const packetsOn = ref(false)
const noTransition = ref(false)
const hovered = ref(null)
let packetTimer = null

const nodeHeight = (n) => Math.max(44, 18 + n.lines.length * LINE_H)

const layout = computed(() => {
  const d = props.diagram
  const rows = Math.max(...d.nodes.map((n) => n.row)) + 1
  const width = PAD * 2 + d.lanes * LANE_W
  const height = PAD * 2 + rows * ROW_H

  const nodes = {}
  for (const n of d.nodes) {
    const h = nodeHeight(n)
    const cx = PAD + n.lane * LANE_W + LANE_W / 2
    const cy = PAD + n.row * ROW_H + ROW_H / 2
    const delay = n.row * NODE_STEP + n.lane * 60
    nodes[n.id] = { ...n, kind: n.kind || 'process', w: NODE_W, h, cx, cy, x: cx - NODE_W / 2, y: cy - h / 2, delay }
  }

  const edges = (d.edges || []).map((e, i) => {
    const a = nodes[e.from]
    const b = nodes[e.to]
    const pts = route(a, b)
    const delay = a.delay + 140
    return {
      ...e,
      key: `${e.from}-${e.to}-${i}`,
      pathId: `${uid}-edge-${i}`,
      path: roundedPath(pts, 8),
      labelPos: labelPoint(pts),
      delay,
      packetBegin: (a.row * 0.45 + i * 0.07) % (PACKET_DUR * 2),
    }
  })

  const groups = (d.groups || []).map((g) => {
    const x = PAD + g.lanes[0] * LANE_W + 4
    const x2 = PAD + (g.lanes[1] + 1) * LANE_W - 4
    const y = PAD + g.rows[0] * ROW_H + 2
    const y2 = PAD + (g.rows[1] + 1) * ROW_H - 2
    return { ...g, x, y, w: x2 - x, h: y2 - y, labelW: g.label.length * 7 + 16, delay: g.rows[0] * NODE_STEP }
  })

  const lastDelay = Math.max(...edges.map((e) => e.delay), 0) + 700
  return { width, height, nodes: Object.values(nodes), edges, groups, lastDelay }
})

// Neighbours of the hovered node
const linked = computed(() => {
  const id = hovered.value
  if (!id) return null
  const set = new Set([id])
  for (const e of layout.value.edges) {
    if (e.from === id) set.add(e.to)
    if (e.to === id) set.add(e.from)
  }
  return set
})
const edgeLit = (e) => hovered.value && (e.from === hovered.value || e.to === hovered.value)

function onEnter(e, id) {
  if (e.pointerType === 'mouse') hovered.value = id
}

// Play the draw-in once the diagram is on screen; run packets only while visible.
function startPackets() {
  clearTimeout(packetTimer)
  packetTimer = setTimeout(() => {
    packetTimer = null
    packetsOn.value = inView.value && !reduced.value
  }, layout.value.lastDelay)
}
function stopPackets() {
  clearTimeout(packetTimer)
  packetTimer = null
  packetsOn.value = false
}

watch(
  [inView, reduced],
  ([visible, isReduced]) => {
    if (isReduced) {
      pending.value = false
      stopPackets()
      return
    }
    if (visible && pending.value) {
      pending.value = false
      startPackets()
    } else if (visible) {
      // Still drawing in: the scheduled timer turns packets on.
      if (!packetTimer) packetsOn.value = true
    } else {
      stopPackets()
    }
  },
)

async function replay() {
  if (reduced.value) return
  stopPackets()
  noTransition.value = true
  pending.value = true
  await nextTick()
  svg.value?.getBoundingClientRect() // force a reflow so the reset is painted
  noTransition.value = false
  requestAnimationFrame(() => {
    pending.value = false
    startPackets()
  })
}
defineExpose({ replay })

function route(a, b) {
  if (a.lane === b.lane) {
    const down = b.row > a.row
    return [
      [a.cx, down ? a.y + a.h : a.y],
      [b.cx, down ? b.y : b.y + b.h],
    ]
  }
  const right = b.lane > a.lane
  if (a.row === b.row) {
    return [
      [right ? a.x + a.w : a.x, a.cy],
      [right ? b.x : b.x + b.w, b.cy],
    ]
  }
  // Leave the source sideways, then turn vertically into the target.
  const down = b.row > a.row
  return [
    [right ? a.x + a.w : a.x, a.cy],
    [b.cx, a.cy],
    [b.cx, down ? b.y : b.y + b.h],
  ]
}

function roundedPath(pts, r) {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]
    const [cx, cy] = pts[i]
    const [nx, ny] = pts[i + 1]
    const inLen = Math.hypot(cx - px, cy - py)
    const outLen = Math.hypot(nx - cx, ny - cy)
    const rr = Math.min(r, inLen / 2, outLen / 2)
    const ax = cx - ((cx - px) / inLen) * rr
    const ay = cy - ((cy - py) / inLen) * rr
    const bx = cx + ((nx - cx) / outLen) * rr
    const by = cy + ((ny - cy) / outLen) * rr
    d += ` L${ax},${ay} Q${cx},${cy} ${bx},${by}`
  }
  const last = pts[pts.length - 1]
  return d + ` L${last[0]},${last[1]}`
}

function labelPoint(pts) {
  let best = 0
  let bestLen = -1
  for (let i = 0; i < pts.length - 1; i++) {
    const len = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
    if (len > bestLen) {
      bestLen = len
      best = i
    }
  }
  return [(pts[best][0] + pts[best + 1][0]) / 2, (pts[best][1] + pts[best + 1][1]) / 2]
}

function hexagon(n) {
  const t = 12
  const { x, y, w, h, cy } = n
  return `${x + t},${y} ${x + w - t},${y} ${x + w},${cy} ${x + w - t},${y + h} ${x + t},${y + h} ${x},${cy}`
}

function cylinder(n) {
  const { x, y, w, h } = n
  const rx = w / 2
  return `M${x},${y + CYL_RY} a${rx},${CYL_RY} 0 0 1 ${w},0 v${h - CYL_RY * 2} a${rx},${CYL_RY} 0 0 1 ${-w},0 z`
}

function cylinderLid(n) {
  return `M${n.x},${n.y + CYL_RY} a${n.w / 2},${CYL_RY} 0 0 0 ${n.w},0`
}

function textY(n, i) {
  const offset = n.kind === 'store' || n.kind === 'error-store' ? CYL_RY / 2 : 0
  return n.cy + offset + (i - (n.lines.length - 1) / 2) * LINE_H
}

const toneMarker = (tone) => `${uid}-arrow-${tone || 'base'}`
</script>

<template>
  <svg
    ref="svg"
    :class="['flow-diagram', { 'is-pending': pending, 'no-transition': noTransition, 'is-focus': hovered }]"
    :viewBox="`0 0 ${layout.width} ${layout.height}`"
    :style="{ maxWidth: `${layout.width}px` }"
    role="img"
    :aria-labelledby="`${uid}-title ${uid}-desc`"
  >
    <title :id="`${uid}-title`">{{ diagram.title }}</title>
    <desc :id="`${uid}-desc`">{{ diagram.description }}</desc>

    <defs>
      <marker
        v-for="tone in ['base', 'error', 'warn', 'muted']"
        :id="toneMarker(tone === 'base' ? null : tone)"
        :key="tone"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,1 L9,5 L0,9 z" :class="`edge-head tone-${tone}`" />
      </marker>
    </defs>

    <g v-for="g in layout.groups" :key="g.label" class="group-g" :style="{ '--d': `${g.delay}ms` }">
      <rect :x="g.x" :y="g.y" :width="g.w" :height="g.h" rx="12" class="group-box" />
      <rect :x="g.x + g.w - g.labelW - 10" :y="g.y - 9" :width="g.labelW" height="18" rx="9" class="group-tab" />
      <text :x="g.x + g.w - 10 - g.labelW / 2" :y="g.y + 4" text-anchor="middle" class="group-label">
        {{ g.label }}
      </text>
    </g>

    <g
      v-for="e in layout.edges"
      :key="e.key"
      :class="['edge-g', { hl: edgeLit(e) }]"
      :style="{ '--d': `${e.delay}ms` }"
    >
      <path
        :id="e.pathId"
        :d="e.path"
        :pathLength="e.dashed || e.tone === 'muted' ? undefined : 1"
        :class="['edge', `tone-${e.tone || 'base'}`, { dashed: e.dashed, draw: !e.dashed && e.tone !== 'muted' }]"
        :marker-end="`url(#${toneMarker(e.tone)})`"
      />
    </g>

    <g
      v-for="n in layout.nodes"
      :key="n.id"
      :class="['node', `kind-${n.kind}`, { hl: linked?.has(n.id) }]"
      :style="{ '--d': `${n.delay}ms` }"
      @pointerenter="onEnter($event, n.id)"
      @pointerleave="hovered = null"
    >
      <polygon v-if="n.kind === 'decision'" :points="hexagon(n)" class="shape" />
      <template v-else-if="n.kind === 'store' || n.kind === 'error-store'">
        <path :d="cylinder(n)" class="shape" />
        <path :d="cylinderLid(n)" class="lid" />
      </template>
      <rect v-else :x="n.x" :y="n.y" :width="n.w" :height="n.h" rx="9" class="shape" />
      <text
        v-for="(line, i) in n.lines"
        :key="i"
        :x="n.cx"
        :y="textY(n, i)"
        text-anchor="middle"
        dominant-baseline="central"
        :class="i === 0 && n.lines.length > 1 ? 'label-strong' : 'label'"
      >
        {{ line }}
      </text>
    </g>

    <!-- Data packets travelling along each edge -->
    <g v-if="packetsOn" aria-hidden="true">
      <circle
        v-for="e in layout.edges.filter((x) => x.tone !== 'muted')"
        :key="`${e.key}-packet`"
        r="3.5"
        :class="['packet', `tone-${e.tone || 'base'}`]"
        opacity="0"
      >
        <animateMotion :dur="`${PACKET_DUR}s`" :begin="`${e.packetBegin}s`" repeatCount="indefinite" rotate="auto">
          <mpath :href="`#${e.pathId}`" />
        </animateMotion>
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.12;0.85;1"
          :dur="`${PACKET_DUR}s`"
          :begin="`${e.packetBegin}s`"
          repeatCount="indefinite"
        />
      </circle>
    </g>

    <g
      v-for="e in layout.edges.filter((x) => x.label)"
      :key="`${e.key}-label`"
      :class="['label-g', { hl: edgeLit(e) }]"
      :style="{ '--d': `${e.delay + 250}ms` }"
    >
      <rect
        :x="e.labelPos[0] - (e.label.length * 6.4 + 14) / 2"
        :y="e.labelPos[1] - 9"
        :width="e.label.length * 6.4 + 14"
        height="18"
        rx="9"
        :class="['edge-label-bg', `tone-${e.tone || 'base'}`]"
      />
      <text
        :x="e.labelPos[0]"
        :y="e.labelPos[1]"
        text-anchor="middle"
        dominant-baseline="central"
        :class="['edge-label', `tone-${e.tone || 'base'}`]"
      >
        {{ e.label }}
      </text>
    </g>
  </svg>
</template>
