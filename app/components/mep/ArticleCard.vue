<script setup lang="ts">
// Carte d'article du média. Pas encore de modèle d'article dans le code :
// le composant est prêt pour la section Ressources.
withDefaults(defineProps<{
  title: string
  to: string
  kicker?: string
  excerpt?: string
  date?: string
  readingTime?: string
  imageSrc?: string
  layout?: 'vertical' | 'horizontal'
  size?: 'md' | 'lg'
}>(), {
  layout: 'vertical',
  size: 'md'
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="group grid no-underline text-inherit"
    :class="layout === 'horizontal' ? 'grid-cols-[minmax(120px,2fr)_3fr] gap-5' : 'grid-cols-1 gap-4'"
  >
    <div
      class="overflow-hidden bg-elevated flex items-center justify-center text-(--grey-300)"
      :class="layout === 'horizontal' ? 'aspect-4/3' : 'aspect-video'"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
        alt=""
        loading="lazy"
        class="size-full object-cover transition-transform duration-400 ease-(--ease-standard) group-hover:scale-[1.03]"
      >
      <UIcon
        v-else
        name="i-lucide-image"
        class="size-8"
      />
    </div>
    <div class="flex flex-col gap-2">
      <span
        v-if="kicker"
        class="mep-kicker"
      >{{ kicker }}</span>
      <h3
        class="font-serif font-semibold tracking-[-0.01em] underline-offset-4 decoration-1 group-hover:underline group-hover:text-primary"
        :class="size === 'lg' ? 'text-[32px]/10' : layout === 'horizontal' ? 'text-xl/[26px]' : 'text-[22px]/[29px]'"
      >
        {{ title }}
      </h3>
      <p
        v-if="excerpt"
        class="text-muted"
        :class="size === 'lg' ? 'text-lg/7' : 'text-[15px]/6'"
      >
        {{ excerpt }}
      </p>
      <span
        v-if="date || readingTime"
        class="text-[13px]/[18px] text-dimmed"
      >
        {{ [date, readingTime].filter(Boolean).join(' · ') }}
      </span>
    </div>
  </NuxtLink>
</template>
