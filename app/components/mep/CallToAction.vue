<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
  actionIcon?: string
  icon?: string
  tone?: 'tint' | 'brand'
}>(), {
  actionIcon: 'i-lucide-arrow-right',
  tone: 'tint'
})
</script>

<template>
  <div
    class="flex flex-wrap items-center justify-between gap-8 px-6 py-8 md:px-12 md:py-10"
    :class="tone === 'brand' ? 'bg-primary text-(--blue-100)' : 'bg-(--surface-brand-tint) text-default'"
  >
    <div class="flex items-start gap-5 max-w-170">
      <UIcon
        v-if="icon"
        :name="icon"
        class="size-8 shrink-0 mt-1"
        :class="tone === 'brand' ? 'text-white' : 'text-primary'"
      />
      <div class="flex flex-col gap-2">
        <h2
          class="text-2xl/8 font-bold"
          :class="tone === 'brand' ? 'text-white' : ''"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          :class="tone === 'brand' ? 'text-(--blue-100)' : 'text-muted'"
        >
          {{ description }}
        </p>
      </div>
    </div>
    <UButton
      v-if="actionLabel"
      size="lg"
      :to="actionTo"
      :trailing-icon="actionIcon"
      :color="tone === 'brand' ? 'neutral' : 'primary'"
      :variant="tone === 'brand' ? 'outline' : 'solid'"
    >
      {{ actionLabel }}
    </UButton>
  </div>
</template>
