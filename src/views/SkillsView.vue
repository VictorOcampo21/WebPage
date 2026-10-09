<script setup>
import { profile } from '../data/profile.js'
import OutputStream from '../components/terminal/OutputStream.vue'
import ViewHeading from '../components/terminal/ViewHeading.vue'

defineProps({ plain: { type: Boolean, default: false } })
const keyOf = (group) => group.toLowerCase().replaceAll('&', 'and').replace(/[^a-z0-9]+/g, '_')
</script>

<template>
  <OutputStream :plain="plain">
    <ViewHeading text="skills" :plain="plain" />

    <div class="max-w-4xl overflow-x-auto rounded-lg border border-line bg-surface-2/50 p-4 font-mono text-sm leading-7 sm:p-6">
      <p class="json-punct">{</p>
      <dl class="pl-4 sm:pl-6">
        <template v-for="g in profile.skills" :key="g.group">
          <dt class="json-key">"{{ keyOf(g.group) }}"<span class="json-punct">: [</span><span class="sr-only"> ({{ g.group }})</span></dt>
          <dd class="flex flex-wrap gap-x-1 pl-4 sm:pl-6">
            <span v-for="(s, i) in g.items" :key="s" class="json-str">"{{ s }}"<span class="json-punct">{{ i < g.items.length - 1 ? ',' : '' }}</span></span>
          </dd>
          <p class="json-punct" aria-hidden="true">],</p>
        </template>
        <dt class="json-key">"in_training"<span class="json-punct">: [</span></dt>
        <dd class="pl-4 sm:pl-6">
          <span class="flex flex-wrap gap-x-1">
            <span v-for="(s, i) in profile.training" :key="s" class="json-str">"{{ s }}"<span class="json-punct">{{ i < profile.training.length - 1 ? ',' : '' }}</span></span>
          </span>
          <span class="json-comment">// currently training, not yet in production work</span>
        </dd>
        <p class="json-punct" aria-hidden="true">]</p>
      </dl>
      <p class="json-punct">}</p>
    </div>
  </OutputStream>
</template>
