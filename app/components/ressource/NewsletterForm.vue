<script setup lang="ts">
const props = withDefaults(defineProps<{
  tone?: 'tint' | 'brand'
}>(), {
  tone: 'tint'
})

const route = useRoute()
const email = ref('')
const typeCollectivite = ref<string | undefined>(undefined)
const consentement = ref(false)
const state = ref<'idle' | 'loading' | 'done' | 'error'>('idle')

const typeOptions = Object.entries(TYPES_COLLECTIVITE)
  .filter(([value]) => value !== 'tous')
  .map(([value, label]) => ({ value, label }))
  .concat([{ value: 'autre', label: 'Autre employeur public' }])

async function submit() {
  if (!consentement.value || state.value === 'loading') return
  state.value = 'loading'
  try {
    await $fetch('/api/newsletter', {
      method: 'POST',
      body: { email: email.value, typeCollectivite: typeCollectivite.value, consentement: true, source: route.path }
    })
    state.value = 'done'
  } catch {
    state.value = 'error'
  }
}

const dark = computed(() => props.tone === 'brand')
</script>

<template>
  <section
    id="newsletter"
    class="px-6 py-8 md:px-10 md:py-10 scroll-mt-6"
    :class="dark ? 'bg-(--blue-950) text-(--blue-100)' : 'bg-(--surface-brand-tint)'"
  >
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
      <div class="flex flex-col gap-2">
        <span
          class="mep-kicker"
          :class="dark ? 'text-(--red-100)!' : ''"
        >Newsletter</span>
        <h2
          class="text-2xl/8 font-bold"
          :class="dark ? 'text-white' : ''"
        >
          La lettre mensuelle des employeurs publics
        </h2>
        <p :class="dark ? 'text-(--blue-200)' : 'text-muted'">
          Un e-mail par mois : les nouveaux guides et modèles, et les évolutions réglementaires qui changent vos recrutements.
        </p>
      </div>

      <p
        v-if="state === 'done'"
        role="status"
        class="flex items-center gap-2 font-semibold"
        :class="dark ? 'text-white' : 'text-success'"
      >
        <UIcon
          name="i-lucide-circle-check"
          class="size-5"
        />
        Inscription enregistrée. Merci !
      </p>

      <form
        v-else
        class="flex flex-col gap-3"
        @submit.prevent="submit"
      >
        <div class="flex flex-col gap-3 sm:flex-row">
          <UInput
            v-model="email"
            type="email"
            required
            size="lg"
            placeholder="Votre e-mail professionnel"
            aria-label="Votre e-mail professionnel"
            autocomplete="email"
            class="flex-1"
          />
          <USelect
            v-model="typeCollectivite"
            :items="typeOptions"
            size="lg"
            placeholder="Votre structure"
            aria-label="Type de structure"
            class="sm:w-56"
          />
        </div>
        <UCheckbox
          v-model="consentement"
          required
          :ui="{ label: dark ? 'text-(--blue-100)' : '' }"
          label="J'accepte de recevoir la newsletter. Désinscription en un clic dans chaque e-mail."
        />
        <div class="flex flex-wrap items-center gap-4">
          <UButton
            type="submit"
            size="lg"
            :loading="state === 'loading'"
            :disabled="!consentement"
            :color="dark ? 'neutral' : 'primary'"
            :variant="dark ? 'outline' : 'solid'"
          >
            S'inscrire
          </UButton>
          <span
            v-if="state === 'error'"
            role="alert"
            class="text-sm"
            :class="dark ? 'text-(--red-100)' : 'text-error'"
          >
            L'inscription n'a pas abouti. Vérifiez l'adresse et réessayez.
          </span>
        </div>
      </form>
    </div>
  </section>
</template>
