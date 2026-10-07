<script setup>
// Card with a soft light that follows the mouse (no effect on touch or with reduced motion; see style.css).
defineProps({ as: { type: String, default: 'div' } })

function onMove(e) {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}
</script>

<template>
  <component
    :is="as"
    class="spotlight rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-accent/40"
    @pointermove="onMove"
  >
    <slot />
  </component>
</template>
