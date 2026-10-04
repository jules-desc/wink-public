<script setup lang="ts">
import type { RegionItem } from '~/types/api'

const config = useRuntimeConfig()
const canonicalUrl = `${config.public.siteUrl}/annuaire`

const description = 'La page marque employeur de chaque collectivité territoriale : communes, intercommunalités, départements et régions, classés par région.'

useSeoMeta({
  title: 'Annuaire des employeurs publics territoriaux',
  description,
  ogTitle: 'Annuaire des employeurs publics territoriaux',
  ogDescription: description,
  ogUrl: canonicalUrl
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

const { data: regions } = await useAsyncData('regions', () => $fetch<RegionItem[]>('/api/regions'))

const breadcrumb = [
  { label: 'Accueil', to: '/' },
  { label: 'Annuaire' }
]

const total = computed(() => (regions.value ?? []).reduce((sum, r) => sum + r.count, 0))
</script>

<template>
  <div class="mep-container pt-8 pb-20">
    <UBreadcrumb :items="breadcrumb" />

    <div class="mt-6 pb-8 border-b border-default flex flex-col gap-3 max-w-200">
      <span class="mep-rule mb-1" />
      <span class="mep-kicker">Annuaire</span>
      <h1 class="text-3xl/10 md:text-[40px]/12 font-extrabold">
        Annuaire des employeurs publics territoriaux
      </h1>
      <p class="text-lg/7 text-muted">
        {{ total.toLocaleString('fr-FR') }} collectivités référencées, chacune avec sa page marque employeur.
      </p>
      <div class="w-full max-w-160 mt-4">
        <SearchBar />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
      <NuxtLink
        v-for="region in regions"
        :key="region.code"
        :to="`/region/${region.code}`"
        class="flex items-center justify-between gap-3 p-4.5 bg-default ring ring-inset ring-default no-underline transition-shadow duration-[120ms] hover:ring-primary hover:shadow-(--shadow-sm)"
      >
        <span class="flex items-center gap-3 font-semibold text-highlighted">
          <UIcon
            name="i-lucide-map"
            class="size-5 text-primary"
          />
          {{ region.nom }}
        </span>
        <UBadge
          color="neutral"
          variant="subtle"
          size="sm"
          class="shrink-0"
        >
          {{ region.count.toLocaleString('fr-FR') }} collectivité{{ region.count > 1 ? 's' : '' }}
        </UBadge>
      </NuxtLink>
    </div>
  </div>
</template>
