<script setup lang="ts">
withDefaults(defineProps<{
  kicker?: string
  title: string
  description?: string
  tone?: 'light' | 'brand'
}>(), {
  tone: 'light'
})
</script>

<template>
  <section
    :class="tone === 'brand'
      ? 'bg-(--blue-950) text-(--blue-100)'
      : 'bg-muted text-default border-b border-default'"
  >
    <div
      class="mep-container grid gap-12 items-center py-12 md:py-18"
      :class="$slots.aside ? 'lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]' : ''"
    >
      <div class="flex flex-col gap-5 max-w-190">
        <span
          v-if="kicker"
          class="mep-kicker"
          :class="tone === 'brand' ? 'text-(--red-100)!' : ''"
        >{{ kicker }}</span>
        <h1
          class="text-4xl/[44px] md:text-5xl/[56px] font-extrabold tracking-[-0.02em]"
          :class="tone === 'brand' ? 'text-white' : ''"
        >
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="text-lg/7 md:text-xl/8"
          :class="tone === 'brand' ? 'text-(--blue-200)' : 'text-muted'"
        >
          {{ description }}
        </p>
        <div
          v-if="$slots.default"
          class="flex flex-wrap gap-3 mt-2"
        >
          <slot />
        </div>
      </div>
      <div v-if="$slots.aside">
        <slot name="aside" />
      </div>
    </div>
  </section>
</template>
