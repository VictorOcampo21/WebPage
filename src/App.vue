<script setup>
// Terminal portfolio shell. Each section is a "command": clicking a node types it,
// clears the screen and prints the section. Hash routes keep Back and shared links working.
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, shallowRef, watch } from 'vue'
import { profile } from './data/profile.js'
import { aliases, sections, views } from './data/terminal.js'
import { navigate, useHashRoute } from './composables/useHashRoute.js'
import { markVisited, useVisited } from './composables/useVisited.js'
import { setTheme } from './composables/useTheme.js'
import { useReducedMotion } from './composables/useReducedMotion.js'
import Icon from './components/Icon.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import PromptLine from './components/terminal/PromptLine.vue'
import StatusBar from './components/terminal/StatusBar.vue'
import HomeView from './views/HomeView.vue'
import AboutView from './views/AboutView.vue'
import ProjectsView from './views/ProjectsView.vue'
import ExperienceView from './views/ExperienceView.vue'
import EducationView from './views/EducationView.vue'
import SkillsView from './views/SkillsView.vue'
import CertificationsView from './views/CertificationsView.vue'
import ContactView from './views/ContactView.vue'
import PlainView from './views/PlainView.vue'

const components = {
  home: HomeView,
  plain: PlainView,
  about: AboutView,
  projects: ProjectsView,
  experience: ExperienceView,
  education: EducationView,
  skills: SkillsView,
  certifications: CertificationsView,
  contact: ContactView,
}

const cvHref = import.meta.env.BASE_URL + profile.cvFile
provide('cvHref', cvHref)

const route = useHashRoute()
const reduced = useReducedMotion()
const { visited, history } = useVisited()

// ---------- Run sequence: type the command, clear, print the output ----------
const shown = shallowRef(null) // route currently printed
const typed = ref('')
const typing = ref(false)
const skipped = ref(false)
const announce = ref('')
const scroller = ref(null)
let timer = null
let firstRun = true

provide('term', { animate: computed(() => !reduced.value), skipped })

const current = computed(() => views[route.value.id])
const sectionIndex = computed(() => sections.findIndex((s) => s.id === route.value.id))
const prev = computed(() => (sectionIndex.value > 0 ? sections[sectionIndex.value - 1] : null))
const next = computed(() => {
  if (route.value.id === 'home') return sections[0]
  if (sectionIndex.value === -1) return null
  return sections[sectionIndex.value + 1] || null
})
const path = computed(() =>
  route.value.id === 'home' ? '' : `/${route.value.id}${route.value.sub ? `/${route.value.sub}` : ''}`,
)

function finish(r) {
  clearInterval(timer)
  timer = null
  typing.value = false
  typed.value = views[r.id].cmd
  shown.value = r
  if (sections.some((s) => s.id === r.id)) markVisited(r.id)
  announce.value = `Showing ${views[r.id].title}`
  nextTick(() => {
    window.scrollTo({ top: 0 })
    // Move focus to the new view, unless the visitor is typing in the prompt
    const typingInPrompt = document.activeElement?.id === 'prompt-input'
    if (!firstRun && !typingInPrompt) document.querySelector('[data-view-heading]')?.focus({ preventScroll: true })
    firstRun = false
  })
}

function run(r) {
  clearInterval(timer)
  skipped.value = false
  const cmd = views[r.id].cmd
  if (reduced.value) return finish(r)
  shown.value = null // clear the screen
  typed.value = ''
  typing.value = true
  const step = Math.max(8, Math.min(22, 420 / cmd.length))
  let i = 0
  timer = setInterval(() => {
    i++
    typed.value = cmd.slice(0, i)
    if (i >= cmd.length) {
      clearInterval(timer)
      timer = setTimeout(() => finish(r), 90)
    }
  }, step)
}

function skip() {
  if (typing.value) finish(route.value)
  skipped.value = true
}

watch(route, (r, old) => {
  // Switching project inside ./projects does not re-run the whole command
  if (old && r.id === old.id && r.id === 'projects' && shown.value?.id === 'projects') {
    shown.value = r
    return
  }
  run(r)
})

// ---------- Prompt commands ----------
const response = ref([])
const prompt = ref(null)
const suggestions = [
  'help', 'map', 'about', 'projects', 'experience', 'education', 'skills', 'certs', 'contact',
  'cv', 'plain', 'next', 'prev', 'history', 'theme light', 'theme dark', 'clear',
  ...profile.projects.map((p) => `projects ${p.id}`),
]

// Each command with a short, plain-English description
const helpEntries = [
  ['about', 'who I am and what I am working on now'],
  ['projects', 'data flows I built: NiFi migration, FactuBot, OftaData, lakehouse'],
  ['experience', 'jobs and what I delivered in each one'],
  ['education', 'university degree'],
  ['skills', 'tools and technologies I use, as JSON'],
  ['certs', 'certifications, with links to verify them'],
  ['contact', 'email, LinkedIn, GitHub and CV'],
  ['cv', 'download my CV (PDF, 1 page)'],
  ['plain', 'everything on one page, easy to read or print'],
  ['map', 'back to the lineage map (home screen)'],
  ['next, prev', 'go to the next or previous section'],
  ['history', 'sections you have already opened'],
  ['theme', 'switch dark / light (theme dark, theme light)'],
]
function helpLines() {
  return [
    'available commands:',
    ...helpEntries.map(([cmd, desc]) => `  ${cmd.padEnd(12)} ${desc}`),
    'keys: 1-7 jump to a section · n / p next / previous · esc map · / type here',
  ]
}

function downloadCv() {
  const a = document.createElement('a')
  a.href = cvHref
  a.download = profile.cvFile
  a.click()
}

function execute(text) {
  const cmd = text.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!cmd) return
  if (cmd === 'help' || cmd === '?') {
    response.value = helpLines()
    return
  }
  response.value = []
  if (cmd === 'next' || cmd === 'n') return next.value && navigate(next.value.id)
  if (cmd === 'prev' || cmd === 'p') return navigate(prev.value ? prev.value.id : 'home')
  if (['cv', 'resume', 'download cv'].includes(cmd)) return downloadCv()
  if (cmd === 'history') {
    response.value = history.value.length
      ? history.value.map((h, i) => `  ${String(i + 1).padStart(2)}  ${h.cmd}`)
      : ['history is empty: open a section from the map']
    return
  }
  if (cmd.startsWith('theme')) {
    const mode = cmd.split(' ')[1]
    if (mode === 'light' || mode === 'dark') return setTheme(mode)
    return setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
  }
  if (cmd.startsWith('projects ')) {
    const id = cmd.slice(9).replace(/\/$/, '')
    if (profile.projects.some((p) => p.id === id)) return navigate('projects', id)
  }
  for (const [id, words] of Object.entries(aliases)) {
    if (words.includes(cmd)) return navigate(id)
  }
  response.value = [`command not found: ${text.trim()}. try 'help'`]
}

function showHelp() {
  response.value = helpLines()
  prompt.value?.focus()
}

// ---------- Keyboard shortcuts (ignored while typing in the prompt) ----------
function onKey(e) {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return
  const t = e.target
  const inField = t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t?.isContentEditable
  if (typing.value && !inField) {
    skip()
    if (e.key !== 'Escape') return
  }
  if (inField) return
  const section = sections.find((s) => s.key === e.key)
  if (section) return navigate(section.id)
  if (e.key === 'n' && next.value) return navigate(next.value.id)
  if (e.key === 'p' && route.value.id !== 'home') return navigate(prev.value ? prev.value.id : 'home')
  if (e.key === 'Escape' && route.value.id !== 'home') return navigate('home')
  if (e.key === '/') {
    e.preventDefault()
    prompt.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  run(route.value)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <a
    href="#main"
    class="sr-only z-50 rounded bg-accent px-4 py-2 font-mono text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    @click.prevent="scroller?.focus()"
  >
    Skip to content
  </a>

  <div class="flex min-h-dvh flex-col">
      <!-- Title bar (sticky) -->
      <header class="no-print sticky top-0 z-30 border-b border-line bg-chrome/95 backdrop-blur">
        <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:px-8">
          <span class="flex gap-1.5" aria-hidden="true">
            <span class="size-3 rounded-full bg-[#ff5f57]/80"></span>
            <span class="size-3 rounded-full bg-[#febc2e]/80"></span>
            <span class="size-3 rounded-full bg-[#28c840]/80"></span>
          </span>
          <button
            v-if="route.id !== 'home'"
            type="button"
            class="inline-flex h-8 shrink-0 items-center gap-1 rounded-md border border-accent/60 px-2.5 font-mono text-sm text-accent transition-colors hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-accent"
            @click="navigate('home')"
          >
            ← map
          </button>
          <p class="min-w-0 flex-1 truncate text-center font-mono text-sm text-muted">victor@data: ~/portfolio{{ path }}</p>
          <div class="flex items-center gap-1.5">
            <a
              v-if="route.id !== 'plain'"
              href="#/plain"
              class="hidden h-8 items-center rounded-md border border-line px-2.5 font-mono text-sm text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent sm:inline-flex"
              title="Show everything on one page"
            >
              --plain
            </a>
            <ThemeToggle />
            <a
              :href="cvHref"
              :download="profile.cvFile"
              class="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 font-mono text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Icon name="download" :size="13" /> cv
            </a>
          </div>
        </div>
      </header>

      <!-- Output -->
      <main
        id="main"
        ref="scroller"
        tabindex="-1"
        class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none sm:px-8 sm:py-8"
        @click="typing && skip()"
      >
        <p class="mb-5 font-mono text-sm break-words">
          <span class="text-accent">victor@data</span><span class="text-muted">:</span><span class="text-accent-2">~/portfolio</span><span class="text-muted">$ </span>
          <span class="text-fg">{{ typed }}</span><span v-if="typing" class="caret" aria-hidden="true"></span>
        </p>

        <template v-if="shown">
          <component :is="components[shown.id]" :key="shown.id" />

          <!-- On the home screen the map is the menu, so no footer navigation there -->
          <div
            v-if="shown.id !== 'home'"
            class="no-print mt-12 flex flex-wrap items-center gap-3 border-t border-dashed border-line pt-5 font-mono text-sm"
          >
            <button
              v-if="shown.id !== 'home'"
              type="button"
              class="rounded border border-line px-3 py-1.5 text-muted transition-colors hover:border-accent hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
              @click="navigate('home')"
            >
              ← map
            </button>
            <button
              v-if="prev"
              type="button"
              class="rounded border border-line px-3 py-1.5 text-muted transition-colors hover:border-accent hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
              @click="navigate(prev.id)"
            >
              prev: {{ prev.label }}
            </button>
            <button
              v-if="next"
              type="button"
              class="rounded border border-accent bg-accent-soft px-3 py-1.5 text-accent transition-colors hover:bg-accent hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-accent"
              @click="navigate(next.id)"
            >
              next: $ {{ next.cmd }} →
            </button>
            <span v-if="!next && shown.id !== 'home' && shown.id !== 'plain'" class="text-muted">end of pipeline</span>
          </div>
        </template>
      </main>

      <div class="sticky bottom-0 z-30">
      <PromptLine ref="prompt" :suggestions="suggestions" :response="response" @command="execute" @dismiss="response = []" />
      <StatusBar
        :current="current"
        :prev="prev"
        :next="next"
        :history="history"
        @navigate="navigate"
        @help="showHelp"
      />
      </div>
  </div>

  <p class="sr-only" aria-live="polite">{{ announce }}</p>
</template>
