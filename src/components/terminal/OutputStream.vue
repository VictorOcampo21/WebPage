<script setup>
// Wraps a view's output: each direct child appears one after another, like lines printed by a command.
// The terminal can skip the animation (click or key) and it is off for plain view and reduced motion.
import { inject, onMounted, ref } from 'vue'

const props = defineProps({ plain: { type: Boolean, default: false } })
const term = inject('term', null)
const el = ref(null)

onMounted(() => {
  Array.from(el.value.children).forEach((child, i) => child.style.setProperty('--i', i))
})
</script>

<template>
  <div
    ref="el"
    :class="[
      'stream space-y-8',
      { 'is-animated': !props.plain && term?.animate.value, 'is-skipped': term?.skipped.value },
    ]"
  >
    <slot />
  </div>
</template>
