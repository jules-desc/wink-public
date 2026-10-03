<script setup lang="ts">
import type { OffreEmploi } from '~/types/api'

const props = defineProps<{
  offres: OffreEmploi[]
  collectiviteNom: string
  offresCount?: number
}>()

const displayedOffres = computed(() => props.offres.slice(0, 10))
const hasMore = computed(() => (props.offresCount ?? props.offres.length) > 10)
</script>

<template>
  <div v-if="offres.length">
    <div class="space-y-3">
      <UCard
        v-for="offre in displayedOffres"
        :key="offre.id"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="space-y-2">
            <h3 class="text-lg/[26px] font-bold">
              {{ offre.titre }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-if="offre.contractType"
                color="primary"
                variant="subtle"
              >
                {{ formatContractType(offre.contractType) }}
              </UBadge>
              <UBadge
                v-if="offre.workSchedule"
                color="neutral"
                variant="subtle"
              >
                {{ formatWorkSchedule(offre.workSchedule) }}
              </UBadge>
              <UBadge
                v-for="cat in offre.publicGradeCategories"
                :key="cat"
                color="neutral"
                variant="outline"
              >
                {{ formatCategory(cat) }}
              </UBadge>
            </div>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span
                v-if="offre.adresseVille"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-map-pin" />
                {{ offre.adresseVille }}
              </span>
              <span
                v-if="offre.remote && offre.remote !== 'ON_SITE'"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-laptop" />
                {{ formatRemote(offre.remote) }}
              </span>
              <span
                v-if="offre.salaryMin || offre.salaryMax"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-coins" />
                {{ formatSalary(offre.salaryMin, offre.salaryMax, offre.salaryPeriod) }}
              </span>
              <span
                v-if="offre.experience"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-award" />
                {{ offre.experience }}
              </span>
              <span
                v-if="offre.datePublication"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-calendar" />
                {{ formatRelativeDate(offre.datePublication) }}
              </span>
              <span
                v-if="offre.dateLimite"
                class="flex items-center gap-1 text-warning"
              >
                <UIcon name="i-lucide-alarm-clock" />
                Limite : {{ new Date(offre.dateLimite).toLocaleDateString('fr-FR') }}
              </span>
            </div>
          </div>
          <UButton
            v-if="offre.urlSource"
            :to="offre.urlSource"
            target="_blank"
            variant="outline"
            color="primary"
            trailing-icon="i-lucide-external-link"
            class="shrink-0"
          >
            Voir l'offre
          </UButton>
        </div>
      </UCard>
    </div>

    <p
      v-if="hasMore"
      class="text-center text-sm text-muted mt-4"
    >
      Et {{ (offresCount ?? offres.length) - 10 }} autre(s) offre(s) disponible(s).
    </p>
  </div>

  <UEmpty
    v-else
    icon="i-lucide-briefcase"
    title="Aucune offre d'emploi en cours"
    :description="`${collectiviteNom} n'a pas d'offre d'emploi publiée actuellement.`"
  />
</template>
