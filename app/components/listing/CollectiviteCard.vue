<script setup lang="ts">
import type { CollectiviteSummary } from '~/types/api'

const props = defineProps<{
  collectivite: CollectiviteSummary
}>()

const typeLabel = computed(() =>
  collectiviteTypeLabel(props.collectivite.type, props.collectivite.sousType)
)

const avatarUrl = computed(() =>
  props.collectivite.logoUrl || props.collectivite.blasonUrl || undefined
)
</script>

<template>
  <NuxtLink
    :to="`/etablissement/${collectivite.slug}`"
    class="block"
  >
    <UCard class="h-full hover:ring-primary hover:ring-1 transition-shadow">
      <div class="flex items-start gap-3">
        <UAvatar
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="collectivite.nom"
          size="lg"
          class="shrink-0"
        />
        <div
          v-else
          class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0"
        >
          <UIcon
            name="i-lucide-landmark"
            class="w-5 h-5 text-primary"
          />
        </div>

        <div class="min-w-0 flex-1 space-y-1">
          <h3 class="font-semibold truncate">
            {{ collectivite.nom }}
          </h3>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ typeLabel }}
            </UBadge>
            <span
              v-if="collectivite.departementNom"
              class="text-sm text-muted"
            >
              {{ collectivite.departementNom }}
            </span>
          </div>
          <div
            v-if="collectivite.population"
            class="text-sm text-muted"
          >
            {{ formatPopulation(collectivite.population) }}
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
