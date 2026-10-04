<script setup lang="ts">
import remuneration from '~~/content/data/remuneration.json'

const config = useRuntimeConfig()
const canonicalUrl = `${config.public.siteUrl}/ressources/grilles`

const title = 'Grilles indiciaires et simulateur de salaire de la fonction publique territoriale'
const description = 'Calculez le traitement brut et le net estimé d\'un fonctionnaire territorial à partir de son indice majoré. Valeur du point d\'indice et taux de cotisation 2026 sourcés.'

useSeoMeta({
  title: 'Grilles indiciaires et simulateur de salaire',
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: canonicalUrl
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})

const breadcrumb = [
  { label: 'Accueil', to: '/' },
  { label: 'Ressources', to: '/ressources' },
  { label: 'Grilles et simulateur' }
]

const { pointIndice, indiceMajoreMinimum, cotisationsTitulaireCNRACL, cadresEmplois } = remuneration

const parCategorie = computed(() =>
  (['A', 'B', 'C'] as const).map(categorie => ({
    categorie,
    cadres: cadresEmplois.filter(c => c.categorie === categorie)
  })).filter(g => g.cadres.length)
)

const sources = computed(() => {
  const all = [pointIndice.source, indiceMajoreMinimum.source, ...cotisationsTitulaireCNRACL.map(c => c.source), ...cadresEmplois.map(c => c.source)]
  return all.filter((s, i) => all.findIndex(x => x.url === s.url) === i)
})
</script>

<template>
  <div class="mep-container pt-8 pb-20">
    <UBreadcrumb :items="breadcrumb" />

    <div class="mt-6 pb-8 border-b border-default flex flex-col gap-3 max-w-200">
      <span class="mep-rule mb-1" />
      <span class="mep-kicker">Outil</span>
      <h1 class="font-serif text-4xl/[44px] md:text-5xl/[56px] font-semibold">
        Grilles et simulateur de salaire
      </h1>
      <p class="text-lg/7 text-muted">
        Estimez le brut et le net d'un fonctionnaire territorial à partir de son indice majoré, pour préparer une offre ou répondre à un candidat.
      </p>
    </div>

    <section class="py-12">
      <MepSectionHeader
        kicker="Simulateur"
        title="Du traitement indiciaire au net estimé"
        :level="2"
      />
      <RessourceSimulateur class="mt-8" />
    </section>

    <section class="py-12 border-t border-default">
      <MepSectionHeader
        kicker="Repères 2026"
        title="Les valeurs utilisées"
        :level="2"
      />
      <div class="grid gap-3 mt-8 sm:grid-cols-3">
        <MepStatCard
          icon="i-lucide-coins"
          :value="`${pointIndice.valeurMensuelle.toLocaleString('fr-FR', { maximumFractionDigits: 5 })} €`"
          :label="`Valeur mensuelle du point d'indice, depuis le ${formatDateLong(pointIndice.dateEffet)}`"
        />
        <MepStatCard
          icon="i-lucide-arrow-down-to-line"
          :value="String(indiceMajoreMinimum.valeur)"
          label="Indice majoré minimum de traitement"
        />
        <MepStatCard
          icon="i-lucide-percent"
          :value="`${cotisationsTitulaireCNRACL[0]?.taux.toLocaleString('fr-FR')} %`"
          label="Retenue pour pension CNRACL"
        />
      </div>
      <p class="mt-4 text-sm text-muted max-w-190">
        L'indice majoré minimum correspond à un traitement de {{ (indiceMajoreMinimum.valeur * pointIndice.valeurMensuelle).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) }} brut par mois à temps complet. Depuis la revalorisation du SMIC au 1er juin 2026, ce montant est inférieur au SMIC : une indemnité différentielle complète la rémunération.
      </p>
    </section>

    <section class="py-12 border-t border-default">
      <MepSectionHeader
        kicker="Grilles"
        title="Les cadres d'emplois les plus recrutés"
        description="Les grilles détaillées par grade et échelon sont en cours de vérification et seront publiées cadre d'emplois par cadre d'emplois."
        :level="2"
      />
      <div class="grid gap-8 mt-8 md:grid-cols-3">
        <div
          v-for="groupe in parCategorie"
          :key="groupe.categorie"
          class="flex flex-col gap-3"
        >
          <h3 class="text-lg/7 font-bold">
            Catégorie {{ groupe.categorie }}
          </h3>
          <ul class="flex flex-col">
            <li
              v-for="cadre in groupe.cadres"
              :key="cadre.slug"
              class="flex items-center justify-between gap-3 py-3 border-b border-default"
            >
              <span class="font-semibold text-highlighted">{{ cadre.nom }}</span>
              <UBadge
                color="neutral"
                variant="subtle"
                size="sm"
                class="shrink-0"
              >
                {{ cadre.filiere }}
              </UBadge>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="pt-6 border-t border-default max-w-190">
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
      <p class="mt-4 text-sm text-muted">
        Estimation indicative, hors NBI, supplément familial de traitement, indemnité différentielle, participation à la protection sociale complémentaire et prélèvement à la source.
      </p>
    </section>
  </div>
</template>
