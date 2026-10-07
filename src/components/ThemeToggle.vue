<script setup>
// Light/dark toggle. Defaults to the system theme until the visitor picks one.
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Icon from './Icon.vue'

const dark = ref(false)
let media

function apply(value) {
  dark.value = value
  document.documentElement.classList.toggle('dark', value)
}

function toggle() {
  apply(!dark.value)
  try {
    localStorage.setItem('theme', dark.value ? 'dark' : 'light')
  } catch {}
}

function onSystemChange(e) {
  let stored = null
  try {
    stored = localStorage.getItem('theme')
  } catch {}
  if (!stored) apply(e.matches)
}

onMounted(() => {
  dark.value = document.documentElement.classList.contains('dark')
  media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onSystemChange)
})
onBeforeUnmount(() => media?.removeEventListener('change', onSystemChange))
</script>

<template>
  <button
    type="button"
    class="inline-flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    :aria-label="dark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="dark ? 'Light theme' : 'Dark theme'"
    @click="toggle"
  >
    <Icon :name="dark ? 'sun' : 'moon'" :size="16" />
  </button>
</template>
