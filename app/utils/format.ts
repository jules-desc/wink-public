const frNumber = new Intl.NumberFormat('fr-FR')

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—'
  return frNumber.format(n)
}

export function formatPopulation(n: number | null | undefined): string {
  if (n == null) return '—'
  return `${frNumber.format(n)} habitants`
}

export function formatEffectifs(n: number | null | undefined): string {
  if (n == null) return '—'
  return `${frNumber.format(n)} agents`
}

export function formatBudget(n: string | number | null | undefined): string {
  if (n == null) return '—'
  const val = typeof n === 'string' ? parseFloat(n) : n
  if (isNaN(val)) return '—'
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1).replace('.', ',')} Mrd €`
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1).replace('.', ',')} M €`
  return `${frNumber.format(val)} €`
}

const contractTypeLabels: Record<string, string> = {
  PERMANENT: 'Titulaire',
  FIXED_TERM: 'Contractuel',
  APPRENTICESHIP: 'Apprentissage',
  INTERNSHIP: 'Stage',
  TEMPORARY: 'Intérimaire',
  FREELANCE: 'Indépendant',
  VOLUNTEER: 'Bénévole',
  STUDENT_JOB: 'Job étudiant',
  SEASONAL: 'Saisonnier',
  CASUAL: 'Vacataire'
}

export function formatContractType(ct: string | null | undefined): string {
  if (!ct) return '—'
  return contractTypeLabels[ct] || ct
}

const workScheduleLabels: Record<string, string> = {
  FULL_TIME: 'Temps complet',
  PART_TIME: 'Temps partiel'
}

export function formatWorkSchedule(ws: string | null | undefined): string {
  if (!ws) return '—'
  return workScheduleLabels[ws] || ws
}

const collectiviteTypeLabels: Record<string, string> = {
  COMMUNE: 'Commune',
  EPCI: 'Intercommunalité',
  DEPARTEMENT: 'Département',
  REGION: 'Région',
  CDG: 'Centre de Gestion',
  SYNDICAT_MIXTE: 'Syndicat Mixte'
}

const epciSousTypeLabels: Record<string, string> = {
  COMMUNAUTE_COMMUNES: 'Communauté de communes',
  COMMUNAUTE_AGGLO: 'Communauté d\'agglomération',
  COMMUNAUTE_URBAINE: 'Communauté urbaine',
  METROPOLE: 'Métropole'
}

export function collectiviteTypeLabel(type: string, sousType?: string | null): string {
  if (type === 'EPCI' && sousType && epciSousTypeLabels[sousType]) {
    return epciSousTypeLabels[sousType]
  }
  return collectiviteTypeLabels[type] || type
}

const categoryLabels: Record<string, string> = {
  A: 'Catégorie A',
  B: 'Catégorie B',
  C: 'Catégorie C'
}

export function formatCategory(cat: string): string {
  return categoryLabels[cat] || cat
}

const remoteLabels: Record<string, string> = {
  ON_SITE: 'Sur site',
  HYBRID: 'Télétravail partiel',
  FULL_REMOTE: 'Télétravail complet'
}

export function formatRemote(r: string | null | undefined): string {
  if (!r) return '—'
  return remoteLabels[r] || r
}

export function formatSalary(
  min: string | number | null | undefined,
  max: string | number | null | undefined,
  period?: string | null
): string {
  const parseVal = (v: string | number | null | undefined): number | null => {
    if (v == null) return null
    const n = typeof v === 'string' ? parseFloat(v) : v
    return isNaN(n) ? null : n
  }
  const minVal = parseVal(min)
  const maxVal = parseVal(max)
  if (minVal == null && maxVal == null) return '—'
  const fmt = (n: number) => frNumber.format(Math.round(n))
  const suffix = period === 'MONTH' ? '/mois' : '/an'
  if (minVal != null && maxVal != null) return `${fmt(minVal)} - ${fmt(maxVal)} €${suffix}`
  if (minVal != null) return `À partir de ${fmt(minVal)} €${suffix}`
  return `Jusqu'à ${fmt(maxVal!)} €${suffix}`
}

export function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}
