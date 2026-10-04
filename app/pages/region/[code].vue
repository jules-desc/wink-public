<script setup lang="ts">
import type { CollectiviteSummary, PaginatedResponse } from '~/types/api'

const config = useRuntimeConfig()
const route = useRoute()
const code = String(route.params.code)
const page = computed(() => parseInt(String(route.query.page || '1'), 10) || 1)

const canonicalPath = computed(() =>
  page.value > 1 ? `/region/${code}?page=${page.value}` : `/region/${code}`
)
const canonicalUrl = computed(() => `${config.public.siteUrl}${canonicalPath.value}`)

const { data, status } = await useAsyncData(
  `region-${code}-page-${page.value}`,
  () => $fetch<PaginatedResponse<CollectiviteSummary>>('/api/collectivites', {
    params: { regionCode: code, page: page.value, limit: 18 }
  }),
  { watch: [page] }
)

const regionNom = computed(() =>
  data.value?.data[0]?.regionNom || `Région ${code}`
)

const total = computed(() => data.value?.meta.total || 0)

const breadcrumbItems = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: regionNom.value, to: '' }
])

useSeoMeta({
  title: () => `Emploi public en ${regionNom.value} — Collectivités qui recrutent`,
  description: () => `Trouvez votre prochain poste dans la fonction publique territoriale en ${regionNom.value}. ${total.value} collectivités référencées avec leurs offres d'emploi.`,
  ogTitle: () => `Emploi public en ${regionNom.value}`,
  ogDescription: () => `${total.value} collectivités qui recrutent en ${regionNom.value}. Offres d'emploi public et marque employeur.`,
  ogUrl: canonicalUrl
})

useHead({
  link: [computed(() => ({ rel: 'canonical', href: canonicalUrl.value }))]
})

function goToPage(p: number) {
  navigateTo({ query: { page: p } })
}
</script>

<template>
  <div class="mep-container pt-8 pb-20">
    <UBreadcrumb :items="breadcrumbItems" />

    <div class="mt-6 pb-8 border-b border-default flex flex-col gap-2.5">
      <h1 class="text-3xl/10 md:text-[40px]/12 font-extrabold">
        {{ `Collectivités de la région ${regionNom}` }}
      </h1>
      <p class="text-lg/7 text-muted">
        {{ `${total.toLocaleString('fr-FR')} collectivités référencées en ${regionNom}.` }}
      </p>
    </div>

    <div class="mt-8">
      <ListingGrid
        :collectivites="data?.data || []"
        :loading="status === 'pending'"
      />
    </div>

    <div
      v-if="data && data.meta.totalPages > 1"
      class="flex justify-center mt-10"
    >
      <UPagination
        :page="page"
        :total="data.meta.total"
        :items-per-page="data.meta.limit"
        active-color="primary"
        active-variant="solid"
        variant="ghost"
        color="neutral"
        @update:page="goToPage"
      />
    </div>
  </div>
</template>
