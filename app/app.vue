<script setup lang="ts">
import type { MepFooterColumn, MepNavItem } from '~/types/mep'

const title = 'Mon Employeur Public — Le média et la boîte à outils RH du secteur public'
const description = 'Découvrez la marque employeur de chaque collectivité territoriale en France : chiffres clés, avantages, compétences et informations pratiques.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogSiteName: 'Mon Employeur Public',
  ogLocale: 'fr_FR',
  twitterCard: 'summary_large_image'
})

const nav: MepNavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Annuaire des employeurs', to: '/#regions' }
]

const tools: MepNavItem[] = [
  { label: 'Rechercher', to: '/#search', icon: 'i-lucide-search' }
]

const footerColumns: MepFooterColumn[] = [
  {
    title: 'Explorer',
    links: [
      { label: 'Toutes les régions', to: '/#regions' },
      { label: 'Rechercher une collectivité', to: '/#search' }
    ]
  },
  {
    title: 'Recruteurs',
    links: [
      { label: 'Réclamer votre page', to: '/#reclamer' }
    ]
  },
  {
    title: 'Wink',
    links: [
      { label: 'Découvrir Wink', to: 'https://wink-lab.com' }
    ]
  }
]
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <MepHeader
        :nav="nav"
        :tools="tools"
      >
        <template #cta>
          <UButton
            to="/#reclamer"
            size="sm"
          >
            Réclamer ma page
          </UButton>
        </template>
      </MepHeader>

      <main class="flex-1">
        <NuxtPage />
      </main>

      <MepFooter :columns="footerColumns" />
    </div>
  </UApp>
</template>
