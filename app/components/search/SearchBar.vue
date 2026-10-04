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

function onSubmit() {
  const target = results.value[activeIndex.value] ?? results.value[0]
  if (target) {
    navigateTo(`/etablissement/${target.slug}`)
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
    <form
      role="search"
      class="flex"
      @submit.prevent="onSubmit"
    >
      <div class="relative flex flex-1 items-center">
        <UIcon
          name="i-lucide-search"
          class="absolute left-4.5 size-5.5 text-dimmed pointer-events-none"
        />
        <input
          v-model="query"
          type="search"
          placeholder="Rechercher une commune, un département…"
          aria-label="Rechercher une commune, un département"
          role="combobox"
          :aria-expanded="isOpen"
          autocomplete="off"
          class="w-full h-14 pl-13 pr-4 text-lg text-highlighted bg-default border border-r-0 border-(--grey-300) rounded-none outline-none placeholder:text-dimmed focus:border-primary focus:shadow-[inset_0_0_0_1px_var(--ui-primary)]"
          @keydown="onKeydown"
        >
      </div>
      <button
        type="submit"
        class="h-14 px-6 bg-primary text-white font-semibold text-[17px] cursor-pointer transition-colors duration-[120ms] hover:bg-primary-900 active:bg-primary-950"
      >
        Rechercher
      </button>
    </form>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 z-50 mt-1 bg-default border border-default shadow-(--shadow-overlay) overflow-hidden"
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
          class="flex items-center gap-3 px-4 py-2.5 no-underline text-default border-t border-(--border-subtle) first:border-t-0 hover:bg-(--surface-brand-tint) transition-colors"
          :class="{ 'bg-(--surface-brand-tint)': index === activeIndex }"
          @click="close"
        >
          <UAvatar
            v-if="result.blasonUrl || result.logoUrl"
            :src="result.logoUrl || result.blasonUrl || undefined"
            :alt="result.nom"
            size="md"
          />
          <span
            v-else
            class="size-8 shrink-0 flex items-center justify-center bg-(--surface-brand-tint) text-primary"
          >
            <UIcon
              name="i-lucide-landmark"
              class="size-4"
            />
          </span>
          <div class="min-w-0 flex-1">
            <div class="font-semibold text-highlighted truncate">
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
