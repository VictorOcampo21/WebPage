<script setup>
// Floating pill navigation: scroll spy with a sliding highlight and a mobile menu.
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Icon from './Icon.vue'
import ThemeToggle from './ThemeToggle.vue'

const props = defineProps({
  sections: { type: Array, required: true },
  cvHref: { type: String, required: true },
  name: { type: String, required: true },
})

const active = ref(null)
const scrolled = ref(false)
// The hero is always dark, so the nav uses the dark palette while it sits over it.
const overDarkZone = ref(true)
const menuOpen = ref(false)
const pill = ref({ left: 0, width: 0, visible: false })
const linkEls = ref({})
const menuButton = ref(null)
const menuPanel = ref(null)

let spy
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 24
    const zone = document.querySelector('[data-dark-zone]')
    overDarkZone.value = zone ? zone.getBoundingClientRect().bottom > 44 : false
    if (window.scrollY < 200) active.value = null
    ticking = false
  })
}

function movePill() {
  const el = active.value && linkEls.value[active.value]
  if (!el) {
    pill.value = { ...pill.value, visible: false }
    return
  }
  pill.value = { left: el.offsetLeft, width: el.offsetWidth, visible: true }
}

watch(active, () => nextTick(movePill))

function onResize() {
  movePill()
  onScroll()
}

async function openMenu() {
  menuOpen.value = true
  await nextTick()
  menuPanel.value?.querySelector('a')?.focus()
}
function closeMenu(returnFocus = true) {
  menuOpen.value = false
  if (returnFocus) menuButton.value?.focus()
}
function onKey(e) {
  if (e.key === 'Escape' && menuOpen.value) closeMenu()
}

onMounted(() => {
  spy = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) active.value = entry.target.id
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )
  for (const s of props.sections) {
    const el = document.getElementById(s.id)
    if (el) spy.observe(el)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKey)
  onScroll()
})
onBeforeUnmount(() => {
  spy?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header
    :class="['pointer-events-none fixed inset-x-0 top-3 z-50 px-3 text-fg sm:top-4', { 'dark [color-scheme:dark]': overDarkZone }]"
  >
    <div
      :class="[
        'pointer-events-auto mx-auto flex w-full max-w-fit items-center gap-1 rounded-full border p-1.5 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300',
        scrolled || menuOpen
          ? 'border-line bg-surface/80 shadow-lg shadow-black/5 dark:shadow-black/30'
          : 'border-line/60 bg-surface/40',
      ]"
    >
      <a
        href="#top"
        class="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 text-sm font-bold text-fg focus-visible:outline-2 focus-visible:outline-accent"
      >
        <!-- Brand mark: two connected nodes -->
        <span class="grid size-8 place-items-center rounded-full bg-accent text-accent-fg" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="4.5" cy="9" r="2.5" fill="currentColor" />
            <circle cx="13.5" cy="9" r="2.5" stroke="currentColor" stroke-width="1.6" />
            <path d="M7 9 H10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
        <span class="whitespace-nowrap">{{ name }}</span>
      </a>

      <span class="mx-1 hidden h-5 w-px bg-line lg:block" aria-hidden="true"></span>

      <nav aria-label="Sections" class="relative hidden lg:block">
        <span
          class="absolute inset-y-0 rounded-full bg-accent-soft transition-all duration-300 ease-out"
          :style="{ left: `${pill.left}px`, width: `${pill.width}px`, opacity: pill.visible ? 1 : 0 }"
          aria-hidden="true"
        ></span>
        <ul class="relative flex items-center">
          <li v-for="s in sections" :key="s.id">
            <a
              :ref="(el) => (linkEls[s.id] = el)"
              :href="`#${s.id}`"
              :aria-current="active === s.id ? 'true' : undefined"
              :class="[
                'block rounded-full px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                active === s.id ? 'text-accent' : 'text-muted hover:text-fg',
              ]"
            >
              {{ s.label }}
            </a>
          </li>
        </ul>
      </nav>

      <span class="mx-1 hidden h-5 w-px bg-line lg:block" aria-hidden="true"></span>

      <ThemeToggle />
      <button
        ref="menuButton"
        type="button"
        class="inline-flex size-10 items-center justify-center rounded-full text-fg focus-visible:outline-2 focus-visible:outline-accent lg:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen ? closeMenu() : openMenu()"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            :d="menuOpen ? 'M4 4 L14 14 M14 4 L4 14' : 'M2 6 H16 M2 12 H16'"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <nav
        v-if="menuOpen"
        id="mobile-menu"
        ref="menuPanel"
        aria-label="Sections"
        class="pointer-events-auto mx-auto mt-2 max-w-sm origin-top rounded-3xl border border-line bg-surface/95 p-3 shadow-xl backdrop-blur-md lg:hidden"
      >
        <ul class="space-y-1">
          <li v-for="(s, i) in sections" :key="s.id">
            <a
              :href="`#${s.id}`"
              :aria-current="active === s.id ? 'true' : undefined"
              :class="[
                'flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-semibold',
                active === s.id ? 'bg-accent-soft text-accent' : 'text-fg',
              ]"
              @click="closeMenu(false)"
            >
              <span class="font-mono text-xs text-muted">{{ String(i + 1).padStart(2, '0') }}</span>
              {{ s.label }}
            </a>
          </li>
        </ul>
        <a
          :href="cvHref"
          download
          class="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-bold text-accent-fg"
        >
          <Icon name="download" />
          Download CV
        </a>
      </nav>
    </Transition>
  </header>
</template>
