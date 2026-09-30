<script setup lang="ts">
const title = 'Wink Pages — Emploi et recrutement dans les collectivités territoriales'
const description = 'Découvrez les collectivités territoriales qui recrutent. Offres d\'emploi, marque employeur et informations pratiques pour chaque commune, intercommunalité et département de France.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogSiteName: 'Wink Pages',
  ogLocale: 'fr_FR',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="focus-visible:outline-3 outline-primary/25 rounded-md p-1 -ms-1 flex items-center gap-2"
          >
            <span class="text-lg font-bold text-primary">Wink Pages</span>
          </NuxtLink>
          <nav class="hidden sm:flex items-center gap-1">
            <UButton
              to="/"
              variant="ghost"
              color="neutral"
              size="sm"
            >
              Accueil
            </UButton>
            <UButton
              to="/region/53"
              variant="ghost"
              color="neutral"
              size="sm"
            >
              Régions
            </UButton>
            <UButton
              to="/departement/69"
              variant="ghost"
              color="neutral"
              size="sm"
            >
              Départements
            </UButton>
          </nav>
        </div>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          © {{ new Date().getFullYear() }} Wink Pages — Propulsé par <a
            href="https://wink-lab.com"
            target="_blank"
            class="text-primary hover:underline"
          >Wink</a>
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
