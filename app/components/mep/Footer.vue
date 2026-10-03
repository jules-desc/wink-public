<script setup lang="ts">
import type { MepFooterColumn } from '~/types/mep'

withDefaults(defineProps<{
  columns?: MepFooterColumn[]
  legal?: Array<{ label: string, to: string }>
  description?: string
}>(), {
  columns: () => [],
  legal: () => [],
  description: 'Mon Employeur Public est le média et la boîte à outils gratuite des équipes recrutement et RH du secteur public.'
})

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-(--blue-950) text-(--blue-100) border-t-4 border-(--red-700)">
    <div class="mep-container grid gap-8 pt-12 pb-8 sm:grid-cols-2 lg:grid-cols-[minmax(240px,1.4fr)_repeat(3,minmax(140px,1fr))]">
      <div class="flex flex-col gap-4">
        <MepLogo
          inverse
          :height="44"
        />
        <p class="text-sm text-(--blue-200) max-w-80">
          {{ description }}
        </p>
      </div>

      <div
        v-for="column in columns"
        :key="column.title"
      >
        <div class="text-xs font-bold tracking-[.09em] uppercase text-white mb-3">
          {{ column.title }}
        </div>
        <ul class="flex flex-col gap-2">
          <li
            v-for="link in column.links"
            :key="link.label"
          >
            <NuxtLink
              :to="link.to"
              class="text-sm text-(--blue-100) no-underline hover:underline hover:text-white"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-white/15">
      <div class="mep-container flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-[13px] text-(--blue-200)">
        <NuxtLink
          v-for="link in legal"
          :key="link.label"
          :to="link.to"
          class="text-(--blue-200) underline underline-offset-3 hover:text-white"
        >
          {{ link.label }}
        </NuxtLink>
        <span class="sm:ml-auto">
          © {{ year }} Mon Employeur Public — Propulsé par
          <a
            href="https://wink-lab.com"
            target="_blank"
            rel="noopener"
            class="text-white underline underline-offset-3"
          >Wink</a>
          · Site non affilié à l'État
        </span>
      </div>
    </div>
  </footer>
</template>
