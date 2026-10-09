<script setup>
import { profile } from '../data/profile.js'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

defineProps({ plain: { type: Boolean, default: false } })

// Bold a leading "Name:" in bullets such as "FactuBot: built ..."
function splitLead(text) {
  const m = text.match(/^([A-Z][A-Za-z]+): (.*)$/)
  return m ? { lead: m[1], rest: m[2] } : { lead: null, rest: text }
}
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="experience" :plain="plain" />

    <article
      v-for="(job, i) in profile.experience"
      :key="job.company + job.dates"
      class="relative max-w-4xl border-l border-line pl-6 sm:pl-8"
    >
      <span class="absolute top-1.5 -left-[5px] size-[9px] rounded-full border-2 border-accent bg-surface" aria-hidden="true"></span>
      <p class="font-mono text-xs text-muted">
        <span class="text-warn">entry {{ profile.experience.length - i }}</span>
        <span v-if="i === 0" class="text-accent"> (HEAD -> present)</span>
        <span class="mx-2" aria-hidden="true">·</span>{{ job.dates }}<span class="mx-2" aria-hidden="true">·</span>{{ job.location }}
      </p>
      <h3 class="mt-1.5 text-lg font-bold text-fg sm:text-xl">
        {{ job.title }} <span class="font-mono text-base font-medium text-accent-2">@ {{ job.company }}</span>
      </h3>
      <ul class="mt-3 space-y-2">
        <li v-for="(b, j) in job.bullets" :key="j" class="flex gap-3 leading-relaxed text-muted">
          <span class="font-mono text-accent" aria-hidden="true">+</span>
          <span>
            <strong v-if="splitLead(b).lead" class="font-semibold text-fg">{{ splitLead(b).lead }}:</strong>
            {{ splitLead(b).rest }}
          </span>
        </li>
      </ul>
      <p class="mt-3 flex flex-wrap gap-1.5 font-mono text-xs" aria-label="Technologies">
        <span v-for="t in job.tags" :key="t" class="rounded border border-line px-1.5 py-0.5 text-muted">{{ t }}</span>
      </p>
    </article>
  </OutputStream>
</template>
