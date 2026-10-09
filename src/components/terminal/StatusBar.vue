<script setup>
// Bottom status line (tmux/vim style): current view, `$ history` of visited sections, previous/next.
// Fixed parts never shrink; history is a compact button that opens the full numbered list.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  current: { type: Object, required: true },
  prev: { type: Object, default: null },
  next: { type: Object, default: null },
  history: { type: Array, required: true },
})
const emit = defineEmits(['navigate', 'help'])

const open = ref(false)
const root = ref(null)
const toggleBtn = ref(null)
const recent = computed(() => props.history.slice(-2).map((h, i, arr) => ({ ...h, n: props.history.length - arr.length + i + 1 })))

function go(id) {
  open.value = false
  emit('navigate', id)
}
function onDocClick(e) {
  if (open.value && !root.value?.contains(e.target)) open.value = false
}
function onKey(e) {
  if (e.key === 'Escape' && open.value) {
    e.preventDefault() // so the global Esc (back to map) does not also fire
    open.value = false
    toggleBtn.value?.focus()
  }
}
onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})

const item =
  'rounded px-2 py-1 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-accent'
</script>

<template>
  <nav ref="root" aria-label="Status and navigation" class="no-print relative border-t border-line bg-chrome">
    <!-- Full history list (opens above the bar) -->
    <div
      v-if="open && history.length"
      id="history-list"
      class="absolute right-0 bottom-full left-0 border-t border-line bg-chrome/95 backdrop-blur"
    >
      <div class="mx-auto max-w-6xl px-4 py-3 font-mono text-sm sm:px-8">
        <p class="text-muted">$ history</p>
        <ol class="mt-2 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="(h, i) in history" :key="h.id">
            <button
              type="button"
              class="flex w-full gap-3 rounded px-2 py-1.5 text-left text-fg transition-colors hover:bg-surface-2 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              @click="go(h.id)"
            >
              <span class="w-5 text-right text-muted">{{ i + 1 }}</span>{{ h.cmd }}
            </button>
          </li>
        </ol>
      </div>
    </div>

    <div class="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 font-mono text-[13px] sm:px-8">
      <!-- Fixed left: never shrinks -->
      <button
        type="button"
        class="hidden shrink-0 rounded bg-accent px-2 py-0.5 font-semibold text-accent-fg sm:inline"
        @click="emit('navigate', 'home')"
      >
        map
      </button>
      <span class="hidden shrink-0 whitespace-nowrap text-fg sm:inline">
        {{ current.label }}{{ current.featured ? ' ★' : '' }}
      </span>

      <!-- History: compact, takes only the space left -->
      <div v-if="history.length" class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden sm:ml-2">
        <button
          ref="toggleBtn"
          type="button"
          :class="[item, 'shrink-0 text-muted hover:bg-surface-2 hover:text-fg', { 'bg-surface-2 text-fg': open }]"
          :aria-expanded="open"
          aria-controls="history-list"
          @click.stop="open = !open"
        >
          $ history <span class="text-accent">{{ history.length }}</span>
        </button>
        <span v-if="history.length > 2" class="hidden shrink-0 text-muted/70 xl:inline" aria-hidden="true">…</span>
        <button
          v-for="h in recent"
          :key="h.id"
          type="button"
          :class="[item, 'hidden min-w-0 truncate text-muted hover:text-accent xl:inline']"
          @click="go(h.id)"
        >
          <span class="text-muted/70">{{ h.n }}</span>&nbsp; {{ h.cmd }}
        </button>
      </div>
      <div v-else class="flex-1"></div>

      <!-- Fixed right: never shrinks or wraps -->
      <div class="flex shrink-0 items-center gap-1">
        <button
          v-if="prev"
          type="button"
          :class="[item, 'text-muted hover:bg-surface-2 hover:text-fg']"
          @click="emit('navigate', prev.id)"
        >
          ← <span class="hidden md:inline">{{ prev.label }}</span><span class="sr-only md:hidden">previous: {{ prev.label }}</span>
        </button>
        <button
          v-if="next"
          type="button"
          :class="[item, 'text-accent hover:bg-accent-soft']"
          @click="emit('navigate', next.id)"
        >
          next: {{ next.label }} →
        </button>
        <button
          type="button"
          :class="[item, 'hidden text-muted hover:bg-surface-2 hover:text-fg sm:inline']"
          @click="emit('help')"
        >
          ? help
        </button>
      </div>
    </div>
  </nav>
</template>
