<script setup>
import { profile } from '../data/profile.js'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

defineProps({ plain: { type: Boolean, default: false } })
const e = profile.education
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="education" :plain="plain" />
    <div class="max-w-3xl rounded-lg border border-line bg-surface-2/50 p-5 sm:p-6">
      <p class="font-mono text-xs tracking-wider text-muted uppercase">degree</p>
      <p class="mt-1 text-xl font-bold text-fg">{{ e.degree }}</p>
      <dl class="mt-4 grid gap-x-6 gap-y-1 font-mono text-sm sm:grid-cols-[8rem_1fr]">
        <dt class="text-muted">school</dt>
        <dd class="text-fg">{{ e.school }}</dd>
        <dt class="text-muted">location</dt>
        <dd class="text-fg">{{ e.location }}</dd>
        <dt class="text-muted">period</dt>
        <dd class="text-accent">{{ e.dates }}</dd>
      </dl>
    </div>
  </OutputStream>
</template>
