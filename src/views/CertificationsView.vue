<script setup>
import { profile } from '../data/profile.js'
import Icon from '../components/Icon.vue'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

defineProps({ plain: { type: Boolean, default: false } })
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="certifications" :plain="plain" />
    <p class="font-mono text-xs text-muted">total {{ profile.certifications.length }}</p>

    <ul class="max-w-4xl divide-y divide-line rounded-lg border border-line">
      <li v-for="c in profile.certifications" :key="c.name" class="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-6">
        <span class="hidden font-mono text-xs text-muted md:inline" aria-hidden="true">-r--r--r--</span>
        <span class="w-20 shrink-0 font-mono text-xs text-accent-2">{{ c.date }}</span>
        <span class="flex-1">
          <span class="block font-semibold text-fg">{{ c.name }}</span>
          <span class="block font-mono text-xs text-muted">{{ c.issuer }}</span>
        </span>
        <a
          :href="c.url"
          target="_blank"
          rel="noopener"
          class="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-line px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:border-accent sm:self-center focus-visible:outline-2 focus-visible:outline-accent"
        >
          verify <Icon name="external" :size="11" /><span class="sr-only"> {{ c.name }} (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  </OutputStream>
</template>
