<script setup lang="ts">
const props = defineProps<{
  population: number | null
  effectifs: number | null
  budgetTotal: string | number | null
  ratioFemmes: number | null
  ageMoyen: number | null
}>()

const stats = computed(() => {
  const items = []
  if (props.population != null) {
    items.push({
      icon: 'i-lucide-users',
      value: formatPopulation(props.population),
      label: 'Population'
    })
  }
  if (props.effectifs != null) {
    items.push({
      icon: 'i-lucide-briefcase',
      value: formatEffectifs(props.effectifs),
      label: 'Effectifs'
    })
  }
  if (props.budgetTotal != null) {
    items.push({
      icon: 'i-lucide-banknote',
      value: formatBudget(props.budgetTotal),
      label: 'Budget'
    })
  }
  if (props.ratioFemmes != null) {
    items.push({
      icon: 'i-lucide-users',
      value: `${props.ratioFemmes.toFixed(0)}% femmes`,
      label: 'Parité'
    })
  }
  if (props.ageMoyen != null) {
    items.push({
      icon: 'i-lucide-clock',
      value: `${props.ageMoyen.toFixed(0)} ans`,
      label: 'Âge moyen'
    })
  }
  return items
})
</script>

<template>
  <div
    v-if="stats.length"
    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
  >
    <UCard
      v-for="stat in stats"
      :key="stat.label"
      class="text-center"
    >
      <div class="flex flex-col items-center gap-2">
        <UIcon
          :name="stat.icon"
          class="w-8 h-8 text-primary"
        />
        <div class="text-2xl font-bold text-primary">
          {{ stat.value }}
        </div>
        <div class="text-sm text-muted">
          {{ stat.label }}
        </div>
      </div>
    </UCard>
  </div>
</template>
