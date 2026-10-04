<script setup lang="ts">
import type { CollectiviteSummary } from '~/types/api'

defineProps<{
  collectivites: CollectiviteSummary[]
  loading?: boolean
}>()
</script>

<template>
  <div
    v-if="loading"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <USkeleton
      v-for="i in 6"
      :key="i"
      class="h-[118px]"
    />
  </div>

  <div
    v-else-if="collectivites.length"
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <ListingCollectiviteCard
      v-for="c in collectivites"
      :key="c.id"
      :collectivite="c"
    />
  </div>

  <UEmpty
    v-else
    icon="i-lucide-search-x"
    title="Aucune collectivité trouvée"
    description="Aucune collectivité ne correspond à vos critères."
  />
</template>
