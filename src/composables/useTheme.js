import { ref } from 'vue'

// Dark terminal by default; light "paper" theme only if the visitor chose it.
const dark = ref(document.documentElement.classList.contains('dark'))

export function setTheme(mode) {
  dark.value = mode === 'dark'
  document.documentElement.classList.toggle('dark', dark.value)
  try {
    localStorage.setItem('theme', mode)
  } catch {}
}

export function useTheme() {
  return { dark, toggle: () => setTheme(dark.value ? 'light' : 'dark') }
}
