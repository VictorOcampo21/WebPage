<script setup>
import { inject } from 'vue'
import { profile } from '../data/profile.js'
import { navigate } from '../composables/useHashRoute.js'
import { useVisited } from '../composables/useVisited.js'
import Icon from '../components/Icon.vue'
import OutputStream from '../components/terminal/OutputStream.vue'
import LineageMap from '../components/terminal/LineageMap.vue'
import MapTree from '../components/terminal/MapTree.vue'

const { visited, explored, total } = useVisited()
const cvHref = inject('cvHref')
const btn =
  'inline-flex items-center gap-2 rounded-md border px-3.5 py-2 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
</script>

<template>
  <OutputStream>
    <section aria-label="whoami" class="lg:flex lg:items-end lg:justify-between lg:gap-10">
      <div>
        <h1 data-view-heading tabindex="-1" class="font-mono text-3xl font-semibold tracking-tight text-fg outline-none sm:text-4xl">
          {{ profile.name }}
        </h1>
        <p class="mt-2 font-mono text-base text-accent sm:text-lg">{{ profile.title }}</p>
        <p class="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{{ profile.tagline }}</p>
        <p class="mt-2 font-mono text-sm text-muted">
          <span class="text-accent" aria-hidden="true">●</span> {{ profile.location }} · open to Data Engineer opportunities
          (remote, hybrid or on-site)
        </p>
      </div>
      <div class="mt-6 flex flex-wrap gap-2.5 lg:mt-0 lg:shrink-0 lg:flex-col lg:items-stretch">
        <button type="button" :class="[btn, 'border-accent bg-accent font-semibold text-accent-fg hover:opacity-90']" @click="navigate('projects')">
          ./projects --flows <span aria-hidden="true">★</span>
        </button>
        <a :href="cvHref" download :class="[btn, 'border-line text-fg hover:border-accent hover:text-accent']">
          <Icon name="download" :size="14" /> download cv
        </a>
        <button type="button" :class="[btn, 'border-line text-fg hover:border-accent hover:text-accent']" @click="navigate('contact')">
          ./contact.sh
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
          :explored="explored"
          :total="total"
          :name="profile.name"
          :role="profile.role"
          :location="profile.location"
          @navigate="navigate"
        />
      </div>
      <div class="mt-4 lg:hidden">
        <MapTree :visited="visited" :name="profile.name" @navigate="navigate" />
        <p class="mt-3 font-mono text-xs text-muted">{{ explored }}/{{ total }} explored</p>
      </div>
    </section>

    <p class="font-mono text-xs text-muted">
      tip: press <kbd class="text-fg">1</kbd>–<kbd class="text-fg">7</kbd> to jump, <kbd class="text-fg">n</kbd>/<kbd class="text-fg">p</kbd> for
      next and previous, <kbd class="text-fg">/</kbd> to type a command, or open the
      <a href="#/plain" class="text-accent underline underline-offset-2">plain document</a>.
    </p>
  </OutputStream>
</template>
