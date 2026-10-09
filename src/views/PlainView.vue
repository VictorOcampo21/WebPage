<script setup>
// Plain document: everything on one readable page, no animations, ready to print.
import { inject } from 'vue'
import { profile } from '../data/profile.js'
import { navigate } from '../composables/useHashRoute.js'
import Icon from '../components/Icon.vue'
import AboutView from './AboutView.vue'
import ProjectsView from './ProjectsView.vue'
import ExperienceView from './ExperienceView.vue'
import EducationView from './EducationView.vue'
import SkillsView from './SkillsView.vue'
import CertificationsView from './CertificationsView.vue'
import ContactView from './ContactView.vue'

const cvHref = inject('cvHref')
const printPage = () => window.print()
const parts = [AboutView, ProjectsView, ExperienceView, EducationView, SkillsView, CertificationsView, ContactView]
</script>

<template>
  <div class="space-y-14">
    <div class="no-print flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface-2/60 p-3 font-mono text-sm">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-2 font-semibold text-accent-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        @click="navigate('home')"
      >
        ← back to the map
      </button>
      <span class="text-muted">You are reading the plain version: everything on one page.</span>
      <button
        type="button"
        class="ml-auto rounded-md border border-line px-3 py-2 text-muted transition-colors hover:border-accent hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        @click="printPage"
      >
        print
      </button>
    </div>

    <header class="border-b border-line pb-8">
      <h1 data-view-heading tabindex="-1" class="font-mono text-3xl font-semibold text-fg outline-none sm:text-4xl">{{ profile.name }}</h1>
      <p class="mt-2 font-mono text-accent">{{ profile.title }}</p>
      <p class="mt-3 max-w-2xl text-lg text-muted">{{ profile.tagline }}</p>
      <p class="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
        <a :href="`mailto:${profile.links.email}`" class="text-accent hover:underline">{{ profile.links.email }}</a>
        <a :href="profile.links.linkedin" target="_blank" rel="noopener" class="text-accent hover:underline">LinkedIn<span class="sr-only"> (opens in a new tab)</span></a>
        <a :href="profile.links.github" target="_blank" rel="noopener" class="text-accent hover:underline">GitHub<span class="sr-only"> (opens in a new tab)</span></a>
        <a :href="cvHref" download class="inline-flex items-center gap-1.5 text-accent hover:underline"><Icon name="download" :size="13" />CV (PDF)</a>
      </p>
    </header>
    <component :is="part" v-for="(part, i) in parts" :key="i" plain />
  </div>
</template>
