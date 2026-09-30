<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <UMain class="flex items-center justify-center min-h-screen">
      <div class="text-center space-y-4">
        <p class="text-6xl font-bold text-primary">
          {{ error.statusCode }}
        </p>
        <h1 class="text-2xl font-semibold">
          {{ error.statusCode === 404 ? 'Page non trouvée' : 'Une erreur est survenue' }}
        </h1>
        <p class="text-muted max-w-md">
          {{ error.statusCode === 404
            ? 'La page que vous recherchez n\'existe pas ou a été déplacée.'
            : 'Un problème technique est survenu. Veuillez réessayer plus tard.' }}
        </p>
        <UButton
          size="lg"
          icon="i-lucide-home"
          @click="handleClear"
        >
          Retour à l'accueil
        </UButton>
      </div>
    </UMain>
  </UApp>
</template>
