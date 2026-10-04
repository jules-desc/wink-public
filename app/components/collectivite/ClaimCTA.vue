<script setup lang="ts">
defineProps<{
  collectiviteNom: string
  isClaimed: boolean
}>()
</script>

<template>
  <div v-if="isClaimed">
    <UBadge
      color="success"
      variant="subtle"
      size="lg"
      icon="i-lucide-badge-check"
    >
      Page vérifiée
    </UBadge>
  </div>

  <template v-else>
    <!-- Desktop : encart de la colonne latérale -->
    <div class="hidden lg:flex flex-col gap-3 p-5 bg-(--surface-brand-tint)">
      <strong class="text-highlighted">Vous gérez le recrutement ?</strong>
      <p class="text-sm text-muted">
        Réclamez la page de {{ collectiviteNom }} pour personnaliser votre marque employeur et publier vos offres.
      </p>
      <UButton
        to="#claim"
        block
        icon="i-lucide-hand"
      >
        Réclamez cette page
      </UButton>
    </div>

    <!-- Mobile : CTA collant -->
    <div class="fixed bottom-0 inset-x-0 z-50 p-4 bg-default/95 backdrop-blur border-t border-default lg:hidden">
      <UButton
        to="#claim"
        block
        size="lg"
        icon="i-lucide-hand"
      >
        Réclamez cette page
      </UButton>
    </div>
  </template>
</template>
