<script setup lang="ts">
defineProps<{
  icon?: string
  value: string
  label: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5 p-5 bg-default ring ring-inset ring-default">
    <UIcon
      v-if="icon"
      :name="icon"
      class="size-6 text-primary mb-1.5"
    />
    <span class="text-[26px]/8 font-extrabold tracking-[-0.02em] text-primary tabular-nums">{{ value }}</span>
    <span class="text-sm text-muted">{{ label }}</span>
  </div>
</template>
