<script setup>
// Interactive prompt: type a command, Tab to autocomplete, Up/Down for history.
// Buttons stay the main way to navigate; this is an extra for technical visitors.
import { ref } from 'vue'

const props = defineProps({
  suggestions: { type: Array, required: true },
  response: { type: Array, default: () => [] },
})
const emit = defineEmits(['command', 'dismiss'])

const input = ref(null)
const value = ref('')
const history = []
let cursor = -1

function submit() {
  const text = value.value.trim()
  if (text) history.unshift(text)
  cursor = -1
  value.value = ''
  emit('command', text)
}

function onKey(e) {
  if (e.key === 'Tab' && value.value.trim()) {
    const v = value.value.trim().toLowerCase()
    const match = props.suggestions.find((s) => s.startsWith(v) && s !== v)
    if (match) {
      e.preventDefault()
      value.value = match
    }
  } else if (e.key === 'ArrowUp' && history.length) {
    e.preventDefault()
    cursor = Math.min(cursor + 1, history.length - 1)
    value.value = history[cursor]
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    cursor = Math.max(cursor - 1, -1)
    value.value = cursor === -1 ? '' : history[cursor]
  } else if (e.key === 'Escape') {
    value.value = ''
    emit('dismiss')
    input.value.blur()
  }
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="no-print border-t border-line bg-surface px-4 py-2.5 sm:px-6">
    <div
      v-if="response.length"
      class="mb-2 max-h-72 overflow-y-auto rounded-md border border-line bg-surface-2 px-3 py-2 font-mono text-xs leading-relaxed text-muted"
      role="status"
    >
      <p v-for="(line, i) in response" :key="i" class="whitespace-pre-wrap">{{ line }}</p>
    </div>
    <form class="flex items-center gap-2 font-mono text-sm" @submit.prevent="submit">
      <label for="prompt-input" class="shrink-0 select-none">
        <span class="text-accent">victor@data</span><span class="text-muted">:</span><span class="text-accent-2">~</span><span class="text-muted">$</span>
        <span class="sr-only">Type a command, for example help</span>
      </label>
      <input
        id="prompt-input"
        ref="input"
        v-model="value"
        type="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        enterkeyhint="go"
        placeholder="type help, or click a node"
        class="min-w-0 flex-1 bg-transparent text-fg caret-[var(--accent)] placeholder:text-muted/70 focus:outline-none"
        @keydown="onKey"
      />
      <kbd class="hidden rounded border border-line px-1.5 text-[10px] text-muted sm:inline" aria-hidden="true">/</kbd>
    </form>
  </div>
</template>
