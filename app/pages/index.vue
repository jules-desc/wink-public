<script setup lang="ts">
import type { RegionItem } from '~/types/api'

const config = useRuntimeConfig()

useSeoMeta({
  title: 'Emploi public territorial — Collectivités qui recrutent en France',
  description: 'Découvrez les collectivités territoriales qui recrutent en France. Offres d\'emploi, marque employeur et informations pratiques pour chaque commune, intercommunalité et département.',
  ogTitle: 'Emploi public territorial — Collectivités qui recrutent en France',
  ogDescription: 'Plus de 35 000 collectivités territoriales référencées. Trouvez votre prochain poste dans la fonction publique territoriale.',
  ogUrl: config.public.siteUrl || '/'
})

useHead({
  link: [{ rel: 'canonical', href: config.public.siteUrl || '/' }]
})

const { data: regions } = await useAsyncData(
  'regions',
  () => $fetch<RegionItem[]>('/api/regions')
)
</script>

<template>
  <div>
    <UPageHero
      title="Les collectivités territoriales qui recrutent"
      description="Découvrez la marque employeur de chaque collectivité en France. Offres d'emploi, chiffres clés et informations pratiques pour trouver votre prochain poste dans la fonction publique territoriale."
      :links="[{
        label: 'Rechercher une collectivité',
        to: '#search',
        trailingIcon: 'i-lucide-search',
        size: 'xl'
      }]"
    />

    <UPageSection
      id="search"
      title="Trouvez votre collectivité"
      description="Plus de 35 000 collectivités territoriales référencées : communes, intercommunalités, départements et régions."
    >
      <div class="max-w-xl mx-auto">
        <SearchBar />
      </div>
    </UPageSection>

    <UPageSection
      v-if="regions?.length"
      title="Parcourir par région"
      description="Explorez les collectivités territoriales par région."
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="region in regions"
          :key="region.code"
          :to="`/region/${region.code}`"
        >
          <UCard class="hover:ring-primary hover:ring-1 transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-lucide-map"
                  class="w-5 h-5 text-primary"
                />
                <span class="font-medium">{{ region.nom }}</span>
              </div>
              <UBadge
                variant="subtle"
                color="neutral"
              >
                {{ region.count }} collectivité{{ region.count > 1 ? 's' : '' }}
              </UBadge>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </UPageSection>

    <UPageSection
      id="features"
      title="Tout savoir sur les employeurs publics territoriaux"
      :features="[{
        icon: 'i-lucide-building-2',
        title: 'Marque employeur',
        description: 'Découvrez ce qui rend chaque collectivité unique : projets, cadre de vie, avantages et conditions de travail.'
      }, {
        icon: 'i-lucide-briefcase',
        title: 'Offres d\'emploi',
        description: 'Consultez les postes ouverts dans la fonction publique territoriale, mis à jour quotidiennement.'
      }, {
        icon: 'i-lucide-bar-chart-3',
        title: 'Chiffres clés',
        description: 'Population, effectifs, budget : toutes les données publiques pour comparer les collectivités.'
      }, {
        icon: 'i-lucide-map-pin',
        title: 'Toute la France',
        description: 'Communes, EPCI, départements, régions : chaque collectivité territoriale a sa page dédiée.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Vous gérez le recrutement d'une collectivité ?"
        description="Réclamez votre page pour personnaliser votre marque employeur et attirer les meilleurs talents."
        variant="subtle"
        :links="[{
          label: 'Réclamez votre page',
          to: '#',
          trailingIcon: 'i-lucide-arrow-right',
          color: 'neutral'
        }]"
      />
    </UPageSection>
  </div>
</template>
