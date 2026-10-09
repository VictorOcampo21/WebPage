import { ref } from 'vue'
import { views } from '../data/terminal.js'

// Minimal hash router: #/ -> home, #/projects, #/projects/factubot.
// Shared state so every component sees the same route; the browser Back button works.
function parse(hash) {
  const [id = '', sub = null] = hash.replace(/^#\/?/, '').split('/')
  return views[id] ? { id, sub: sub || null } : { id: 'home', sub: null }
}

const route = ref(parse(window.location.hash))
window.addEventListener('hashchange', () => (route.value = parse(window.location.hash)))

export function navigate(id, sub = null) {
  const target = id === 'home' ? '#/' : `#/${id}${sub ? `/${sub}` : ''}`
  if (window.location.hash === target || (id === 'home' && !window.location.hash)) {
    route.value = parse(target) // re-run the same view
    return
  }
  window.location.hash = target
}

export function useHashRoute() {
  return route
}
