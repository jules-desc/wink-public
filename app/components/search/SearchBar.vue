<script setup lang="ts">
const { query, results, isLoading, clear } = useSearch()
const isOpen = ref(false)
const activeIndex = ref(-1)
const containerRef = ref<HTMLElement | null>(null)

watch(results, (val) => {
  isOpen.value = val.length > 0 || (isLoading.value && query.value.length >= 2)
  activeIndex.value = -1
})

watch(query, (val) => {
  if (val.length >= 2) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
})

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, -1)
  } else if (e.key === 'Enter' && activeIndex.value >= 0 && results.value[activeIndex.value]) {
    e.preventDefault()
    navigateTo(`/etablissement/${results.value[activeIndex.value]!.slug}`)
    close()
  } else if (e.key === 'Escape') {
    close()
  }
}

function close() {
  isOpen.value = false
  clear()
}

function onDocumentClick(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full"
  >
    <UInput
      v-model="query"
      size="xl"
      icon="i-lucide-search"
      placeholder="Rechercher une commune, un département..."
      class="w-full"
      :loading="isLoading"
      role="combobox"
      :aria-expanded="isOpen"
      autocomplete="off"
      @keydown="onKeydown"
    />

    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 z-50 mt-1 bg-default border border-default rounded-lg shadow-lg overflow-hidden"
    >
      <!-- Loading -->
      <div
        v-if="isLoading && !results.length"
        class="p-3 space-y-2"
      >
        <USkeleton
          v-for="i in 3"
          :key="i"
          class="h-10 w-full"
        />
      </div>

      <!-- Results -->
      <template v-else-if="results.length">
        <NuxtLink
          v-for="(result, index) in results"
          :key="result.slug"
          :to="`/etablissement/${result.slug}`"
          class="flex items-center gap-3 px-4 py-3 hover:bg-elevated transition-colors"
          :class="{ 'bg-elevated': index === activeIndex }"
          @click="close"
        >
          <UAvatar
            v-if="result.blasonUrl || result.logoUrl"
            :src="result.logoUrl || result.blasonUrl || undefined"
            :alt="result.nom"
            size="sm"
          />
          <UIcon
            v-else
            name="i-lucide-landmark"
            class="w-5 h-5 text-muted"
          />
          <div class="min-w-0 flex-1">
            <div class="font-medium truncate">
              {{ result.nom }}
            </div>
            <div class="text-sm text-muted truncate">
              {{ collectiviteTypeLabel(result.type, result.sousType) }}
              <template v-if="result.departementNom">
                · {{ result.departementNom }}
              </template>
            </div>
          </div>
        </NuxtLink>
      </template>

      <!-- Empty -->
      <div
        v-else-if="query.length >= 2 && !isLoading"
        class="px-4 py-6 text-center text-muted"
      >
        Aucun résultat pour « {{ query }} »
      </div>
    </div>
  </div>
</template>
