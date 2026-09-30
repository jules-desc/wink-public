<script setup lang="ts">
import type { CollectiviteDetail } from '~/types/api'

const config = useRuntimeConfig()
const route = useRoute()
const slug = String(route.params.slug)
const canonicalUrl = `${config.public.siteUrl}/etablissement/${slug}`

const { data, error } = await useAsyncData(
  `collectivite-${slug}`,
  () => $fetch<CollectiviteDetail>(`/api/collectivites/${slug}`)
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Collectivité non trouvée' })
}

const resolvedBranding = computed(() => data.value?.resolvedBranding ?? null)
useCollectiviteBranding(resolvedBranding)

const typeLabel = computed(() =>
  collectiviteTypeLabel(data.value?.type || '', data.value?.sousType)
)

const location = computed(() =>
  data.value?.departementNom || data.value?.regionNom || 'France'
)

const seoTitle = computed(() =>
  data.value?.contenuPage?.titreSeo
  || `${data.value?.nom} recrute — Offres d'emploi ${typeLabel.value}`
)

const seoDescription = computed(() =>
  data.value?.contenuPage?.metaDescription
  || (data.value?.description ? data.value.description.slice(0, 160) : null)
  || `Découvrez les offres d'emploi et la marque employeur de ${data.value?.nom}. ${typeLabel.value} en ${location.value}.`
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  ogImage: () => data.value?.logoUrl || data.value?.blasonUrl || undefined,
  twitterCard: 'summary_large_image'
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

if (data.value) {
  const d = data.value
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    'name': d.nom,
    'url': canonicalUrl
  }

  if (d.contenuPage?.introduction) org.description = d.contenuPage.introduction
  else if (d.description) org.description = d.description

  if (d.logoUrl) org.logo = d.logoUrl
  if (d.telephone) org.telephone = d.telephone
  if (d.email) org.email = d.email

  if (d.adresseVille || d.adresseRue) {
    org.address = {
      '@type': 'PostalAddress',
      ...(d.adresseRue && { streetAddress: [d.adresseNumero, d.adresseRue].filter(Boolean).join(' ') }),
      ...(d.adresseVille && { addressLocality: d.adresseVille }),
      ...(d.adresseCodePostal && { postalCode: d.adresseCodePostal }),
      ...(d.regionNom && { addressRegion: d.regionNom }),
      'addressCountry': 'FR'
    }
  }

  if (d.effectifs) {
    org.numberOfEmployees = { '@type': 'QuantitativeValue', 'value': d.effectifs }
  }

  const sameAs: string[] = []
  if (d.siteWeb) sameAs.push(d.siteWeb)
  if (d.socialMediaLinks) {
    for (const url of Object.values(d.socialMediaLinks)) {
      if (url) sameAs.push(url)
    }
  }
  if (sameAs.length) org.sameAs = sameAs

  useHead({
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(org) }]
  })
}
</script>

<template>
  <div
    v-if="data"
    class="pb-24 lg:pb-0"
  >
    <UPageSection>
      <CollectiviteHeader :collectivite="data" />
    </UPageSection>

    <UPageSection
      v-if="data.population || data.effectifs || data.budgetTotal || data.ratioFemmes || data.ageMoyen"
      title="Chiffres clés"
    >
      <CollectiviteChiffresCles
        :population="data.population"
        :effectifs="data.effectifs"
        :budget-total="data.budgetTotal"
        :ratio-femmes="data.ratioFemmes"
        :age-moyen="data.ageMoyen"
      />
    </UPageSection>

    <UPageSection
      v-if="data.photosGallery?.length"
      title="En images"
    >
      <CollectivitePhotoGallery :photos="data.photosGallery" />
    </UPageSection>

    <UPageSection title="Marque employeur">
      <CollectiviteDescription
        :contenu-page="data.contenuPage"
        :description="data.description"
      />
    </UPageSection>

    <UPageSection
      v-if="data.benefits.length"
      title="Avantages"
    >
      <CollectiviteBenefits :benefits="data.benefits" />
    </UPageSection>

    <UPageSection
      v-if="data.competences.length"
      title="Compétences"
    >
      <CollectiviteCompetences :competences="data.competences" />
    </UPageSection>

    <UPageSection
      v-if="data.offresEmploi.length"
      title="Offres d'emploi"
    >
      <CollectiviteOffresEmploi
        :offres="data.offresEmploi"
        :collectivite-nom="data.nom"
        :offres-count="data.offresCount"
      />
    </UPageSection>

    <UPageSection title="Informations pratiques">
      <CollectiviteInfosPratiques :collectivite="data" />
    </UPageSection>

    <CollectiviteClaimCTA
      :collectivite-nom="data.nom"
      :is-claimed="data.isClaimed"
    />
  </div>
</template>
