<script setup lang="ts">
import type { MepNavItem } from '~/types/mep'

const props = withDefaults(defineProps<{
  nav?: MepNavItem[]
  tools?: MepNavItem[]
  disclaimer?: string
  baseline?: string
}>(), {
  nav: () => [],
  tools: () => [],
  disclaimer: 'Site indépendant — non affilié à l\'État ni à une administration',
  baseline: 'Le média et la boîte à outils RH du secteur public'
})

const route = useRoute()

function isActive(item: MepNavItem) {
  if (item.to.includes('#')) return false
  if (item.to === '/') return route.path === '/'
  return route.path.startsWith(item.to)
}

const navItems = computed(() => props.nav.map(item => ({ ...item, active: isActive(item) })))
</script>

<template>
  <header class="bg-default border-b border-default">
    <div
      v-if="disclaimer"
      class="bg-(--blue-950) text-(--blue-100) text-xs/4 py-1.5"
    >
      <div class="mep-container flex items-center gap-2">
        <UIcon
          name="i-lucide-info"
          class="size-3.5 shrink-0"
        />
        {{ disclaimer }}
      </div>
    </div>

    <div class="mep-container flex flex-wrap items-center justify-between gap-6 py-5">
      <NuxtLink
        to="/"
        class="flex items-center gap-5 no-underline"
      >
        <MepLogo :height="40" />
        <span
          v-if="baseline"
          class="hidden md:block border-l border-default pl-5 text-sm text-muted max-w-56"
        >
          {{ baseline }}
        </span>
      </NuxtLink>

      <div class="flex flex-wrap items-center gap-5">
        <NuxtLink
          v-for="tool in tools"
          :key="tool.label"
          :to="tool.to"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline"
        >
          <UIcon
            v-if="tool.icon"
            :name="tool.icon"
            class="size-4"
          />
          {{ tool.label }}
        </NuxtLink>
        <slot name="cta" />
      </div>
    </div>

    <nav
      v-if="navItems.length"
      aria-label="Navigation principale"
      class="mep-container flex gap-1 overflow-x-auto"
    >
      <NuxtLink
        v-for="(item, i) in navItems"
        :key="item.label"
        :to="item.to"
        :aria-current="item.active ? 'page' : undefined"
        class="px-4 py-3.5 text-[15px]/5 whitespace-nowrap no-underline"
        :class="[
          i === 0 ? '-ml-4' : '',
          item.active
            ? 'font-bold text-primary shadow-[inset_0_-3px_0_var(--ui-primary)]'
            : 'font-medium text-highlighted hover:shadow-[inset_0_-3px_0_var(--border-default)]'
        ]"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
