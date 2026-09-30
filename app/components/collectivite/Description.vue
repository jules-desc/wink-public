<script setup lang="ts">
import type { ContenuPage } from '~/types/api'

defineProps<{
  contenuPage: ContenuPage | null
  description: string | null
}>()

const sections = computed(() => {
  return [
    { key: 'pourquoiRejoindre', title: 'Pourquoi rejoindre cette collectivité ?' },
    { key: 'cadreDeVie', title: 'Cadre de vie' },
    { key: 'filieresMetiers', title: 'Filières et métiers' }
  ] as const
})
</script>

<template>
  <div v-if="contenuPage">
    <div
      v-if="contenuPage.introduction"
      class="text-lg text-muted leading-relaxed whitespace-pre-line mb-8"
    >
      {{ contenuPage.introduction }}
    </div>

    <div class="space-y-8">
      <div
        v-for="section in sections"
        :key="section.key"
      >
        <template v-if="contenuPage[section.key]">
          <h2 class="text-xl font-semibold mb-3">
            {{ section.title }}
          </h2>
          <div class="text-muted leading-relaxed whitespace-pre-line">
            {{ contenuPage[section.key] }}
          </div>
        </template>
      </div>
    </div>
  </div>

  <div
    v-else-if="description"
    class="text-lg text-muted leading-relaxed whitespace-pre-line"
  >
    {{ description }}
  </div>

  <UEmpty
    v-else
    icon="i-lucide-file-text"
    title="Contenu en cours de génération"
    description="Le contenu de cette page sera bientôt disponible."
  />
</template>
