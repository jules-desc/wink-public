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
  { label: 'Ressources', to: '/ressources' },
  { label: 'Guides', to: '/ressources/guides' },
  { label: 'Modèles', to: '/ressources/modeles' },
  { label: 'Fiches métiers', to: '/ressources/metiers' },
  { label: 'Grilles et simulateur', to: '/ressources/grilles' },
  { label: 'Actualités', to: '/ressources/actualites' },
  { label: 'Annuaire', to: '/annuaire' }
]

const tools: MepNavItem[] = [
  { label: 'Rechercher', to: '/annuaire', icon: 'i-lucide-search' },
  { label: 'Newsletter', to: '/ressources#newsletter', icon: 'i-lucide-mail' }
]

const footerColumns: MepFooterColumn[] = [
  {
    title: 'Ressources',
    links: [
      { label: 'Guides', to: '/ressources/guides' },
      { label: 'Modèles et outils', to: '/ressources/modeles' },
      { label: 'Fiches métiers', to: '/ressources/metiers' },
      { label: 'Grilles et simulateur', to: '/ressources/grilles' },
      { label: 'Chiffres clés', to: '/ressources/chiffres-cles' },
      { label: 'Actualités', to: '/ressources/actualites' }
    ]
  },
  {
    title: 'Annuaire',
    links: [
      { label: 'Toutes les régions', to: '/annuaire' },
      { label: 'Rechercher une collectivité', to: '/annuaire' }
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
