// v-reveal: fades an element in the first time it scrolls into view.
// Optional delay in ms for cascades: v-reveal="120".
// Motion is disabled by CSS when the user prefers reduced motion.
let observer

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )
  }
  return observer
}

export const reveal = {
  mounted(el, binding) {
    if (!('IntersectionObserver' in window)) return
    el.classList.add('reveal')
    if (binding.value) el.style.setProperty("--reveal-delay", `${binding.value}ms`)
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
