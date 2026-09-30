<script setup lang="ts">
import type { CollectiviteSummary, PaginatedResponse } from '~/types/api'

const config = useRuntimeConfig()
const route = useRoute()
const code = String(route.params.code)
const page = computed(() => parseInt(String(route.query.page || '1'), 10) || 1)

const canonicalPath = computed(() =>
  page.value > 1 ? `/departement/${code}?page=${page.value}` : `/departement/${code}`
)
const canonicalUrl = computed(() => `${config.public.siteUrl}${canonicalPath.value}`)

const { data, status } = await useAsyncData(
  `departement-${code}-page-${page.value}`,
  () => $fetch<PaginatedResponse<CollectiviteSummary>>('/api/collectivites', {
    params: { departementCode: code, page: page.value, limit: 18 }
  }),
  { watch: [page] }
)

const departementNom = computed(() =>
  data.value?.data[0]?.departementNom || `Département ${code}`
)

const regionCode = computed(() =>
  data.value?.data[0]?.regionCode
)

const regionNom = computed(() =>
  data.value?.data[0]?.regionNom
)

const total = computed(() => data.value?.meta.total || 0)

const breadcrumbItems = computed(() => {
  const items = [{ label: 'Accueil', to: '/' }]
  if (regionNom.value && regionCode.value) {
    items.push({ label: regionNom.value, to: `/region/${regionCode.value}` })
  }
  items.push({ label: departementNom.value, to: '' })
  return items
})

useSeoMeta({
  title: () => `Emploi public dans le ${departementNom.value} (${code}) — Collectivités qui recrutent`,
  description: () => `Trouvez votre prochain poste dans la fonction publique territoriale en ${departementNom.value}. ${total.value} collectivités référencées avec leurs offres d'emploi.`,
  ogTitle: () => `Emploi public dans le ${departementNom.value} (${code})`,
  ogDescription: () => `${total.value} collectivités qui recrutent dans le ${departementNom.value}. Offres d'emploi public et marque employeur.`,
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
  <div>
    <UPageSection>
      <UBreadcrumb :items="breadcrumbItems" />
      <UPageHeader
        :title="`Collectivités du département ${departementNom}`"
        :description="`${total} collectivités référencées dans le département ${departementNom}.`"
        class="mt-4"
      />
    </UPageSection>

    <UPageSection>
      <ListingGrid
        :collectivites="data?.data || []"
        :loading="status === 'pending'"
      />

      <div
        v-if="data && data.meta.totalPages > 1"
        class="flex justify-center mt-8"
      >
        <UPagination
          :model-value="page"
          :total="data.meta.total"
          :items-per-page="data.meta.limit"
          @update:model-value="goToPage"
        />
      </div>
    </UPageSection>
  </div>
</template>
