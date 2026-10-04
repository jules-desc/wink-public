<script setup lang="ts">
// Signature du design system : filet vermillon 48×4, surtitre, titre.
withDefaults(defineProps<{
  kicker?: string
  title: string
  description?: string
  rule?: boolean
  align?: 'left' | 'center'
  level?: 2 | 3
}>(), {
  rule: true,
  align: 'left',
  level: 2
})
</script>

<template>
  <div
    class="flex flex-wrap items-end justify-between gap-6"
    :class="align === 'center' ? 'text-center' : ''"
  >
    <div
      class="flex flex-col gap-2"
      :class="align === 'center' ? 'items-center max-w-180 mx-auto' : 'items-start max-w-190'"
    >
      <span
        v-if="rule"
        class="mep-rule mb-1.5"
      />
      <span
        v-if="kicker"
        class="mep-kicker"
      >{{ kicker }}</span>
      <component
        :is="`h${level}`"
        class="font-bold"
        :class="level === 2 ? 'text-[32px]/10' : 'text-2xl/8'"
      >
        {{ title }}
      </component>
      <p
        v-if="description"
        class="text-lg/7 text-muted"
      >
        {{ description }}
      </p>
    </div>
    <slot name="action" />
  </div>
</template>
