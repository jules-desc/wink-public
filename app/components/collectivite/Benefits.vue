<script setup lang="ts">
defineProps<{
  benefits: string[]
}>()

const benefitIcon = (b: string): string => {
  const lower = b.toLowerCase()
  if (/t[ée]l[ée]travail|remote/i.test(lower)) return 'i-lucide-laptop'
  if (/restaura|cantine|repas/i.test(lower)) return 'i-lucide-utensils'
  if (/rtt|cong[ée]|vacance/i.test(lower)) return 'i-lucide-calendar-days'
  if (/mutuelle|sant[ée]|pr[ée]voyance/i.test(lower)) return 'i-lucide-heart-pulse'
  if (/transport|mobilit/i.test(lower)) return 'i-lucide-train-front'
  if (/formation|d[ée]veloppement/i.test(lower)) return 'i-lucide-graduation-cap'
  if (/famille|cr[èe]che|enfant/i.test(lower)) return 'i-lucide-baby'
  if (/sport|loisir/i.test(lower)) return 'i-lucide-dumbbell'
  if (/prime|r[ée]mun/i.test(lower)) return 'i-lucide-coins'
  if (/parking|v[ée]hicule/i.test(lower)) return 'i-lucide-car'
  return 'i-lucide-check-circle'
}
</script>

<template>
  <div
    v-if="benefits.length"
    class="grid grid-cols-1 sm:grid-cols-2 gap-3"
  >
    <div
      v-for="benefit in benefits"
      :key="benefit"
      class="flex items-start gap-3 p-3 rounded-lg bg-elevated"
    >
      <UIcon
        :name="benefitIcon(benefit)"
        class="w-5 h-5 text-primary shrink-0 mt-0.5"
      />
      <span class="text-sm">{{ benefit }}</span>
    </div>
  </div>
</template>
