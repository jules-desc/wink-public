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
      class="text-lg/[30px] text-muted whitespace-pre-line mb-7"
    >
      {{ contenuPage.introduction }}
    </div>

    <div class="space-y-7">
      <div
        v-for="section in sections"
        :key="section.key"
      >
        <template v-if="contenuPage[section.key]">
          <h3 class="text-xl/7 font-bold mb-2.5">
            {{ section.title }}
          </h3>
          <div class="text-muted whitespace-pre-line">
            {{ contenuPage[section.key] }}
          </div>
        </template>
      </div>
    </div>
  </div>

  <div
    v-else-if="description"
    class="text-lg/[30px] text-muted whitespace-pre-line"
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
