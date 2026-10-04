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
  <div class="mep-container pt-8 pb-20">
    <UBreadcrumb :items="breadcrumbItems" />

    <div class="mt-6 pb-8 border-b border-default flex flex-col gap-2.5">
      <h1 class="text-3xl/10 md:text-[40px]/12 font-extrabold">
        {{ `Collectivités du département ${departementNom}` }}
      </h1>
      <p class="text-lg/7 text-muted">
        {{ `${total.toLocaleString('fr-FR')} collectivités référencées dans le département ${departementNom}.` }}
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
