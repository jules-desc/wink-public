<script setup lang="ts">
// Filtres par thématique et par type de collectivité, portés par l'URL (?thematique=…&typeCollectivite=…).
defineProps<{
  thematiques: string[]
}>()

const route = useRoute()
const current = computed(() => ({
  thematique: typeof route.query.thematique === 'string' ? route.query.thematique : undefined,
  typeCollectivite: typeof route.query.typeCollectivite === 'string' ? route.query.typeCollectivite : undefined
}))

function toQuery(key: 'thematique' | 'typeCollectivite', value?: string) {
  const query = { ...route.query, [key]: value, page: undefined }
  return { query }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="thematiques.length"
      class="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filtrer par thème"
    >
      <span class="text-sm font-semibold text-highlighted mr-1">Thème</span>
      <NuxtLink
        :to="toQuery('thematique')"
        class="no-underline"
      >
        <UBadge
          color="primary"
          :variant="!current.thematique ? 'solid' : 'outline'"
        >
          Tous
        </UBadge>
      </NuxtLink>
      <NuxtLink
        v-for="t in thematiques"
        :key="t"
        :to="toQuery('thematique', t)"
        class="no-underline"
      >
        <UBadge
          color="primary"
          :variant="current.thematique === t ? 'solid' : 'outline'"
        >
          {{ THEMATIQUES[t] || t }}
        </UBadge>
      </NuxtLink>
    </div>

    <div
      class="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filtrer par type de collectivité"
    >
      <span class="text-sm font-semibold text-highlighted mr-1">Collectivité</span>
      <NuxtLink
        v-for="(label, value) in TYPES_COLLECTIVITE"
        :key="value"
        :to="toQuery('typeCollectivite', value === 'tous' ? undefined : value)"
        class="no-underline"
      >
        <UBadge
          color="neutral"
          :variant="(current.typeCollectivite ?? 'tous') === value ? 'solid' : 'outline'"
        >
          {{ label }}
        </UBadge>
      </NuxtLink>
    </div>
  </div>
</template>
