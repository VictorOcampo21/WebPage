<script setup>
import { computed, watch } from 'vue'
import { profile } from '../data/profile.js'
import { navigate, useHashRoute } from '../composables/useHashRoute.js'
import { markVisited, useVisited } from '../composables/useVisited.js'
import ProjectCard from '../components/ProjectCard.vue'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

const props = defineProps({ plain: { type: Boolean, default: false } })
const route = useHashRoute()
const { visited } = useVisited()

const projects = profile.projects
const selectedId = computed(() =>
  projects.some((p) => p.id === route.value.sub) ? route.value.sub : projects[0].id,
)
const selected = computed(() => projects.find((p) => p.id === selectedId.value))
const index = computed(() => projects.findIndex((p) => p.id === selectedId.value))
const nextProject = computed(() => projects[(index.value + 1) % projects.length])
const seen = computed(() => projects.filter((p) => visited.value.has(`project:${p.id}`)).length)

watch(selectedId, (id) => !props.plain && markVisited(`project:${id}`), { immediate: true })
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="projects" :plain="plain" />
    <p class="max-w-3xl leading-relaxed text-muted">{{ profile.projectsIntro }}</p>

    <!-- Plain document: every project expanded -->
    <div v-if="plain" class="space-y-8">
      <ProjectCard v-for="p in projects" :key="p.id" :project="p" expanded />
    </div>

    <!-- Terminal: ls projects/ + selected flow -->
    <div v-else class="grid gap-6 lg:grid-cols-[15rem_1fr]">
      <nav aria-label="Projects" class="min-w-0 font-mono text-sm">
        <p class="text-muted">$ ls projects/ <span class="text-xs">· {{ seen }}/{{ projects.length }} flows viewed</span></p>
        <ul class="mt-2 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible">
          <li v-for="p in projects" :key="p.id" class="shrink-0">
            <button
              type="button"
              :aria-current="p.id === selectedId ? 'true' : undefined"
              :class="[
                'flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                p.id === selectedId ? 'border-accent bg-accent-soft text-accent' : 'border-line text-fg hover:border-accent/60 lg:border-transparent',
              ]"
              @click="navigate('projects', p.id)"
            >
              <span class="whitespace-nowrap">{{ p.id }}/</span>
              <span
                class="ml-auto text-[10px]"
                :class="visited.has(`project:${p.id}`) ? 'text-accent' : 'text-muted'"
                aria-hidden="true"
              >{{ visited.has(`project:${p.id}`) ? '✓' : '·' }}</span>
            </button>
          </li>
        </ul>
      </nav>

      <div class="min-w-0">
        <ProjectCard :key="selected.id" :project="selected" />
        <button
          type="button"
          class="mt-4 font-mono text-sm text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
          @click="navigate('projects', nextProject.id)"
        >
          next flow: {{ nextProject.id }}/ →
        </button>
      </div>
    </div>

    <section aria-labelledby="other-h" class="max-w-4xl">
      <h3 id="other-h" class="font-mono text-sm text-muted"><span class="text-accent" aria-hidden="true">## </span>{{ profile.otherWork.title.toLowerCase().replaceAll(' ', '_') }}</h3>
      <ul class="mt-3 space-y-2.5">
        <li v-for="item in profile.otherWork.items" :key="item" class="flex gap-3 leading-relaxed text-muted">
          <span class="font-mono text-accent" aria-hidden="true">+</span>
          <span>{{ item }}</span>
        </li>
      </ul>
    </section>
  </OutputStream>
</template>
