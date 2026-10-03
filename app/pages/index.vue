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

const features = [{
  icon: 'i-lucide-building-2',
  title: 'Marque employeur',
  description: 'Découvrez ce qui rend chaque collectivité unique : projets, cadre de vie, avantages et conditions de travail.'
}, {
  icon: 'i-lucide-briefcase',
  title: 'Offres d\'emploi',
  description: 'Consultez les postes ouverts dans la fonction publique territoriale, mis à jour quotidiennement.'
}, {
  icon: 'i-lucide-chart-column',
  title: 'Chiffres clés',
  description: 'Population, effectifs, budget : toutes les données publiques pour comparer les collectivités.'
}, {
  icon: 'i-lucide-map-pin',
  title: 'Toute la France',
  description: 'Communes, EPCI, départements, régions : chaque collectivité territoriale a sa page dédiée.'
}]
</script>

<template>
  <div>
    <MepPageHero
      id="search"
      kicker="Emploi public territorial"
      title="Les collectivités territoriales qui recrutent"
      description="Découvrez la marque employeur de chaque collectivité en France. Offres d'emploi, chiffres clés et informations pratiques pour trouver votre prochain poste dans la fonction publique territoriale."
    >
      <div class="w-full max-w-160">
        <SearchBar />
        <p class="mt-2.5 text-sm text-muted">
          Plus de 35 000 collectivités territoriales référencées : communes, intercommunalités, départements et régions.
        </p>
      </div>
    </MepPageHero>

    <section
      v-if="regions?.length"
      id="regions"
      class="bg-muted border-b border-default"
    >
      <div class="mep-container py-18">
        <MepSectionHeader
          kicker="Annuaire"
          title="Parcourir par région"
          description="Explorez les collectivités territoriales par région."
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-8">
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
    </section>

    <div class="mep-container py-18">
      <MepSectionHeader
        kicker="Boîte à outils"
        title="Tout savoir sur les employeurs publics territoriaux"
      />
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="flex flex-col gap-2.5"
        >
          <span class="size-12 flex items-center justify-center bg-(--surface-brand-tint) text-primary">
            <UIcon
              :name="feature.icon"
              class="size-6"
            />
          </span>
          <h3 class="text-lg/[26px] font-bold">
            {{ feature.title }}
          </h3>
          <p class="text-[15px]/6 text-muted">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <MepCallToAction
        id="reclamer"
        class="mt-18"
        icon="i-lucide-hand"
        title="Vous gérez le recrutement d'une collectivité ?"
        description="Réclamez votre page pour personnaliser votre marque employeur et attirer les meilleurs talents."
        action-label="Réclamez votre page"
        action-to="#"
      />
    </div>
  </div>
</template>
