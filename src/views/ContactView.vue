<script setup>
import { inject, ref } from 'vue'
import { profile } from '../data/profile.js'
import Icon from '../components/Icon.vue'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

defineProps({ plain: { type: Boolean, default: false } })
const cvHref = inject('cvHref')
const copied = ref(false)

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.links.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.location.href = `mailto:${profile.links.email}`
  }
}

const rows = [
  { key: 'email', label: profile.links.email, href: `mailto:${profile.links.email}`, icon: 'mail' },
  { key: 'linkedin', label: profile.links.linkedin.replace('https://www.', ''), href: profile.links.linkedin, icon: 'linkedin', external: true },
  { key: 'github', label: profile.links.github.replace('https://', ''), href: profile.links.github, icon: 'github', external: true },
]
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="contact" :plain="plain" />
    <p class="max-w-3xl text-lg leading-relaxed text-fg">{{ profile.contact.text }}</p>

    <dl class="max-w-4xl space-y-3 font-mono text-sm">
      <div v-for="r in rows" :key="r.key" class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
        <dt class="w-20 shrink-0 text-muted">{{ r.key }}</dt>
        <dd class="flex flex-wrap items-center gap-3">
          <a
            :href="r.href"
            :target="r.external ? '_blank' : undefined"
            :rel="r.external ? 'noopener' : undefined"
            class="inline-flex items-center gap-2 break-all text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
          >
            <Icon :name="r.icon" :size="14" />{{ r.label }}<span v-if="r.external" class="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            v-if="r.key === 'email'"
            type="button"
            class="no-print rounded border border-line px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
            @click="copyEmail"
          >
            {{ copied ? 'copied' : 'copy' }}<span class="sr-only"> email address</span>
          </button>
          <span class="sr-only" aria-live="polite">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
        </dd>
      </div>
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
        <dt class="w-20 shrink-0 text-muted">cv</dt>
        <dd>
          <a :href="cvHref" :download="profile.cvFile" class="inline-flex items-center gap-2 text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent">
            <Icon name="download" :size="14" />{{ profile.cvFile }}
          </a>
        </dd>
      </div>
    </dl>

    <p class="font-mono text-xs text-muted" aria-hidden="true">exit 0</p>
  </OutputStream>
</template>
