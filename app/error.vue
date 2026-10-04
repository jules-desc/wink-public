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
    <div class="min-h-screen flex flex-col">
      <MepHeader />
      <main class="flex-1 flex items-center">
        <div class="mep-container w-full py-20">
          <div class="flex flex-col items-start gap-4 max-w-190">
            <span class="mep-rule" />
            <span class="mep-kicker">Erreur {{ error.statusCode }}</span>
            <h1 class="text-3xl/10 md:text-[40px]/12 font-extrabold">
              {{ error.statusCode === 404 ? 'Page non trouvée' : 'Une erreur est survenue' }}
            </h1>
            <p class="text-lg/7 text-muted">
              {{ error.statusCode === 404
                ? 'La page que vous recherchez n\'existe pas ou a été déplacée.'
                : 'Un problème technique est survenu. Veuillez réessayer plus tard.' }}
            </p>
            <UButton
              class="mt-2"
              size="lg"
              icon="i-lucide-house"
              @click="handleClear"
            >
              Retour à l'accueil
            </UButton>
          </div>
        </div>
      </main>
      <MepFooter />
    </div>
  </UApp>
</template>
