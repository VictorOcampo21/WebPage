<script setup>
import { profile } from '../data/profile.js'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

defineProps({ plain: { type: Boolean, default: false } })
const fmt = (n) => n.toLocaleString('en-US')
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="about" :plain="plain" />

    <div class="max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
      <p v-for="(p, i) in profile.about" :key="i" :class="i === 0 ? 'text-fg' : ''">{{ p }}</p>
    </div>

    <section aria-labelledby="numbers-h">
      <h3 id="numbers-h" class="font-mono text-sm text-muted"><span class="text-accent" aria-hidden="true">## </span>by_the_numbers</h3>
      <table class="mt-3 w-full max-w-3xl border-collapse font-mono text-sm">
        <thead class="sr-only">
          <tr><th scope="col">Value</th><th scope="col">Metric</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in profile.stats" :key="s.label" class="border-b border-dashed border-line last:border-b-0">
            <td class="w-28 py-2.5 pr-4 text-xl font-semibold text-accent tabular-nums">{{ fmt(s.value) }}{{ s.suffix }}</td>
            <td class="py-2.5 font-sans text-base text-fg">{{ s.label }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section aria-labelledby="now-h">
      <h3 id="now-h" class="font-mono text-sm text-muted"><span class="text-accent" aria-hidden="true">## </span>now</h3>
      <ul class="mt-3 max-w-3xl space-y-2.5">
        <li v-for="item in profile.now" :key="item" class="flex gap-3 leading-relaxed text-fg">
          <span class="font-mono text-accent" aria-hidden="true">-</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>
  </OutputStream>
</template>
