<script setup lang="ts">
withDefaults(defineProps<{
  inverse?: boolean
  height?: number
}>(), {
  inverse: false,
  height: 48
})
</script>

<template>
  <img
    :src="inverse ? '/brand/logo-inverse.svg' : '/brand/logo.svg'"
    alt="Mon Employeur Public — une initiative Wink"
    :style="{ height: `${height}px`, width: 'auto' }"
    class="block self-start"
  >
</template>
