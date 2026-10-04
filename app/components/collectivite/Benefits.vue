<script setup lang="ts">
defineProps<{
  benefits: string[]
}>()
</script>

<template>
  <div
    v-if="benefits.length"
    class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
  >
    <MepBenefitItem
      v-for="benefit in benefits"
      :key="benefit"
      :label="benefit"
    />
  </div>
</template>
