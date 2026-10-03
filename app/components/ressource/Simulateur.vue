<script setup lang="ts">
import remuneration from '~~/content/data/remuneration.json'

// Simulateur de rémunération d'un fonctionnaire territorial (régime CNRACL), à temps complet.
// Estimation : hors NBI, supplément familial, mutuelle et prélèvement à la source.

const point = remuneration.pointIndice.valeurMensuelle
const imMin = remuneration.indiceMajoreMinimum.valeur

function taux(prefix: string): number {
  const c = remuneration.cotisationsTitulaireCNRACL.find(x => x.libelle.startsWith(prefix))
  return (c?.taux ?? 0) / 100
}

const T_PENSION = taux('Retenue pour pension')
const T_CSG = taux('CSG totale')
const T_CRDS = taux('CRDS')
const T_RAFP = taux('RAFP')
const ASSIETTE_CSG = 0.9825

const indice = ref<number | undefined>(imMin)
const primes = ref<number | undefined>(0)

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

const result = computed(() => {
  const im = Number(indice.value)
  if (!Number.isFinite(im) || im < 1 || im > 1600) return null
  const p = Math.max(0, Number(primes.value) || 0)
  const traitement = im * point
  const pension = traitement * T_PENSION
  const csgCrds = (traitement + p) * ASSIETTE_CSG * (T_CSG + T_CRDS)
  const rafp = Math.min(p, traitement * 0.2) * T_RAFP
  const brut = traitement + p
  const net = brut - pension - csgCrds - rafp
  return {
    lignes: [
      { label: `Traitement indiciaire brut (IM ${im} × ${point.toLocaleString('fr-FR', { maximumFractionDigits: 5 })} €)`, value: traitement },
      ...(p ? [{ label: 'Primes et indemnités (RIFSEEP…)', value: p }] : []),
      { label: `Retenue pension CNRACL (${(T_PENSION * 100).toLocaleString('fr-FR')} %)`, value: -pension },
      { label: `CSG et CRDS (${((T_CSG + T_CRDS) * 100).toLocaleString('fr-FR')} % sur 98,25 %)`, value: -csgCrds },
      ...(rafp ? [{ label: `RAFP (${(T_RAFP * 100).toLocaleString('fr-FR')} % des primes, plafonnées à 20 %)`, value: -rafp }] : [])
    ],
    brut,
    net,
    sousMinimum: im < imMin
  }
})
</script>

<template>
  <div class="grid gap-8 p-6 md:p-8 bg-default ring ring-inset ring-default lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
    <form
      class="flex flex-col gap-5"
      @submit.prevent
    >
      <UFormField
        label="Indice majoré"
        :description="`Indiqué sur la fiche de paie ou la grille du grade. Minimum : ${imMin}.`"
      >
        <UInputNumber
          v-model="indice"
          :min="1"
          :max="1600"
          :step="1"
          size="lg"
          class="w-full"
          :format-options="{ useGrouping: false }"
        />
      </UFormField>
      <UFormField
        label="Primes mensuelles brutes (facultatif)"
        description="Montant mensuel du RIFSEEP ou des autres primes."
      >
        <UInputNumber
          v-model="primes"
          :min="0"
          :step="10"
          size="lg"
          class="w-full"
          :format-options="{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
        />
      </UFormField>
      <p class="text-sm text-muted">
        Fonctionnaire à temps complet affilié à la CNRACL. Contractuels : les cotisations diffèrent (régime général et Ircantec).
      </p>
    </form>

    <div
      v-if="result"
      aria-live="polite"
      class="flex flex-col gap-4"
    >
      <div class="grid grid-cols-2 gap-3">
        <MepStatCard
          :value="euro.format(result.brut)"
          label="Brut mensuel"
        />
        <MepStatCard
          :value="euro.format(result.net)"
          label="Net mensuel estimé, avant impôt"
        />
      </div>
      <table class="w-full text-sm">
        <tbody>
          <tr
            v-for="ligne in result.lignes"
            :key="ligne.label"
            class="border-b border-default"
          >
            <td class="py-2 pr-4 text-muted">
              {{ ligne.label }}
            </td>
            <td class="py-2 text-right tabular-nums font-semibold text-highlighted whitespace-nowrap">
              {{ euro.format(ligne.value) }}
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-if="result.sousMinimum"
        class="text-sm text-warning"
      >
        Cet indice est inférieur à l'indice majoré minimum de traitement ({{ imMin }}).
      </p>
    </div>
    <p
      v-else
      class="text-muted"
    >
      Saisissez un indice majoré entre 1 et 1 600.
    </p>
  </div>
</template>
