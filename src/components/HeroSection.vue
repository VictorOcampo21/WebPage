<script setup>
import Icon from './Icon.vue'
import HeroPipeline from './HeroPipeline.vue'

defineProps({
  profile: { type: Object, required: true },
  cvHref: { type: String, required: true },
})

const primaryBtn =
  'inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/25 transition hover:-translate-y-0.5 hover:shadow-accent/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const secondaryBtn =
  'group inline-flex items-center gap-2 rounded-full px-3 py-3 sm:px-5 text-sm font-bold text-fg transition hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const textLink =
  'inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
</script>

<template>
  <section id="top" aria-labelledby="hero-name" class="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
    <!-- Backdrop: dot matrix (same language as the flow diagrams) and a single light beam -->
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <div class="hero-dots absolute inset-0"></div>
      <div class="hero-beam absolute -top-1/3 right-[-10%] h-[140%] w-[55%]"></div>
    </div>

    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <div class="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p v-reveal class="flex items-center gap-3 text-sm font-bold tracking-wide text-accent">
            <span class="h-px w-10 bg-gradient-to-r from-accent to-accent-2" aria-hidden="true"></span>
            {{ profile.eyebrow }}
          </p>

          <h1 id="hero-name" v-reveal="80" class="mt-6 text-5xl leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-[4.25rem]">
            <span class="block text-fg">{{ profile.firstName }}</span>
            <span class="hero-gradient-text block">{{ profile.lastName }}</span>
          </h1>

          <p v-reveal="160" class="mt-6 border-l-2 border-accent-2 pl-4 text-lg leading-snug font-semibold sm:text-xl">
            <span class="sr-only">{{ profile.title }}</span>
            <span aria-hidden="true">
              <span
                v-for="(part, i) in profile.title.split(' / ')"
                :key="part"
                :class="['block', i === 0 ? 'text-fg' : 'text-muted']"
              >
                {{ part }}
              </span>
            </span>
          </p>

          <p v-reveal="220" class="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {{ profile.tagline }}
          </p>

          <ul v-reveal="280" class="mt-6 flex flex-wrap gap-2" aria-label="Core stack">
            <li
              v-for="tech in profile.heroStack"
              :key="tech"
              class="inline-flex items-center gap-2 rounded-lg border border-line bg-surface/80 px-3 py-1.5 text-sm font-semibold text-fg"
            >
              <span class="size-1.5 rounded-sm bg-accent-2" aria-hidden="true"></span>
              {{ tech }}
            </li>
          </ul>

          <div v-reveal="340" class="mt-9 flex flex-wrap items-center gap-2">
            <a :href="cvHref" download :class="primaryBtn">
              <Icon name="download" />
              Download CV
            </a>
            <a href="#projects" :class="secondaryBtn">
              See how I design data flows
              <span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </div>

          <div v-reveal="400" class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a :href="profile.links.linkedin" target="_blank" rel="noopener" :class="textLink">
              <Icon name="linkedin" :size="15" />
              LinkedIn<span class="sr-only"> (opens in a new tab)</span>
            </a>
            <a :href="profile.links.github" target="_blank" rel="noopener" :class="textLink">
              <Icon name="github" :size="15" />
              GitHub<span class="sr-only"> (opens in a new tab)</span>
            </a>
            <a :href="`mailto:${profile.links.email}`" :class="textLink">
              <Icon name="mail" :size="15" />
              {{ profile.links.email }}
            </a>
          </div>
        </div>

        <div v-reveal="250" class="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div class="rounded-3xl border border-line bg-surface/70 p-3 shadow-2xl shadow-accent/10 backdrop-blur-sm sm:p-5">
            <div class="mb-3 flex items-center justify-between px-1" aria-hidden="true">
              <span class="flex gap-1.5">
                <span class="size-2.5 rounded-full bg-line"></span>
                <span class="size-2.5 rounded-full bg-line"></span>
                <span class="size-2.5 rounded-full bg-line"></span>
              </span>
              <span class="font-mono text-[11px] text-muted">how my pipelines are shaped</span>
            </div>
            <HeroPipeline />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
