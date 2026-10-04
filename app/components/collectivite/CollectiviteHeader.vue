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
  <div>
    <UBreadcrumb :items="breadcrumbItems" />

    <div
      class="mt-6 h-40 sm:h-60 bg-elevated overflow-hidden flex items-center justify-center gap-2 text-sm text-dimmed"
    >
      <img
        v-if="collectivite.bannerUrl"
        :src="collectivite.bannerUrl"
        :alt="`Bannière ${collectivite.nom}`"
        class="size-full object-cover"
      >
      <template v-else>
        <UIcon
          name="i-lucide-image"
          class="size-5"
        />
        Bannière de la collectivité
      </template>
    </div>

    <div class="flex flex-wrap items-start gap-6 -mt-10 px-4 sm:px-6">
      <span class="size-20 shrink-0 flex items-center justify-center bg-default ring ring-inset ring-default shadow-(--shadow-md)">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="collectivite.nom"
          class="size-[82%] object-contain"
        >
        <UIcon
          v-else
          name="i-lucide-landmark"
          class="size-10 text-primary"
        />
      </span>

      <div class="flex flex-1 flex-col gap-2 pt-12">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-3xl/10 md:text-[40px]/12 font-extrabold">
            {{ collectivite.nom }}
          </h1>
          <UBadge
            color="primary"
            variant="subtle"
          >
            {{ typeLabel }}
          </UBadge>
        </div>

        <span
          v-if="collectivite.departementNom || collectivite.regionNom"
          class="flex items-center gap-1.5 text-muted"
        >
          <UIcon
            name="i-lucide-map-pin"
            class="size-4"
          />
          {{ [collectivite.departementNom, collectivite.regionNom].filter(Boolean).join(', ') }}
        </span>

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
