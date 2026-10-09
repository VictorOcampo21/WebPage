<script setup>
import { inject } from 'vue'
import { profile } from '../data/profile.js'
import { navigate } from '../composables/useHashRoute.js'
import { useVisited } from '../composables/useVisited.js'
import Icon from '../components/Icon.vue'
import OutputStream from '../components/terminal/OutputStream.vue'
import LineageMap from '../components/terminal/LineageMap.vue'
import MapTree from '../components/terminal/MapTree.vue'

const { visited } = useVisited()
const cvHref = inject('cvHref')
const btn =
  'inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-md border px-3.5 py-2 text-left font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
// Shell comment for a command: dimmed, on its own line under the command
const comment = 'basis-full text-xs text-muted'
</script>

<template>
  <OutputStream>
    <section aria-label="whoami" class="lg:flex lg:items-start lg:justify-between lg:gap-10">
      <div class="min-w-0">
        <h1 data-view-heading tabindex="-1" class="font-mono text-3xl font-semibold tracking-tight text-fg outline-none sm:text-4xl">
          {{ profile.name }}
        </h1>
        <p class="mt-2 font-mono text-base text-accent sm:text-lg">{{ profile.title }}</p>
        <p class="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{{ profile.tagline }}</p>
        <p class="mt-3 font-mono text-sm text-muted">
          <span class="text-accent" aria-hidden="true">●&nbsp;</span><span class="text-fg">{{ profile.status.service }}</span>:
          <span class="text-accent">{{ profile.status.state }}</span> · {{ profile.status.text }}
        </p>
      </div>

      <div class="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:mt-1 lg:w-80 lg:shrink-0 lg:flex-col lg:flex-nowrap">
        <button type="button" :class="[btn, 'border-accent bg-accent font-semibold text-accent-fg hover:opacity-90']" @click="navigate('projects')">
          ./projects --flows <span aria-hidden="true">★</span>
        </button>
        <a :href="cvHref" :download="profile.cvFile" :class="[btn, 'border-line text-fg hover:border-accent hover:text-accent']">
          <Icon name="download" :size="14" /> download cv<span :class="comment"># pdf, 1 page</span>
        </a>
        <button type="button" :class="[btn, 'border-line text-fg hover:border-accent hover:text-accent']" @click="navigate('contact')">
          ./contact.sh<span :class="comment"># email · linkedin · github</span>
        </button>
        <button type="button" :class="[btn, 'border-line text-fg hover:border-accent hover:text-accent']" @click="navigate('plain')">
          ./portfolio --plain<span :class="comment"># everything on one page</span>
        </button>
      </div>
    </section>

    <section aria-labelledby="map-title">
      <h2 id="map-title" class="font-mono text-sm text-muted lg:sr-only">
        <span class="text-accent" aria-hidden="true">## </span>map <span class="text-muted/80">— pick a node to run it</span>
      </h2>
      <div class="hidden lg:block">
        <LineageMap
          :visited="visited"
          :name="profile.name"
          :role="profile.role"
          :location="profile.location"
          @navigate="navigate"
        />
      </div>
      <div class="mt-4 lg:hidden">
        <MapTree :visited="visited" :name="profile.name" @navigate="navigate" />
      </div>
    </section>

    <p class="font-mono text-xs text-muted">
      tip: press <kbd class="text-fg">1</kbd>–<kbd class="text-fg">7</kbd> to jump, <kbd class="text-fg">n</kbd>/<kbd class="text-fg">p</kbd> for
      next and previous, <kbd class="text-fg">/</kbd> to type a command, or open the
      <a href="#/plain" class="text-accent underline underline-offset-2">plain document</a>.
    </p>
  </OutputStream>
</template>
