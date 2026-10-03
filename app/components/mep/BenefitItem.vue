<script setup lang="ts">
const props = defineProps<{
  label: string
  icon?: string
}>()

function benefitIcon(b: string): string {
  const l = b.toLowerCase()
  if (/t[ée]l[ée]travail|remote/.test(l)) return 'i-lucide-laptop'
  if (/restaura|cantine|repas/.test(l)) return 'i-lucide-utensils'
  if (/rtt|cong[ée]|vacance/.test(l)) return 'i-lucide-calendar-days'
  if (/mutuelle|sant[ée]|pr[ée]voyance/.test(l)) return 'i-lucide-heart-pulse'
  if (/transport|mobilit/.test(l)) return 'i-lucide-train-front'
  if (/formation|d[ée]veloppement/.test(l)) return 'i-lucide-graduation-cap'
  if (/famille|cr[èe]che|enfant/.test(l)) return 'i-lucide-baby'
  if (/sport|loisir/.test(l)) return 'i-lucide-dumbbell'
  if (/prime|r[ée]mun/.test(l)) return 'i-lucide-coins'
  if (/parking|v[ée]hicule/.test(l)) return 'i-lucide-car'
  return 'i-lucide-circle-check'
}

const iconName = computed(() => props.icon || benefitIcon(props.label))
</script>

<template>
  <div class="flex items-start gap-3 px-4 py-3.5 bg-muted ring ring-inset ring-(--border-subtle)">
    <UIcon
      :name="iconName"
      class="size-5 shrink-0 mt-px text-primary"
    />
    <span class="text-[15px]/[22px]">{{ label }}</span>
  </div>
</template>
