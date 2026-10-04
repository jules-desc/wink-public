<script setup lang="ts">
import type { RessourceDetail } from '~/types/ressources'

const config = useRuntimeConfig()
const route = useRoute()

const rubrique = rubriqueBySegment(String(route.params.rubrique))
const slug = String(route.params.slug)
if (!rubrique) {
  throw createError({ statusCode: 404, statusMessage: 'Rubrique non trouvée', fatal: true })
}

const { data, error } = await useFetch<RessourceDetail>(`/api/ressources/${rubrique.segment}/${slug}`)
if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ressource non trouvée', fatal: true })
}

const r = data.value
const canonicalUrl = `${config.public.siteUrl}/ressources/${rubrique.segment}/${slug}`

const faq = computed(() => (Array.isArray(r.faq) ? r.faq : []))
const sources = computed(() => (Array.isArray(r.sources) ? r.sources : []))
const meta = computed(() => r.meta ?? {})

const seoTitle = r.titreSeo || r.titre
const seoDescription = r.metaDescription || r.chapo

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogUrl: canonicalUrl,
  ogType: 'article',
  articlePublishedTime: r.datePublication,
  articleModifiedTime: r.dateMiseAJour ?? undefined
})

const jsonLd: Record<string, unknown>[] = [{
  '@context': 'https://schema.org',
  '@type': rubrique.type === 'ACTUALITE' ? 'NewsArticle' : 'Article',
  'headline': r.titre,
  'description': r.chapo,
  'datePublished': r.datePublication,
  'dateModified': r.dateMiseAJour || r.datePublication,
  'author': { '@type': 'Organization', 'name': r.auteur || 'Mon Employeur Public' },
  'publisher': { '@type': 'Organization', 'name': 'Mon Employeur Public' },
  'mainEntityOfPage': canonicalUrl
}, {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': config.public.siteUrl || '/' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Ressources', 'item': `${config.public.siteUrl}/ressources` },
    { '@type': 'ListItem', 'position': 3, 'name': rubrique.label, 'item': `${config.public.siteUrl}/ressources/${rubrique.segment}` },
    { '@type': 'ListItem', 'position': 4, 'name': r.titre }
  ]
}]
if (faq.value.length) {
  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faq.value.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.reponse }
    }))
  })
}

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }]
})

const breadcrumb = [
  { label: 'Accueil', to: '/' },
  { label: 'Ressources', to: '/ressources' },
  { label: rubrique.label, to: `/ressources/${rubrique.segment}` },
  { label: r.titre }
]

const metaLine = [
  `Publié le ${formatDateLong(r.datePublication)}`,
  r.dateMiseAJour && r.dateMiseAJour !== r.datePublication ? `mis à jour le ${formatDateLong(r.dateMiseAJour)}` : null,
  r.tempsLecture ? `${r.tempsLecture} min de lecture` : null
].filter(Boolean).join(' · ')

// Encadré « en bref » des fiches métiers
const metierFacts = computed(() => {
  if (rubrique.type !== 'METIER') return []
  const m = meta.value
  const cadres = Array.isArray(m.cadresEmplois) ? (m.cadresEmplois as string[]).join(', ') : null
  return [
    m.filiere ? { label: 'Filière', value: String(m.filiere) } : null,
    m.categorie ? { label: 'Catégorie', value: String(m.categorie) } : null,
    cadres ? { label: 'Cadre(s) d\'emplois', value: cadres } : null,
    m.famille ? { label: 'Famille de métiers', value: String(m.famille) } : null
  ].filter((x): x is { label: string, value: string } => Boolean(x))
})

const copied = ref(false)
async function copyModele() {
  if (!r.modele) return
  await navigator.clipboard.writeText(r.modele.source)
  copied.value = true
  setTimeout(() => (copied.value = false), 2500)
}

const faqItems = computed(() => faq.value.map(f => ({ label: f.question, content: f.reponse })))
</script>

<template>
  <article class="mep-container pt-8 pb-20">
    <!-- eslint-disable vue/no-v-html -- HTML rendu côté serveur depuis le Markdown versionné du dépôt -->
    <UBreadcrumb :items="breadcrumb" />

    <header class="mt-6 pb-8 border-b border-default flex flex-col gap-4 max-w-200">
      <span class="mep-rule" />
      <NuxtLink
        :to="`/ressources/${rubrique.segment}`"
        class="mep-kicker no-underline hover:underline"
      >
        {{ rubrique.kicker }}
      </NuxtLink>
      <h1 class="font-serif text-[34px]/[42px] md:text-5xl/[56px] font-semibold tracking-[-0.02em]">
        {{ r.titre }}
      </h1>
      <p class="text-lg/7 md:text-xl/8 text-muted">
        {{ r.chapo }}
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm text-dimmed mr-2">{{ metaLine }}</span>
        <UBadge
          v-for="t in r.thematiques"
          :key="t"
          color="neutral"
          variant="subtle"
          size="sm"
        >
          {{ THEMATIQUES[t] || t }}
        </UBadge>
      </div>
    </header>

    <div class="grid gap-12 mt-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div class="min-w-0">
        <dl
          v-if="metierFacts.length"
          class="grid gap-4 p-6 mb-10 bg-muted ring ring-inset ring-default sm:grid-cols-2"
        >
          <div
            v-for="fact in metierFacts"
            :key="fact.label"
          >
            <dt class="text-[13px]/[18px] text-muted">
              {{ fact.label }}
            </dt>
            <dd class="font-semibold text-highlighted">
              {{ fact.value }}
            </dd>
          </div>
        </dl>

        <div
          class="mep-prose max-w-190"
          v-html="r.html"
        />

        <section
          v-if="r.modele"
          id="le-modele"
          class="mt-12 max-w-190"
        >
          <div class="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-primary text-white">
            <h2 class="text-xl/7 font-bold text-white">
              Le modèle
            </h2>
            <UButton
              color="neutral"
              variant="outline"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              @click="copyModele"
            >
              {{ copied ? 'Copié' : 'Copier le modèle' }}
            </UButton>
          </div>
          <div
            class="mep-prose p-6 ring ring-inset ring-default"
            v-html="r.modele.html"
          />
        </section>

        <div
          v-if="r.htmlApres"
          class="mep-prose max-w-190 mt-12"
          v-html="r.htmlApres"
        />

        <section
          v-if="faqItems.length"
          class="mt-14 max-w-190"
        >
          <MepSectionHeader
            title="Questions fréquentes"
            :level="2"
          />
          <UAccordion
            class="mt-6"
            type="multiple"
            :items="faqItems"
            :ui="{ trigger: 'text-base font-semibold text-highlighted py-4', body: 'text-default pb-5' }"
          />
        </section>

        <section
          v-if="sources.length"
          class="mt-14 max-w-190 pt-6 border-t border-default"
        >
          <h2 class="text-lg/7 font-bold">
            Sources
          </h2>
          <ul class="mt-3 flex flex-col gap-2 text-[15px]/6">
            <li
              v-for="s in sources"
              :key="s.url"
              class="flex gap-2"
            >
              <UIcon
                name="i-lucide-external-link"
                class="size-4 mt-1 shrink-0 text-dimmed"
              />
              <a
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
              >{{ s.titre }}</a>
            </li>
          </ul>
          <p class="mt-4 text-sm text-muted">
            Ce contenu est informatif et ne remplace pas l'avis de votre centre de gestion. Une erreur ? Écrivez à
            <a href="mailto:contact@wink-lab.com">contact@wink-lab.com</a>.
          </p>
        </section>
      </div>

      <aside class="hidden lg:block">
        <nav
          v-if="r.toc.length > 1"
          aria-label="Sommaire"
          class="sticky top-6 flex flex-col gap-3"
        >
          <span class="mep-kicker">Sommaire</span>
          <ol class="flex flex-col border-l border-default">
            <li
              v-for="entry in r.toc"
              :key="entry.id"
            >
              <a
                :href="`#${entry.id}`"
                class="block -ml-px pl-4 py-1.5 text-sm text-muted no-underline border-l-2 border-transparent hover:text-primary hover:border-primary"
              >{{ entry.text }}</a>
            </li>
          </ol>
        </nav>
      </aside>
    </div>

    <section
      v-if="r.lies.length"
      class="mt-16 pt-12 border-t border-default"
    >
      <MepSectionHeader
        kicker="Pour aller plus loin"
        title="Sur le même sujet"
      />
      <div class="grid gap-8 mt-8 md:grid-cols-3">
        <RessourceCard
          v-for="lie in r.lies"
          :key="lie.id"
          :ressource="lie"
        />
      </div>
    </section>

    <RessourceNewsletterForm
      class="mt-16"
      tone="brand"
    />
  </article>
</template>
