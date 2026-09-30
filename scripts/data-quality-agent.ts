import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'

// ─── Quality score weights (total = 100) ────────────────────────────

const WEIGHTS = {
  contact: {
    telephone: 6,
    email: 6,
    siteWeb: 5,
    horaires: 4,
    adresseFormatee: 4
  },
  visual: {
    image: 8,        // blasonUrl OR logoUrl
    bannerUrl: 5,
    description: 7,  // >100 chars
    photos: 5        // photosGallery non-empty
  },
  data: {
    population: 7,
    effectifs: 7,
    budgetTotal: 5,
    ratioFemmes: 3,
    ageMoyen: 3
  },
  enrichment: {
    benefits: 4,
    competences: 4,
    socialMedia: 4,
    contenuPage: 3
  },
  geo: {
    coords: 4,       // lat + lng
    departement: 2,
    region: 2,
    codesPostaux: 2
  }
}

// ─── Types ───────────────────────────────────────────────────────────

interface Entity {
  id: string
  slug: string
  nom: string
  nomCourt: string | null
  type: string
  codeInsee: string
  telephone: string | null
  email: string | null
  siteWeb: string | null
  horaires: string | null
  adresseFormatee: string | null
  adresseCodePostal: string | null
  blasonUrl: string | null
  logoUrl: string | null
  bannerUrl: string | null
  description: string | null
  population: number | null
  effectifs: number | null
  budgetTotal: unknown
  ratioFemmes: number | null
  ageMoyen: number | null
  photosGallery: unknown
  benefits: string[]
  competences: string[]
  socialMediaLinks: unknown
  latitude: number | null
  longitude: number | null
  departementCode: string | null
  departementNom: string | null
  regionCode: string | null
  regionNom: string | null
  codesPostaux: string[]
  contenuPage: { status: string } | null
}

interface FixResult {
  field: string
  before: unknown
  after: unknown
}

// ─── Score computation ───────────────────────────────────────────────

function computeScore(e: Entity): number {
  let score = 0

  // Contact
  if (e.telephone) score += WEIGHTS.contact.telephone
  if (e.email) score += WEIGHTS.contact.email
  if (e.siteWeb) score += WEIGHTS.contact.siteWeb
  if (e.horaires) score += WEIGHTS.contact.horaires
  if (e.adresseFormatee) score += WEIGHTS.contact.adresseFormatee

  // Visual
  if (e.blasonUrl || e.logoUrl) score += WEIGHTS.visual.image
  if (e.bannerUrl) score += WEIGHTS.visual.bannerUrl
  if (e.description && e.description.length > 100) score += WEIGHTS.visual.description
  const photos = Array.isArray(e.photosGallery) ? e.photosGallery : []
  if (photos.length > 0) score += WEIGHTS.visual.photos

  // Data
  if (e.population) score += WEIGHTS.data.population
  if (e.effectifs) score += WEIGHTS.data.effectifs
  if (e.budgetTotal) score += WEIGHTS.data.budgetTotal
  if (e.ratioFemmes) score += WEIGHTS.data.ratioFemmes
  if (e.ageMoyen) score += WEIGHTS.data.ageMoyen

  // Enrichment
  if (e.benefits.length > 0) score += WEIGHTS.enrichment.benefits
  if (e.competences.length > 0) score += WEIGHTS.enrichment.competences
  const social = e.socialMediaLinks as Record<string, string> | null
  if (social && Object.keys(social).length > 0) score += WEIGHTS.enrichment.socialMedia
  if (e.contenuPage?.status === 'PUBLISHED') score += WEIGHTS.enrichment.contenuPage

  // Geo
  if (e.latitude && e.longitude) score += WEIGHTS.geo.coords
  if (e.departementCode && e.departementNom) score += WEIGHTS.geo.departement
  if (e.regionCode && e.regionNom) score += WEIGHTS.geo.region
  if (e.codesPostaux.length > 0) score += WEIGHTS.geo.codesPostaux

  return score
}

// ─── Auto-fix routines ───────────────────────────────────────────────

const NOM_PREFIXES = [
  'ville de ', 'commune de ', 'mairie de ', 'commune nouvelle de ',
  "commune d'", "ville d'", "mairie d'"
]

function deriveNomCourt(nom: string, type: string): string | null {
  if (type !== 'COMMUNE') return null
  const lower = nom.toLowerCase()
  for (const prefix of NOM_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return nom.slice(prefix.length).trim()
    }
  }
  return null
}

function normalizePhone(phone: string): string | null {
  let digits = phone.replace(/[^\d+]/g, '')

  // +33 → 0
  if (digits.startsWith('+33')) digits = '0' + digits.slice(3)
  if (digits.startsWith('0033')) digits = '0' + digits.slice(4)

  digits = digits.replace(/\D/g, '')
  if (digits.length !== 10 || !digits.startsWith('0')) return null

  return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function normalizeUrl(url: string): string {
  let cleaned = url.trim()
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned
  }
  cleaned = cleaned.replace(/\/+$/, '')
  return cleaned
}

function stripHtmlTags(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function computeFixes(e: Entity): { updates: Record<string, unknown>, fixes: FixResult[] } {
  const updates: Record<string, unknown> = {}
  const fixes: FixResult[] = []

  // 1. Derive nomCourt
  if (!e.nomCourt) {
    const derived = deriveNomCourt(e.nom, e.type)
    if (derived) {
      updates.nomCourt = derived
      fixes.push({ field: 'nomCourt', before: null, after: derived })
    }
  }

  // 2. Normalize phone
  if (e.telephone) {
    const normalized = normalizePhone(e.telephone)
    if (normalized && normalized !== e.telephone) {
      updates.telephone = normalized
      fixes.push({ field: 'telephone', before: e.telephone, after: normalized })
    }
  }

  // 3. Normalize email
  if (e.email) {
    const normalized = normalizeEmail(e.email)
    if (normalized !== e.email) {
      updates.email = normalized
      fixes.push({ field: 'email', before: e.email, after: normalized })
    }
  }

  // 4. Normalize siteWeb URL
  if (e.siteWeb) {
    const normalized = normalizeUrl(e.siteWeb)
    if (normalized !== e.siteWeb) {
      updates.siteWeb = normalized
      fixes.push({ field: 'siteWeb', before: e.siteWeb, after: normalized })
    }
  }

  // 5. Fill codesPostaux from adresseCodePostal
  if (e.codesPostaux.length === 0 && e.adresseCodePostal) {
    updates.codesPostaux = [e.adresseCodePostal]
    fixes.push({ field: 'codesPostaux', before: [], after: [e.adresseCodePostal] })
  }

  // 6. Strip HTML from description
  if (e.description && /<[^>]+>/.test(e.description)) {
    const cleaned = stripHtmlTags(e.description)
    if (cleaned !== e.description) {
      updates.description = cleaned
      fixes.push({ field: 'description', before: '(html)', after: '(cleaned)' })
    }
  }

  return { updates, fixes }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now()

  logger.info('=== Agent Qualité Données — Démarrage ===')

  // Fetch all entities
  logger.info('Chargement des entités...')
  const entities = await prisma.collectivite.findMany({
    where: { deletedAt: null },
    include: { contenuPage: { select: { status: true } } }
  }) as unknown as Entity[]

  logger.success(`${entities.length} entités chargées`)

  // ─── Phase 1: Audit ─────────────────────────────────

  logger.info('Phase 1 — Audit de complétude...')

  const fieldCoverage: Record<string, number> = {}
  const scoreDistribution = { excellent: 0, bon: 0, moyen: 0, faible: 0, critique: 0 }
  const scoresByType: Record<string, { total: number, count: number }> = {}
  let totalScore = 0

  const fields = [
    'telephone', 'email', 'siteWeb', 'horaires', 'adresseFormatee',
    'blasonUrl', 'logoUrl', 'bannerUrl', 'description',
    'population', 'effectifs', 'budgetTotal', 'ratioFemmes', 'ageMoyen',
    'latitude', 'longitude', 'departementCode', 'regionCode'
  ] as const

  for (const f of fields) fieldCoverage[f] = 0

  fieldCoverage['benefits'] = 0
  fieldCoverage['competences'] = 0
  fieldCoverage['socialMediaLinks'] = 0
  fieldCoverage['photosGallery'] = 0
  fieldCoverage['codesPostaux'] = 0
  fieldCoverage['nomCourt'] = 0
  fieldCoverage['contenuPage'] = 0

  for (const e of entities) {
    const score = computeScore(e)
    totalScore += score

    // Field coverage
    for (const f of fields) {
      if (e[f] != null) fieldCoverage[f]++
    }
    if (e.benefits.length > 0) fieldCoverage['benefits']++
    if (e.competences.length > 0) fieldCoverage['competences']++
    const social = e.socialMediaLinks as Record<string, string> | null
    if (social && Object.keys(social).length > 0) fieldCoverage['socialMediaLinks']++
    const photos = Array.isArray(e.photosGallery) ? e.photosGallery : []
    if (photos.length > 0) fieldCoverage['photosGallery']++
    if (e.codesPostaux.length > 0) fieldCoverage['codesPostaux']++
    if (e.nomCourt) fieldCoverage['nomCourt']++
    if (e.contenuPage?.status === 'PUBLISHED') fieldCoverage['contenuPage']++

    // Score distribution
    if (score >= 80) scoreDistribution.excellent++
    else if (score >= 60) scoreDistribution.bon++
    else if (score >= 40) scoreDistribution.moyen++
    else if (score >= 20) scoreDistribution.faible++
    else scoreDistribution.critique++

    // By type
    if (!scoresByType[e.type]) scoresByType[e.type] = { total: 0, count: 0 }
    scoresByType[e.type].total += score
    scoresByType[e.type].count++
  }

  const avgScore = totalScore / entities.length

  // Print audit report
  logger.info('')
  logger.info('╔══════════════════════════════════════════════════╗')
  logger.info('║          RAPPORT QUALITÉ DONNÉES                ║')
  logger.info('╚══════════════════════════════════════════════════╝')
  logger.info('')
  logger.info(`  Total entités : ${entities.length}`)
  logger.info(`  Score moyen   : ${avgScore.toFixed(1)}/100`)
  logger.info('')

  // Score by type
  logger.info('── Score moyen par type ──')
  for (const [type, data] of Object.entries(scoresByType).sort((a, b) => b[1].total / b[1].count - a[1].total / a[1].count)) {
    const avg = data.total / data.count
    const bar = '█'.repeat(Math.round(avg / 2)) + '░'.repeat(50 - Math.round(avg / 2))
    logger.info(`  ${type.padEnd(14)} ${bar} ${avg.toFixed(1)}/100 (${data.count})`)
  }

  // Distribution
  logger.info('')
  logger.info('── Distribution des scores ──')
  logger.info(`  🟢 Excellent (80-100) : ${scoreDistribution.excellent.toLocaleString('fr-FR')}`)
  logger.info(`  🔵 Bon      (60-79)  : ${scoreDistribution.bon.toLocaleString('fr-FR')}`)
  logger.info(`  🟡 Moyen    (40-59)  : ${scoreDistribution.moyen.toLocaleString('fr-FR')}`)
  logger.info(`  🟠 Faible   (20-39)  : ${scoreDistribution.faible.toLocaleString('fr-FR')}`)
  logger.info(`  🔴 Critique (0-19)   : ${scoreDistribution.critique.toLocaleString('fr-FR')}`)

  // Field coverage
  logger.info('')
  logger.info('── Taux de remplissage par champ ──')
  const sortedFields = Object.entries(fieldCoverage)
    .sort((a, b) => b[1] - a[1])
  for (const [field, count] of sortedFields) {
    const pct = ((count / entities.length) * 100).toFixed(1)
    const bar = '█'.repeat(Math.round(count / entities.length * 30))
    logger.info(`  ${field.padEnd(20)} ${bar.padEnd(30)} ${pct}% (${count.toLocaleString('fr-FR')})`)
  }

  // Top opportunities (fields with highest impact if filled)
  logger.info('')
  logger.info('── Opportunités d\'enrichissement (impact × volume) ──')
  const opportunities = [
    { field: 'telephone', missing: entities.length - fieldCoverage['telephone'], weight: WEIGHTS.contact.telephone },
    { field: 'email', missing: entities.length - fieldCoverage['email'], weight: WEIGHTS.contact.email },
    { field: 'siteWeb', missing: entities.length - fieldCoverage['siteWeb'], weight: WEIGHTS.contact.siteWeb },
    { field: 'description', missing: entities.length - fieldCoverage['description'], weight: WEIGHTS.visual.description },
    { field: 'effectifs', missing: entities.length - fieldCoverage['effectifs'], weight: WEIGHTS.data.effectifs },
    { field: 'blasonUrl/logoUrl', missing: entities.length - fieldCoverage['blasonUrl'] - fieldCoverage['logoUrl'] + entities.filter(e => e.blasonUrl && e.logoUrl).length, weight: WEIGHTS.visual.image },
    { field: 'horaires', missing: entities.length - fieldCoverage['horaires'], weight: WEIGHTS.contact.horaires },
    { field: 'population', missing: entities.length - fieldCoverage['population'], weight: WEIGHTS.data.population },
  ].map(o => ({ ...o, impact: o.missing * o.weight }))
    .sort((a, b) => b.impact - a.impact)

  for (const o of opportunities.slice(0, 8)) {
    logger.info(`  ${o.field.padEnd(20)} ${o.missing.toLocaleString('fr-FR')} manquants × poids ${o.weight} = impact ${o.impact.toLocaleString('fr-FR')}`)
  }

  // ─── Phase 2: Auto-fix ──────────────────────────────

  logger.info('')
  logger.info('Phase 2 — Corrections automatiques...')

  const fixStats: Record<string, number> = {}
  let totalFixed = 0
  let entitiesFixed = 0
  const BATCH_SIZE = 200

  for (let i = 0; i < entities.length; i += BATCH_SIZE) {
    const batch = entities.slice(i, i + BATCH_SIZE)

    await Promise.all(batch.map(async (e) => {
      const { updates, fixes } = computeFixes(e)

      if (Object.keys(updates).length === 0) return

      try {
        await prisma.collectivite.update({
          where: { id: e.id },
          data: updates
        })
        entitiesFixed++
        totalFixed += fixes.length
        for (const f of fixes) {
          fixStats[f.field] = (fixStats[f.field] || 0) + 1
        }
      } catch (err) {
        logger.warn(`Fix failed for ${e.slug}: ${err}`)
      }
    }))

    if ((i + BATCH_SIZE) % 5000 === 0 || i + BATCH_SIZE >= entities.length) {
      logger.info(`  [Auto-fix] ${Math.min(i + BATCH_SIZE, entities.length)}/${entities.length}`)
    }
  }

  logger.info('')
  logger.info('── Résultat corrections ──')
  logger.info(`  ${entitiesFixed.toLocaleString('fr-FR')} entités corrigées, ${totalFixed.toLocaleString('fr-FR')} champs modifiés`)
  if (Object.keys(fixStats).length > 0) {
    for (const [field, count] of Object.entries(fixStats).sort((a, b) => b[1] - a[1])) {
      logger.info(`    ${field.padEnd(20)} ${count.toLocaleString('fr-FR')} corrections`)
    }
  } else {
    logger.info('  Aucune correction nécessaire.')
  }

  // ─── Phase 3: Recalculate & persist scores ──────────

  logger.info('')
  logger.info('Phase 3 — Mise à jour des scores...')

  const updatedEntities = await prisma.collectivite.findMany({
    where: { deletedAt: null },
    include: { contenuPage: { select: { status: true } } }
  }) as unknown as Entity[]

  let newTotalScore = 0

  for (let i = 0; i < updatedEntities.length; i += BATCH_SIZE) {
    const batch = updatedEntities.slice(i, i + BATCH_SIZE)

    await Promise.all(batch.map(async (e) => {
      const score = computeScore(e)
      newTotalScore += score
      await prisma.collectivite.update({
        where: { id: e.id },
        data: { qualityScore: score }
      })
    }))
  }

  const newAvgScore = newTotalScore / updatedEntities.length
  const scoreDelta = newAvgScore - avgScore

  logger.info('')
  logger.info('╔══════════════════════════════════════════════════╗')
  logger.info('║          RÉSULTAT FINAL                         ║')
  logger.info('╚══════════════════════════════════════════════════╝')
  logger.info('')
  logger.info(`  Score moyen avant  : ${avgScore.toFixed(1)}/100`)
  logger.info(`  Score moyen après  : ${newAvgScore.toFixed(1)}/100`)
  logger.info(`  Amélioration       : +${scoreDelta.toFixed(1)} points`)
  logger.info(`  Corrections        : ${totalFixed.toLocaleString('fr-FR')} champs sur ${entitiesFixed.toLocaleString('fr-FR')} entités`)
  logger.info(`  Durée              : ${((Date.now() - startTime) / 1000).toFixed(1)}s`)
  logger.info('')

  // Bottom 10 entities
  const bottom = updatedEntities
    .map(e => ({ slug: e.slug, nom: e.nom, type: e.type, score: computeScore(e) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 10)

  logger.info('── 10 entités les plus faibles (prioritaires) ──')
  for (const e of bottom) {
    logger.info(`  ${e.score.toString().padStart(2)}/100  ${e.type.padEnd(12)} ${e.nom} (${e.slug})`)
  }

  // Top 10 entities
  const top = updatedEntities
    .map(e => ({ slug: e.slug, nom: e.nom, type: e.type, score: computeScore(e) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  logger.info('')
  logger.info('── 10 entités les mieux renseignées ──')
  for (const e of top) {
    logger.info(`  ${e.score.toString().padStart(2)}/100  ${e.type.padEnd(12)} ${e.nom} (${e.slug})`)
  }

  logger.info('')
  logger.success('Agent Qualité terminé.')
}

main().catch((e) => {
  logger.error(e)
  process.exit(1)
}).finally(() => disconnect())
