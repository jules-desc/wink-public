<script setup lang="ts">
defineProps<{
  photos: Array<{ url: string, caption: string | null, source: string }>
}>()
</script>

<template>
  <div
    v-if="photos.length"
    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
  >
    <figure
      v-for="(photo, i) in photos"
      :key="i"
      class="relative overflow-hidden rounded-lg aspect-[4/3]"
    >
      <img
        :src="photo.url"
        :alt="photo.caption || 'Photo'"
        loading="lazy"
        class="w-full h-full object-cover"
      >
      <figcaption
        v-if="photo.caption"
        class="absolute bottom-0 inset-x-0 px-2 py-1 text-xs text-white bg-black/50 truncate"
      >
        {{ photo.caption }}
      </figcaption>
    </figure>
  </div>
</template>
