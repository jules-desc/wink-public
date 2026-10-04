<script setup lang="ts">
import type { RessourcesHubResponse } from '~/types/ressources'

const config = useRuntimeConfig()
const canonicalUrl = `${config.public.siteUrl}/ressources`

const { data } = await useFetch<RessourcesHubResponse>('/api/ressources/hub')

const title = 'Ressources pour recruter dans le secteur public'
const description = 'Guides, modèles, fiches métiers, grilles indiciaires et actualités RH : la boîte à outils gratuite des recruteurs des collectivités.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: canonicalUrl
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

const rubriques = computed(() =>
  RUBRIQUES.map(r => ({ ...r, ...data.value?.rubriques.find(x => x.segment === r.segment) }))
)

const outils = [
  {
    to: '/ressources/grilles',
    icon: 'i-lucide-calculator',
    title: 'Grilles et simulateur',
    description: 'Du traitement indiciaire au net estimé d\'un titulaire, en quelques secondes.'
  },
  {
    to: '/ressources/chiffres-cles',
    icon: 'i-lucide-chart-column',
    title: 'Chiffres clés',
    description: 'Effectifs, contractuels, catégories : les données publiques de l\'emploi territorial.'
  },
  {
    to: '/annuaire',
    icon: 'i-lucide-landmark',
    title: 'Annuaire des employeurs',
    description: 'La page marque employeur de chaque collectivité territoriale.'
  }
]
</script>

<template>
  <div>
    <MepPageHero
      kicker="Ressources"
      title="Tout pour recruter dans le secteur public"
      description="Guides pratiques, modèles prêts à copier, fiches métiers écrites pour le recruteur et actualité réglementaire décryptée. Gratuit, sans inscription."
    />

    <div class="mep-container py-14">
      <MepSectionHeader
        kicker="À la une"
        title="Les derniers contenus"
      />
      <div
        v-if="data?.une.length"
        class="grid gap-10 mt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      >
        <RessourceCard
          :ressource="data.une[0]!"
          size="lg"
        />
        <div class="flex flex-col gap-8">
          <RessourceCard
            v-for="r in data.une.slice(1)"
            :key="r.id"
            :ressource="r"
          />
        </div>
      </div>
      <UEmpty
        v-else
        class="mt-8"
        icon="i-lucide-newspaper"
        title="Premiers contenus en préparation"
        description="Les guides et modèles arrivent très bientôt."
      />
    </div>

    <section class="bg-muted border-y border-default">
      <div class="mep-container py-14">
        <MepSectionHeader
          kicker="Outils"
          title="Calculer, comparer, trouver"
        />
        <div class="grid gap-3 mt-8 md:grid-cols-3">
          <NuxtLink
            v-for="outil in outils"
            :key="outil.to"
            :to="outil.to"
            class="flex gap-4 p-5 bg-default ring ring-inset ring-default no-underline text-default transition-shadow duration-[120ms] hover:ring-primary hover:shadow-(--shadow-sm)"
          >
            <span class="size-12 shrink-0 flex items-center justify-center bg-(--surface-brand-tint) text-primary">
              <UIcon
                :name="outil.icon"
                class="size-6"
              />
            </span>
            <span class="flex flex-col gap-1">
              <span class="font-bold text-highlighted">{{ outil.title }}</span>
              <span class="text-sm text-muted">{{ outil.description }}</span>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <div class="mep-container">
      <section
        v-for="rubrique in rubriques"
        :key="rubrique.segment"
        class="py-14 border-b border-default last:border-b-0"
      >
        <MepSectionHeader
          :kicker="`${rubrique.count ?? 0} contenu${(rubrique.count ?? 0) > 1 ? 's' : ''}`"
          :title="rubrique.label"
          :description="rubrique.description"
        >
          <template #action>
            <UButton
              :to="`/ressources/${rubrique.segment}`"
              variant="outline"
              trailing-icon="i-lucide-arrow-right"
            >
              Tout voir
            </UButton>
          </template>
        </MepSectionHeader>

        <div
          v-if="rubrique.items?.length"
          class="grid gap-8 mt-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <RessourceCard
            v-for="r in rubrique.items"
            :key="r.id"
            :ressource="r"
            :show-kicker="false"
          />
        </div>
        <p
          v-else
          class="mt-6 text-muted"
        >
          Premiers contenus en préparation.
        </p>
      </section>
    </div>

    <div class="mep-container pb-18">
      <RessourceNewsletterForm />
    </div>
  </div>
</template>
