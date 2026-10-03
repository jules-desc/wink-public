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
    class="block h-full p-5 bg-default ring ring-inset ring-default no-underline text-default transition-shadow duration-[120ms] hover:ring-primary hover:shadow-(--shadow-sm)"
  >
    <div class="flex items-start gap-3.5">
      <UAvatar
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="collectivite.nom"
        class="size-14"
      />
      <span
        v-else
        class="size-14 shrink-0 flex items-center justify-center bg-(--surface-brand-tint) text-primary"
      >
        <UIcon
          name="i-lucide-landmark"
          class="size-7"
        />
      </span>

      <div class="min-w-0 flex-1 flex flex-col gap-1.5">
        <h3 class="text-[17px]/6 font-bold truncate">
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
        <span
          v-if="collectivite.population"
          class="text-sm text-muted"
        >
          {{ formatPopulation(collectivite.population) }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
