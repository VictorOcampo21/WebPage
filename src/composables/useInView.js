import { onBeforeUnmount, onMounted, ref } from 'vue'

// Reactive "is this element on screen?" flag. Used to start and pause animations.
export function useInView(target, { once = false, rootMargin = '0px', threshold = 0 } = {}) {
  const inView = ref(false)
  let observer
  onMounted(() => {
    if (!('IntersectionObserver' in window) || !target.value) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(
      ([entry]) => {
        inView.value = entry.isIntersecting
        if (once && entry.isIntersecting) observer.disconnect()
      },
      { rootMargin, threshold },
    )
    observer.observe(target.value.$el ?? target.value)
  })
  onBeforeUnmount(() => observer?.disconnect())
  return inView
}
