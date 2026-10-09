import { computed, ref } from 'vue'
import { sections } from '../data/terminal.js'

// Which views (and projects) this visitor already opened. Stored per browser; safe if storage is blocked.
const KEY = 'visited'
function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'))
  } catch {
    return new Set()
  }
}

const visited = ref(load())

export function markVisited(id) {
  if (visited.value.has(id)) return
  visited.value = new Set([...visited.value, id])
  try {
    localStorage.setItem(KEY, JSON.stringify([...visited.value]))
  } catch {}
}

export function useVisited() {
  const explored = computed(() => sections.filter((s) => visited.value.has(s.id)).length)
  // Sections in the order they were first opened (a Set keeps insertion order), for `$ history`
  const history = computed(() => [...visited.value].map((id) => sections.find((s) => s.id === id)).filter(Boolean))
  return { visited, explored, history, total: sections.length }
}
