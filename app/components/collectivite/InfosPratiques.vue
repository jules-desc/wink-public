<script setup lang="ts">
import type { CollectiviteDetail } from '~/types/api'

const props = defineProps<{
  collectivite: CollectiviteDetail
}>()

const socialLinks = computed(() => {
  const links = props.collectivite.socialMediaLinks
  if (!links || typeof links !== 'object') return []
  const iconMap: Record<string, string> = {
    facebook: 'i-simple-icons-facebook',
    linkedin: 'i-simple-icons-linkedin',
    x: 'i-simple-icons-x',
    twitter: 'i-simple-icons-x',
    instagram: 'i-simple-icons-instagram',
    youtube: 'i-simple-icons-youtube'
  }
  return Object.entries(links)
    .filter(([, url]) => url)
    .map(([platform, url]) => ({
      platform,
      url,
      icon: iconMap[platform] || 'i-lucide-globe'
    }))
})

const hasAnyInfo = computed(() => {
  const c = props.collectivite
  return c.adresseFormatee || c.telephone || c.email || c.siteWeb || c.horaires || socialLinks.value.length > 0
})
</script>

<template>
  <UCard v-if="hasAnyInfo">
    <div class="space-y-4">
      <div
        v-if="collectivite.adresseFormatee"
        class="flex items-start gap-3"
      >
        <UIcon
          name="i-lucide-map-pin"
          class="w-5 h-5 text-primary shrink-0 mt-0.5"
        />
        <span>{{ collectivite.adresseFormatee }}</span>
      </div>

      <div
        v-if="collectivite.telephone"
        class="flex items-center gap-3"
      >
        <UIcon
          name="i-lucide-phone"
          class="w-5 h-5 text-primary shrink-0"
        />
        <a
          :href="`tel:${collectivite.telephone}`"
          class="hover:underline"
        >
          {{ collectivite.telephone }}
        </a>
      </div>

      <div
        v-if="collectivite.email"
        class="flex items-center gap-3"
      >
        <UIcon
          name="i-lucide-mail"
          class="w-5 h-5 text-primary shrink-0"
        />
        <a
          :href="`mailto:${collectivite.email}`"
          class="hover:underline"
        >
          {{ collectivite.email }}
        </a>
      </div>

      <div
        v-if="collectivite.siteWeb"
        class="flex items-center gap-3"
      >
        <UIcon
          name="i-lucide-globe"
          class="w-5 h-5 text-primary shrink-0"
        />
        <a
          :href="collectivite.siteWeb"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:underline"
        >
          {{ collectivite.siteWeb.replace(/^https?:\/\//, '') }}
        </a>
      </div>

      <div
        v-if="collectivite.horaires"
        class="flex items-start gap-3"
      >
        <UIcon
          name="i-lucide-clock"
          class="w-5 h-5 text-primary shrink-0 mt-0.5"
        />
        <span class="whitespace-pre-line">{{ collectivite.horaires }}</span>
      </div>

      <div
        v-if="socialLinks.length"
        class="flex items-center gap-3 pt-2 border-t border-default"
      >
        <span class="text-sm text-muted">Réseaux sociaux</span>
        <div class="flex gap-2">
          <a
            v-for="link in socialLinks"
            :key="link.platform"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted hover:text-primary transition-colors"
          >
            <UIcon
              :name="link.icon"
              class="w-5 h-5"
            />
          </a>
        </div>
      </div>
    </div>
  </UCard>
</template>
