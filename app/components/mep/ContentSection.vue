<script setup lang="ts">
// Section de contenu d'une page interne : filet supérieur, en-tête de niveau 3.
defineProps<{
  title: string
  kicker?: string
}>()
</script>

<template>
  <section class="py-12 border-t border-default">
    <MepSectionHeader
      :kicker="kicker"
      :title="title"
      :level="3"
    />
    <div class="mt-6">
      <slot />
    </div>
  </section>
</template>
