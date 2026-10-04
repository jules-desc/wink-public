<script setup lang="ts">
defineProps<{
  competences: string[]
}>()
</script>

<template>
  <div
    v-if="competences.length"
    class="flex flex-wrap gap-2"
  >
    <UBadge
      v-for="comp in competences"
      :key="comp"
      color="neutral"
      variant="subtle"
    >
      {{ comp }}
    </UBadge>
  </div>
</template>
