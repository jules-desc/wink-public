<script setup lang="ts">
import type { RessourcesListResponse } from '~/types/ressources'

const config = useRuntimeConfig()
const route = useRoute()

const rubrique = rubriqueBySegment(String(route.params.rubrique))
if (!rubrique) {
  throw createError({ statusCode: 404, statusMessage: 'Rubrique non trouvée', fatal: true })
}

const page = computed(() => parseInt(String(route.query.page || '1'), 10) || 1)
const query = computed(() => ({
  rubrique: rubrique.segment,
  page: page.value,
  limit: 12,
  thematique: route.query.thematique || undefined,
  typeCollectivite: route.query.typeCollectivite || undefined
}))

const { data, status } = await useFetch<RessourcesListResponse>('/api/ressources', { query })

const canonicalUrl = computed(() =>
  `${config.public.siteUrl}/ressources/${rubrique.segment}${page.value > 1 ? `?page=${page.value}` : ''}`
)

useSeoMeta({
  title: rubrique.label,
  description: rubrique.description,
  ogTitle: rubrique.label,
  ogDescription: rubrique.description,
  ogUrl: canonicalUrl
})

useHead({
  link: [computed(() => ({ rel: 'canonical', href: canonicalUrl.value }))]
})

const breadcrumb = [
  { label: 'Accueil', to: '/' },
  { label: 'Ressources', to: '/ressources' },
  { label: rubrique.label }
]

const hasFilters = computed(() => Boolean(route.query.thematique || route.query.typeCollectivite))

function goToPage(p: number) {
  navigateTo({ query: { ...route.query, page: p > 1 ? p : undefined } })
}
</script>

<template>
  <div
    v-if="rubrique"
    class="mep-container pt-8 pb-20"
  >
    <UBreadcrumb :items="breadcrumb" />

    <div class="mt-6 pb-8 border-b border-default flex flex-col gap-3">
      <span class="mep-rule mb-1" />
      <h1 class="font-serif text-4xl/[44px] md:text-5xl/[56px] font-semibold">
        {{ rubrique.label }}
      </h1>
      <p class="text-lg/7 text-muted max-w-190">
        {{ rubrique.description }}
      </p>
      <RessourceFilters
        class="mt-4"
        :thematiques="Object.keys(THEMATIQUES)"
      />
    </div>

    <div
      v-if="status === 'pending'"
      class="grid gap-x-8 gap-y-12 mt-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-44"
      />
    </div>

    <div
      v-else-if="data?.data.length"
      class="grid gap-x-8 gap-y-12 mt-10 sm:grid-cols-2 lg:grid-cols-3"
    >
      <RessourceCard
        v-for="r in data.data"
        :key="r.id"
        :ressource="r"
        :show-kicker="false"
      />
    </div>

    <UEmpty
      v-else-if="hasFilters"
      class="mt-10"
      icon="i-lucide-search-x"
      title="Aucun contenu pour ces filtres"
      description="Élargissez votre recherche en retirant un filtre."
    />

    <UEmpty
      v-else-if="rubrique.type === 'PORTRAIT'"
      class="mt-10"
      icon="i-lucide-messages-square"
      title="Premiers portraits en préparation"
      description="Vous recrutez dans une collectivité et souhaitez partager votre expérience ? Les portraits sont réalisés à partir d'entretiens, relus et validés par les personnes interrogées."
      :actions="[{ label: 'Proposer votre collectivité', to: 'mailto:contact@wink-lab.com?subject=Portrait%20Mon%20Employeur%20Public', icon: 'i-lucide-mail' }]"
    />

    <UEmpty
      v-else
      class="mt-10"
      :icon="rubrique.icon"
      title="Premiers contenus en préparation"
      description="Cette rubrique s'enrichit chaque semaine."
    />

    <div
      v-if="data && data.meta.totalPages > 1"
      class="flex justify-center mt-12"
    >
      <UPagination
        :page="page"
        :total="data.meta.total"
        :items-per-page="data.meta.limit"
        variant="ghost"
        color="neutral"
        @update:page="goToPage"
      />
    </div>

    <RessourceNewsletterForm class="mt-16" />
  </div>
</template>
