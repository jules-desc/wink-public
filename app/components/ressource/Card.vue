<script setup lang="ts">
const props = withDefaults(defineProps<{
  ressource: {
    slug: string
    type: string
    titre: string
    chapo: string
    tempsLecture: number | null
    datePublication: string | Date
  }
  size?: 'md' | 'lg'
  showKicker?: boolean
}>(), {
  size: 'md',
  showKicker: true
})

const rubrique = computed(() => rubriqueByType(props.ressource.type))
const meta = computed(() => [
  formatDateLong(props.ressource.datePublication),
  props.ressource.tempsLecture ? `${props.ressource.tempsLecture} min de lecture` : null
].filter(Boolean).join(' · '))
</script>

<template>
  <NuxtLink
    :to="ressourcePath(ressource.type, ressource.slug)"
    class="group flex flex-col gap-2.5 pt-5 border-t-2 border-(--grey-900) no-underline text-inherit"
  >
    <span
      v-if="showKicker && rubrique"
      class="mep-kicker"
    >{{ rubrique.kicker }}</span>
    <h3
      class="font-serif font-semibold tracking-[-0.01em] underline-offset-4 decoration-1 group-hover:underline group-hover:text-primary"
      :class="size === 'lg' ? 'text-[32px]/10' : 'text-[22px]/[29px]'"
    >
      {{ ressource.titre }}
    </h3>
    <p
      class="text-muted"
      :class="size === 'lg' ? 'text-lg/7' : 'text-[15px]/6'"
    >
      {{ ressource.chapo }}
    </p>
    <span class="text-[13px]/[18px] text-dimmed">{{ meta }}</span>
  </NuxtLink>
</template>
