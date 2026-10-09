<script setup>
// Light/dark toggle. The terminal opens dark; the choice is remembered per browser.
import Icon from './Icon.vue'
import { useTheme } from '../composables/useTheme.js'

const { dark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="inline-flex h-7 items-center gap-1.5 rounded-md border border-line px-2 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <Icon :name="dark ? 'sun' : 'moon'" :size="12" />
    <span class="hidden sm:inline">{{ dark ? 'light' : 'dark' }}</span>
  </button>
</template>
