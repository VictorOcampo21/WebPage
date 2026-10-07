import { onBeforeUnmount, onMounted, ref } from 'vue'

// True when the visitor asked the OS to reduce motion.
export function useReducedMotion() {
  const reduced = ref(false)
  let media
  const update = () => (reduced.value = media.matches)
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    media.addEventListener('change', update)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', update))
  return reduced
}
