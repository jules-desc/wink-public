<script setup lang="ts">
import type { CollectiviteDetail } from '~/types/api'

const props = defineProps<{
  collectivite: CollectiviteDetail
}>()

const typeLabel = computed(() =>
  collectiviteTypeLabel(props.collectivite.type, props.collectivite.sousType)
)

const breadcrumbItems = computed(() => {
  const items = [{ label: 'Accueil', to: '/' }]
  if (props.collectivite.regionNom && props.collectivite.regionCode) {
    items.push({
      label: props.collectivite.regionNom,
      to: `/region/${props.collectivite.regionCode}`
    })
  }
  if (props.collectivite.departementNom && props.collectivite.departementCode) {
    items.push({
      label: props.collectivite.departementNom,
      to: `/departement/${props.collectivite.departementCode}`
    })
  }
  items.push({ label: props.collectivite.nom, to: '' })
  return items
})

const avatarUrl = computed(() =>
  props.collectivite.branding?.logoMainUrl
  || props.collectivite.logoUrl
  || props.collectivite.blasonUrl
  || undefined
)
</script>

<template>
  <div class="space-y-6">
    <UBreadcrumb :items="breadcrumbItems" />

    <div
      v-if="collectivite.bannerUrl"
      class="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden"
    >
      <img
        :src="collectivite.bannerUrl"
        :alt="`Bannière ${collectivite.nom}`"
        class="w-full h-full object-cover"
      >
    </div>

    <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      <UAvatar
        v-if="avatarUrl"
        :src="avatarUrl"
        :alt="collectivite.nom"
        size="3xl"
        class="shrink-0"
      />
      <div
        v-else
        class="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 shrink-0"
      >
        <UIcon
          name="i-lucide-landmark"
          class="w-10 h-10 text-primary"
        />
      </div>

      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-3xl font-bold tracking-tight">
            {{ collectivite.nom }}
          </h1>
          <UBadge
            color="primary"
            variant="subtle"
          >
            {{ typeLabel }}
          </UBadge>
        </div>

        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
          <span
            v-if="collectivite.departementNom || collectivite.regionNom"
            class="flex items-center gap-1"
          >
            <UIcon name="i-lucide-map-pin" />
            <span>
              {{ [collectivite.departementNom, collectivite.regionNom].filter(Boolean).join(', ') }}
            </span>
          </span>
        </div>

        <div
          v-if="collectivite.codesPostaux.length"
          class="flex flex-wrap gap-1"
        >
          <UBadge
            v-for="cp in collectivite.codesPostaux.slice(0, 5)"
            :key="cp"
            variant="subtle"
            color="neutral"
            size="sm"
          >
            {{ cp }}
          </UBadge>
          <UBadge
            v-if="collectivite.codesPostaux.length > 5"
            variant="subtle"
            color="neutral"
            size="sm"
          >
            +{{ collectivite.codesPostaux.length - 5 }}
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
