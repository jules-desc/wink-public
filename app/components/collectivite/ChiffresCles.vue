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
      value: formatNumber(props.population),
      label: 'Habitants'
    })
  }
  if (props.effectifs != null) {
    items.push({
      icon: 'i-lucide-briefcase',
      value: formatNumber(props.effectifs),
      label: 'Agents'
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
      value: `${props.ratioFemmes.toFixed(0)} %`,
      label: 'Parité (femmes)'
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
    class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3"
  >
    <MepStatCard
      v-for="stat in stats"
      :key="stat.label"
      :icon="stat.icon"
      :value="stat.value"
      :label="stat.label"
    />
  </div>
</template>
