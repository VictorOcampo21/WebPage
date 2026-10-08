<script setup>
import { computed, ref, useId } from 'vue'
import FlowDiagram from './FlowDiagram.vue'
import Icon from './Icon.vue'
import SpotlightCard from './SpotlightCard.vue'
import { useReducedMotion } from '../composables/useReducedMotion.js'
import { diagrams } from '../diagrams/index.js'

const props = defineProps({ project: { type: Object, required: true } })

const uid = useId()
const diagram = computed(() => diagrams[props.project.diagram])
const hasDetails = computed(() => props.project.bullets.length > 0)

const tabs = computed(() => [
  { id: 'flow', label: props.project.status === 'done' ? 'Data flow' : 'Planned flow' },
  ...(hasDetails.value ? [{ id: 'details', label: 'Details' }] : []),
  ...(props.project.decisions?.length ? [{ id: 'why', label: 'Why' }] : []),
])
const active = ref('flow')
const flow = ref(null)
const reduced = useReducedMotion()
const tabRefs = ref([])

function onKey(e, index) {
  const n = tabs.value.length
  let next = null
  if (e.key === 'ArrowRight') next = (index + 1) % n
  if (e.key === 'ArrowLeft') next = (index - 1 + n) % n
  if (e.key === 'Home') next = 0
  if (e.key === 'End') next = n - 1
  if (next === null) return
  e.preventDefault()
  active.value = tabs.value[next].id
  tabRefs.value[next]?.focus()
}

const badge = computed(() => {
  if (props.project.status === 'coming-soon') return 'Coming soon'
  if (props.project.status === 'in-progress') return 'In progress'
  return null
})
</script>

<template>
  <SpotlightCard as="article" class="overflow-hidden">
    <div class="p-5 sm:p-7">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p class="font-mono text-xs font-medium tracking-wide text-accent uppercase">{{ project.kind }}</p>
        <span
          v-if="badge"
          class="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300"
        >
          {{ badge }}
        </span>
      </div>
      <h3 class="mt-2 text-xl font-bold tracking-tight text-fg sm:text-2xl">{{ project.title }}</h3>
      <p class="mt-3 leading-relaxed text-muted">{{ project.summary }}</p>
      <ul class="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
        <li
          v-for="tech in project.stack"
          :key="tech"
          class="rounded-md bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent"
        >
          {{ tech }}
        </li>
      </ul>
      <div v-if="project.phasesDone?.length" class="mt-5 rounded-xl border border-line bg-surface-2/60 p-4">
        <p class="text-xs font-bold tracking-wider text-accent-2 uppercase">Done so far</p>
        <ul class="mt-3 space-y-2">
          <li v-for="item in project.phasesDone" :key="item" class="flex gap-2.5 text-sm leading-relaxed text-muted">
            <svg class="mt-1 size-3.5 shrink-0 text-accent-2" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 8.5l3 3 7-7" />
            </svg>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
      <a
        v-if="project.repo"
        :href="project.repo"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Icon name="github" :size="15" />
        View repository
        <Icon name="external" :size="12" />
        <span class="sr-only">(opens in a new tab)</span>
      </a>
    </div>

    <div class="border-t border-line">
      <div
        v-if="tabs.length > 1"
        role="tablist"
        :aria-label="`${project.title} views`"
        class="flex gap-1 border-b border-line px-5 sm:px-7"
      >
        <button
          v-for="(tab, i) in tabs"
          :id="`${uid}-tab-${tab.id}`"
          :key="tab.id"
          :ref="(el) => (tabRefs[i] = el)"
          type="button"
          role="tab"
          :aria-selected="active === tab.id"
          :aria-controls="`${uid}-panel-${tab.id}`"
          :tabindex="active === tab.id ? 0 : -1"
          :class="[
            '-mb-px border-b-2 px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent',
            active === tab.id ? 'border-accent text-fg' : 'border-transparent text-muted hover:text-fg',
          ]"
          @click="active = tab.id"
          @keydown="onKey($event, i)"
        >
          {{ tab.label }}
        </button>
      </div>
      <p v-else class="px-5 pt-4 font-mono text-xs font-medium tracking-wide text-muted uppercase sm:px-7">
        {{ tabs[0].label }}
      </p>

      <div
        v-show="active === 'flow'"
        :id="`${uid}-panel-flow`"
        :role="tabs.length > 1 ? 'tabpanel' : undefined"
        :aria-labelledby="tabs.length > 1 ? `${uid}-tab-flow` : undefined"
        class="diagram-canvas relative px-3 py-6 sm:px-6"
      >
        <button
          v-if="!reduced"
          type="button"
          class="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface/90 px-2.5 py-1 font-mono text-xs text-muted backdrop-blur transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
          @click="flow?.replay()"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9" />
            <path d="M2.5 2.5v3.2h3.2" />
          </svg>
          Replay<span class="sr-only"> {{ project.title }} flow animation</span>
        </button>
        <FlowDiagram ref="flow" :diagram="diagram" />
        <div v-if="project.status !== 'done'" class="mx-auto mt-4 max-w-md text-center text-sm text-muted">
          <p>Planned architecture.</p>
        </div>
      </div>

      <div
        v-if="hasDetails"
        v-show="active === 'details'"
        :id="`${uid}-panel-details`"
        role="tabpanel"
        :aria-labelledby="`${uid}-tab-details`"
        class="px-5 py-6 sm:px-7"
      >
        <ul class="space-y-3">
          <li v-for="[term, text] in project.bullets" :key="term" class="flex gap-3 leading-relaxed text-muted">
            <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
            <span><strong class="font-semibold text-fg">{{ term }}:</strong> {{ text }}</span>
          </li>
        </ul>
      </div>

      <div
        v-if="project.decisions?.length"
        v-show="active === 'why'"
        :id="`${uid}-panel-why`"
        role="tabpanel"
        :aria-labelledby="`${uid}-tab-why`"
        class="px-5 py-6 sm:px-7"
      >
        <p class="mb-4 text-xs font-bold tracking-wider text-accent-2 uppercase">Design decisions</p>
        <ol class="space-y-4">
          <li v-for="([title, text], i) in project.decisions" :key="title" class="flex gap-4">
            <span
              class="grid size-7 shrink-0 place-items-center rounded-md border border-accent/30 bg-accent-soft font-mono text-xs text-accent"
              aria-hidden="true"
            >
              {{ i + 1 }}
            </span>
            <span class="leading-relaxed text-muted">
              <strong class="block font-semibold text-fg">{{ title }}</strong>
              {{ text.charAt(0).toUpperCase() + text.slice(1) }}
            </span>
          </li>
        </ol>
      </div>
    </div>
  </SpotlightCard>
</template>
