<script setup>
import { ref } from 'vue'
import { profile } from './data/profile.js'
import Icon from './components/Icon.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import MarqueeBand from './components/MarqueeBand.vue'
import SectionHeading from './components/SectionHeading.vue'
import SpotlightCard from './components/SpotlightCard.vue'
import ProjectCard from './components/ProjectCard.vue'
import StatCounter from './components/StatCounter.vue'

const cvHref = import.meta.env.BASE_URL + profile.cvFile
const year = new Date().getFullYear()

const sections = [
  { id: 'about', label: 'About', title: 'From source systems to the dashboard' },
  { id: 'experience', label: 'Experience', title: 'Five years, from full stack to data' },
  { id: 'education', label: 'Education', title: 'Academic background' },
  { id: 'projects', label: 'Projects', title: 'How I design data flows' },
  { id: 'skills', label: 'Skills', title: 'Tools I work with' },
  { id: 'certifications', label: 'Certifications', title: 'Verified credentials' },
  { id: 'contact', label: 'Contact', title: "Let's talk data." },
]
const sec = Object.fromEntries(sections.map((s, i) => [s.id, { ...s, index: i + 1 }]))

// Bold a leading "Name:" in bullets such as "FactuBot: built ..."
function splitLead(text) {
  const m = text.match(/^([A-Z][A-Za-z]+): (.*)$/)
  return m ? { lead: m[1], rest: m[2] } : { lead: null, rest: text }
}

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

const btn =
  'inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-bold text-fg transition hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
const primaryBtn =
  'inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-accent-fg shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
</script>

<template>
  <a
    href="#main"
    class="sr-only z-[60] rounded-md bg-accent px-4 py-2 font-semibold text-accent-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
  >
    Skip to content
  </a>

  <NavBar :sections="sections" :cv-href="cvHref" :name="profile.name" />

  <main id="main">
    <!-- Hero and tech band always use the dark palette, in both themes -->
    <div data-dark-zone class="dark bg-bg text-fg [color-scheme:dark]">
      <HeroSection :profile="profile" :cv-href="cvHref" />
      <MarqueeBand :items="profile.marquee" />
    </div>

    <div class="mx-auto max-w-6xl px-5 sm:px-8">
      <!-- 01 About -->
      <section id="about" :aria-labelledby="`${sec.about.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading :id="`${sec.about.id}-h`" :index="sec.about.index" :label="sec.about.label" :title="sec.about.title" />
        <div class="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div class="space-y-5 text-lg leading-relaxed text-muted">
            <p v-for="(p, i) in profile.about" :key="i" v-reveal="i * 80" :class="i === 0 ? 'text-xl text-fg' : ''">
              {{ p }}
            </p>
          </div>
          <div class="space-y-5">
            <div v-reveal="150">
              <SpotlightCard class="p-6">
                <p class="text-xs font-bold tracking-wider text-accent-2 uppercase">By the numbers</p>
                <ul class="mt-5 grid grid-cols-2 gap-x-5 gap-y-6">
                  <li v-for="s in profile.stats" :key="s.label">
                    <StatCounter :value="s.value" :suffix="s.suffix" :label="s.label" />
                  </li>
                </ul>
              </SpotlightCard>
            </div>
            <div v-reveal="250">
            <SpotlightCard class="p-6">
              <p class="flex items-center gap-2 text-xs font-bold tracking-wider text-accent-2 uppercase">
                <span class="size-2 rounded-sm bg-accent-2" aria-hidden="true"></span>
                Now
              </p>
              <ul class="mt-4 space-y-4">
                <li v-for="(item, i) in profile.now" :key="i" class="flex gap-3 leading-relaxed text-fg">
                  <span class="mt-1 font-mono text-xs text-muted" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      <!-- 02 Experience -->
      <section id="experience" :aria-labelledby="`${sec.experience.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading
          :id="`${sec.experience.id}-h`"
          :index="sec.experience.index"
          :label="sec.experience.label"
          :title="sec.experience.title"
        />
        <div class="relative pl-8 sm:pl-10">
          <span class="absolute top-2 bottom-2 left-[5px] w-px bg-line" aria-hidden="true"></span>
          <span
            class="timeline-fill absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-accent to-accent-2"
            aria-hidden="true"
          ></span>
          <ol>
          <li v-for="job in profile.experience" :key="job.company + job.dates" v-reveal class="relative pb-8 last:pb-0">
            <span
              class="absolute top-6 -left-8 size-[11px] rounded-full border-2 border-accent bg-bg ring-4 ring-bg sm:-left-10"
              aria-hidden="true"
            ></span>
            <SpotlightCard class="p-5 sm:p-7">
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 class="text-lg font-bold text-fg sm:text-xl">
                  {{ job.title }} <span class="font-semibold text-accent">· {{ job.company }}</span>
                </h3>
                <p class="font-mono text-xs font-medium tracking-wide text-muted uppercase">
                  {{ job.dates }} · {{ job.location }}
                </p>
              </div>
              <ul class="mt-4 space-y-2.5">
                <li v-for="(b, i) in job.bullets" :key="i" class="flex gap-3 leading-relaxed text-muted">
                  <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-2/70" aria-hidden="true"></span>
                  <span>
                    <strong v-if="splitLead(b).lead" class="font-semibold text-fg">{{ splitLead(b).lead }}:</strong>
                    {{ splitLead(b).rest }}
                  </span>
                </li>
              </ul>
              <ul class="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
                <li
                  v-for="t in job.tags"
                  :key="t"
                  class="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-xs font-medium text-accent"
                >
                  {{ t }}
                </li>
              </ul>
            </SpotlightCard>
          </li>
          </ol>
        </div>

      </section>

      <!-- 03 Education -->
      <section id="education" :aria-labelledby="`${sec.education.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading
          :id="`${sec.education.id}-h`"
          :index="sec.education.index"
          :label="sec.education.label"
          :title="sec.education.title"
        />
        <div v-reveal>
          <SpotlightCard class="relative overflow-hidden p-6 sm:p-9">
            <span
              class="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-accent to-accent-2"
              aria-hidden="true"
            ></span>
            <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
              <span
                class="grid size-16 shrink-0 place-items-center rounded-2xl border border-accent/30 bg-accent-soft text-accent"
                aria-hidden="true"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
                  <path d="M2 9.5 12 5l10 4.5L12 14 2 9.5Z" />
                  <path d="M6 11.3v4.2c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.2" />
                  <path d="M22 9.5v5" />
                </svg>
              </span>
              <div class="flex-1">
                <p class="text-xs font-bold tracking-wider text-accent-2 uppercase">Bachelor's degree</p>
                <h3 class="mt-2 text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
                  {{ profile.education.degree.replace("Bachelor's Degree in ", '') }}
                </h3>
                <p class="mt-1.5 text-muted">{{ profile.education.school }} · {{ profile.education.location }}</p>
              </div>
              <p
                class="self-start rounded-full border border-line bg-surface-2 px-3.5 py-1.5 font-mono text-xs font-medium text-muted sm:self-center"
              >
                {{ profile.education.dates }}
              </p>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <!-- 04 Projects -->
      <section id="projects" :aria-labelledby="`${sec.projects.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading
          :id="`${sec.projects.id}-h`"
          :index="sec.projects.index"
          :label="sec.projects.label"
          :title="sec.projects.title"
        />
        <p v-reveal class="-mt-4 mb-10 max-w-3xl text-lg leading-relaxed text-muted">{{ profile.projectsIntro }}</p>
        <div class="grid gap-8 lg:grid-cols-2">
          <div v-for="(p, i) in profile.projects" :key="p.id" v-reveal="(i % 2) * 100">
            <ProjectCard :project="p" class="h-full" />
          </div>
        </div>
        <div v-reveal class="mt-8">
          <SpotlightCard as="article" class="p-6 sm:p-7">
            <h3 class="text-lg font-bold text-fg">{{ profile.otherWork.title }}</h3>
            <ul class="mt-4 grid gap-4 md:grid-cols-2">
              <li v-for="(item, i) in profile.otherWork.items" :key="i" class="flex gap-3 leading-relaxed text-muted">
                <span class="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden="true"></span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </SpotlightCard>
        </div>
      </section>

      <!-- 05 Skills -->
      <section id="skills" :aria-labelledby="`${sec.skills.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading :id="`${sec.skills.id}-h`" :index="sec.skills.index" :label="sec.skills.label" :title="sec.skills.title" />
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="(g, i) in profile.skills" :key="g.group" v-reveal="(i % 3) * 90">
            <SpotlightCard class="h-full p-6">
              <h3 class="flex items-center gap-2.5 text-sm font-bold text-fg">
                <span class="font-mono text-xs text-accent-2" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
                {{ g.group }}
              </h3>
              <ul class="mt-4 flex flex-wrap gap-2">
                <li
                  v-for="s in g.items"
                  :key="s"
                  class="rounded-md border border-line bg-surface-2 px-2.5 py-1 text-sm font-medium text-fg transition hover:-translate-y-0.5 hover:border-accent/50"
                >
                  {{ s }}
                </li>
              </ul>
            </SpotlightCard>
          </div>
        </div>
        <div v-reveal class="mt-5">
          <div
            class="flex flex-col gap-4 rounded-2xl border border-dashed border-accent/40 bg-accent-soft/40 p-6 sm:flex-row sm:items-center"
          >
            <div class="sm:w-56">
              <h3 class="flex items-center gap-2.5 text-sm font-bold text-fg">
                <span class="size-2 rounded-sm bg-accent-2" aria-hidden="true"></span>
                In training
              </h3>
              <p class="mt-1 text-sm text-muted">Currently training, not yet in production work.</p>
            </div>
            <ul class="flex flex-wrap gap-2">
              <li
                v-for="t in profile.training"
                :key="t"
                class="rounded-md border border-dashed border-accent/50 px-2.5 py-1 text-sm font-medium text-accent"
              >
                {{ t }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 06 Certifications -->
      <section id="certifications" :aria-labelledby="`${sec.certifications.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading
          :id="`${sec.certifications.id}-h`"
          :index="sec.certifications.index"
          :label="sec.certifications.label"
          :title="sec.certifications.title"
        />
        <ul class="grid gap-5 md:grid-cols-3">
          <li v-for="(c, i) in profile.certifications" :key="c.name" v-reveal="i * 90">
            <SpotlightCard
              as="a"
              :href="c.url"
              target="_blank"
              rel="noopener"
              class="group flex h-full flex-col p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span class="flex items-center justify-between font-mono text-xs font-medium tracking-wider text-accent-2 uppercase">
                {{ c.issuer }}
                <span class="text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                  <Icon name="external" :size="14" />
                </span>
              </span>
              <span class="mt-3 block flex-1 text-lg leading-snug font-bold text-fg group-hover:text-accent">{{ c.name }}</span>
              <span class="mt-4 block text-sm text-muted">
                Issued {{ c.date }} · Verify credential<span class="sr-only"> (opens in a new tab)</span>
              </span>
            </SpotlightCard>
          </li>
        </ul>
      </section>

      <!-- 07 Contact -->
      <section id="contact" :aria-labelledby="`${sec.contact.id}-h`" class="pt-24 sm:pt-32">
        <SectionHeading :id="`${sec.contact.id}-h`" :index="sec.contact.index" :label="sec.contact.label" :title="sec.contact.title" />
        <div v-reveal>
          <SpotlightCard class="relative overflow-hidden p-7 sm:p-12">
            <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
              <div class="glow glow-1 -top-40 -right-24 size-[30rem]"></div>
              <div class="glow glow-2 -bottom-48 -left-24 size-[26rem]"></div>
            </div>
            <p class="max-w-2xl text-xl leading-relaxed text-fg">{{ profile.contact.text }}</p>
            <div class="mt-7 flex flex-wrap items-center gap-3">
              <a
                :href="`mailto:${profile.links.email}`"
                class="text-xl font-extrabold tracking-tight break-all text-accent underline decoration-accent/30 underline-offset-[6px] transition hover:decoration-accent sm:text-2xl"
              >
                {{ profile.links.email }}
              </a>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
                @click="copyEmail"
              >
                {{ copied ? 'Copied' : 'Copy' }}<span class="sr-only"> email address</span>
              </button>
              <span class="sr-only" aria-live="polite">{{ copied ? 'Email address copied to clipboard' : '' }}</span>
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
              <a :href="`mailto:${profile.links.email}`" :class="primaryBtn">
                <Icon name="mail" />
                Email me
              </a>
              <a :href="profile.links.linkedin" target="_blank" rel="noopener" :class="btn">
                <Icon name="linkedin" />
                LinkedIn
              </a>
              <a :href="profile.links.github" target="_blank" rel="noopener" :class="btn">
                <Icon name="github" />
                GitHub
              </a>
              <a :href="cvHref" download :class="btn">
                <Icon name="download" />
                Download CV
              </a>
            </div>
          </SpotlightCard>
        </div>
      </section>

      <footer class="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line py-8 text-sm text-muted">
        <p>© {{ year }} {{ profile.name }} · Built with Vue and Tailwind CSS</p>
        <a href="#top" class="font-mono text-xs hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
          Back to top ↑
        </a>
      </footer>
    </div>
  </main>
</template>
