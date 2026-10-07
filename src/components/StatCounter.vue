<script setup>
// Counts up to `value` the first time it is visible. Shows the final value with reduced motion.
import { ref, watch } from 'vue'
import { useInView } from '../composables/useInView.js'
import { useReducedMotion } from '../composables/useReducedMotion.js'

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  label: { type: String, required: true },
})

const el = ref(null)
const inView = useInView(el, { once: true })
const reduced = useReducedMotion()
const shown = ref(props.value)
let started = false

const format = (n) => n.toLocaleString('en-US')

watch(inView, (visible) => {
  if (!visible || started || reduced.value) return
  started = true
  const duration = 1400
  const t0 = performance.now()
  shown.value = 0
  const step = (t) => {
    const p = Math.min((t - t0) / duration, 1)
    shown.value = Math.round(props.value * (1 - Math.pow(1 - p, 3)))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})
</script>

<template>
  <div ref="el">
    <p class="text-3xl font-extrabold tracking-tight text-fg tabular-nums">
      <span aria-hidden="true">{{ format(shown) }}</span><span class="text-accent-2" aria-hidden="true">{{ suffix }}</span>
      <span class="sr-only">{{ format(value) }}{{ suffix }}</span>
    </p>
    <p class="mt-1 text-sm leading-snug text-muted">{{ label }}</p>
  </div>
</template>
