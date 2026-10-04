<script setup lang="ts">
import chiffres from '~~/content/data/chiffres-cles.json'

const config = useRuntimeConfig()
const canonicalUrl = `${config.public.siteUrl}/ressources/chiffres-cles`

const description = 'Effectifs, part des contractuels, catégories, âge moyen, nombre de collectivités : les chiffres clés de l\'emploi public territorial, avec leurs sources officielles.'

useSeoMeta({
  title: 'Chiffres clés de l\'emploi public territorial',
  description,
  ogTitle: 'Chiffres clés de l\'emploi public territorial',
  ogDescription: description,
  ogUrl: canonicalUrl
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

const breadcrumb = [
  { label: 'Accueil', to: '/' },
  { label: 'Ressources', to: '/ressources' },
  { label: 'Chiffres clés' }
]

const ICONS: Record<string, string> = {
  'agents': 'i-lucide-users',
  '%': 'i-lucide-percent',
  'ans': 'i-lucide-hourglass',
  'communes': 'i-lucide-landmark',
  'intercommunalités': 'i-lucide-network'
}

const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })

function formatValeur(valeur: number, unite: string): string {
  if (unite === 'ans') {
    const ans = Math.floor(valeur)
    const mois = Math.round((valeur - ans) * 12)
    return mois ? `${ans} ans et ${mois} mois` : `${ans} ans`
  }
  return unite === '%' ? `${nf.format(valeur)} %` : nf.format(valeur)
}

const items = chiffres
  .filter(c => c.verifie)
  .map(c => ({
    ...c,
    display: formatValeur(c.valeur, c.unite),
    icon: ICONS[c.unite] ?? 'i-lucide-chart-column'
  }))

const sources = items
  .map(c => c.source)
  .filter((s, i, all) => all.findIndex(x => x.url === s.url) === i)
</script>

<template>
  <div class="mep-container pt-8 pb-20">
    <UBreadcrumb :items="breadcrumb" />

    <div class="mt-6 pb-8 border-b border-default flex flex-col gap-3 max-w-200">
      <span class="mep-rule mb-1" />
      <span class="mep-kicker">Données publiques</span>
      <h1 class="font-serif text-4xl/[44px] md:text-5xl/[56px] font-semibold">
        Chiffres clés de l'emploi public territorial
      </h1>
      <p class="text-lg/7 text-muted">
        Les repères à connaître pour situer votre collectivité, chacun avec sa source officielle et son année.
      </p>
    </div>

    <div class="grid gap-3 mt-10 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="c in items"
        :key="c.id"
        class="flex flex-col gap-2 p-6 bg-default ring ring-inset ring-default"
      >
        <UIcon
          :name="c.icon"
          class="size-6 text-primary"
        />
        <span class="text-[32px]/10 font-extrabold tracking-[-0.02em] text-primary tabular-nums">
          {{ c.display }}<span
            v-if="c.unite !== '%' && c.unite !== 'ans'"
            class="ml-2 text-base font-semibold text-muted tracking-normal"
          >{{ c.unite }}</span>
        </span>
        <span class="font-semibold text-highlighted">{{ c.libelle }}</span>
        <span class="text-[13px]/[18px] text-muted">{{ c.perimetre }} · Données {{ c.annee }}</span>
        <a
          :href="c.source.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-auto pt-2 text-[13px]/[18px] text-primary underline underline-offset-3"
        >Source : {{ c.source.titre }}</a>
      </div>
    </div>

    <section class="mt-14 pt-6 border-t border-default max-w-190">
      <h2 class="text-lg/7 font-bold">
        Sources
      </h2>
      <ul class="mt-3 flex flex-col gap-2 text-[15px]/6">
        <li
          v-for="s in sources"
          :key="s.url"
        >
          <a
            :href="s.url"
            target="_blank"
            rel="noopener noreferrer"
          >{{ s.titre }}</a>
        </li>
      </ul>
    </section>

    <RessourceNewsletterForm class="mt-16" />
  </div>
</template>
