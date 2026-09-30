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
    >
      <UIcon
        name="i-lucide-badge-check"
        class="mr-1"
      />
      Page vérifiée
    </UBadge>
  </div>

  <template v-else>
    <!-- Desktop -->
    <div class="hidden lg:block">
      <UPageCTA
        title="Vous gérez le recrutement ?"
        :description="`Réclamez la page de ${collectiviteNom} pour personnaliser votre marque employeur et publier vos offres.`"
        variant="subtle"
        :links="[{
          label: 'Réclamez cette page',
          to: '#claim',
          icon: 'i-lucide-hand',
          size: 'lg' as const
        }]"
      />
    </div>

    <!-- Mobile sticky -->
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
