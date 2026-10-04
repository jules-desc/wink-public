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

const items = computed(() => {
  const c = props.collectivite
  const list: Array<{ icon: string, label: string, value: string, href?: string, external?: boolean }> = []
  if (c.adresseFormatee) list.push({ icon: 'i-lucide-map-pin', label: 'Adresse', value: c.adresseFormatee })
  if (c.telephone) list.push({ icon: 'i-lucide-phone', label: 'Téléphone', value: c.telephone, href: `tel:${c.telephone}` })
  if (c.email) list.push({ icon: 'i-lucide-mail', label: 'E-mail', value: c.email, href: `mailto:${c.email}` })
  if (c.siteWeb) list.push({ icon: 'i-lucide-globe', label: 'Site web', value: c.siteWeb.replace(/^https?:\/\//, ''), href: c.siteWeb, external: true })
  if (c.horaires) list.push({ icon: 'i-lucide-clock', label: 'Horaires', value: c.horaires })
  return list
})

const hasAnyInfo = computed(() => {
  const c = props.collectivite
  return c.adresseFormatee || c.telephone || c.email || c.siteWeb || c.horaires || socialLinks.value.length > 0
})
</script>

<template>
  <div
    v-if="hasAnyInfo"
    class="p-6 bg-default ring ring-inset ring-default"
  >
    <dl class="flex flex-col gap-4">
      <div
        v-for="item in items"
        :key="item.label"
        class="flex items-start gap-3"
      >
        <UIcon
          :name="item.icon"
          class="size-5 shrink-0 mt-0.5 text-primary"
        />
        <div class="flex flex-col min-w-0">
          <dt class="text-[13px]/[18px] text-muted">
            {{ item.label }}
          </dt>
          <dd class="whitespace-pre-line break-words">
            <a
              v-if="item.href"
              :href="item.href"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
            >{{ item.value }}</a>
            <template v-else>
              {{ item.value }}
            </template>
          </dd>
        </div>
      </div>
    </dl>

    <div
      v-if="socialLinks.length"
      class="flex items-center gap-3.5 mt-5 pt-4 border-t border-default"
    >
      <span class="text-sm text-muted">Réseaux sociaux</span>
      <a
        v-for="link in socialLinks"
        :key="link.platform"
        :href="link.url"
        :aria-label="link.platform"
        target="_blank"
        rel="noopener noreferrer"
        class="flex text-toned hover:text-primary transition-colors"
      >
        <UIcon
          :name="link.icon"
          class="size-4.5"
        />
      </a>
    </div>
  </div>
</template>
