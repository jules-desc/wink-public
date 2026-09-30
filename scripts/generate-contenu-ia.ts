import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { generateJson } from './lib/bedrock.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'
import { processBatch } from './lib/batch.js'

const TOP_N = 200
const PARALLELISM = 5
const PROMPT_VERSION = 'v1'
const MODEL_TAG = 'claude-sonnet-5-bedrock'

const SYSTEM_PROMPT = `Tu es un éditeur SEO spécialisé dans l'emploi public territorial en France. Tu rédiges des pages "marque employeur" pour Wink Pages, dont l'objectif est de ranker sur Google pour des requêtes longtail liées au recrutement dans une commune donnée : « emploi mairie [Ville] », « recrutement [Ville] », « travailler à [Ville] », « fonction publique territoriale [Ville] », « agent territorial [Ville] », « offres emploi mairie [Ville] ».

Règles éditoriales strictes :
1. Écris exclusivement en français, avec un ton institutionnel crédible mais engageant (pas de superlatifs vides, pas de phrases creuses).
2. Intègre le nom de la ville 3 à 5 fois par section, avec des variations naturelles : « à [Ville] », « la Ville de [Ville] », « à la mairie de [Ville] », « les habitants de [Ville] ».
3. Utilise le vocabulaire spécifique à la Fonction Publique Territoriale : agents territoriaux, filières (technique, administrative, sanitaire et sociale, culturelle, sportive, animation, sécurité), catégories A/B/C, CNAS, COS, RTT, régime indemnitaire, mutuelle prévoyance, tickets restaurant, télétravail, mobilité interne.
4. INTERDICTION d'inventer des chiffres précis (effectifs, budget, projets nommés) qui ne sont pas fournis dans le contexte d'entrée. Reste factuel sur la géographie, la démographie, les compétences génériques FPT.
5. Utilise la description Wikipedia fournie comme source de faits sur la géographie, l'histoire et les grands projets urbains connus — mais reformule intégralement. Interdiction absolue de copier des phrases de Wikipedia.
6. Phrases variées en longueur et structure. Évite les répétitions mécaniques.
7. Retourne UNIQUEMENT un JSON valide encapsulé dans une balise <json>...</json>, avec exactement ces 7 champs :
   - titreH1 (string, 30-70 caractères, format "Travailler à [Ville] : emplois et recrutement")
   - titreSeo (string, 45-60 caractères, keyword-first, format "Emploi Ville de [Ville] — Recrutement mairie | Wink Pages")
   - metaDescription (string, 130-160 caractères, verbe d'action + ville + bénéfice)
   - introduction (string, 800-1200 caractères, présente la ville comme employeur, mentionne son ancrage géographique et son échelle)
   - pourquoiRejoindre (string, 900-1400 caractères, avantages agents territoriaux + attractivité du poste)
   - cadreDeVie (string, 600-900 caractères, qualité de vie, patrimoine, transports, environnement)
   - filieresMetiers (string, 900-1600 caractères, format Markdown "**Catégorie** : liste de métiers", 8-12 catégories)

Aucun texte hors de la balise <json>.`

interface Commune {
  id: string
  codeInsee: string
  nom: string
  nomCourt: string | null
  population: number | null
  departementNom: string | null
  regionNom: string | null
  description: string | null
  siteWeb: string | null
  effectifs: number | null
  budgetTotal: unknown
  competences: string[]
}

interface GeneratedContent {
  titreH1: string
  titreSeo: string
  metaDescription: string
  introduction: string
  pourquoiRejoindre: string
  cadreDeVie: string
  filieresMetiers: string
}

function buildUserPrompt(commune: Commune): string {
  const lines: string[] = [
    `Génère le contenu marque employeur pour la commune française suivante :`,
    ``,
    `**Nom** : ${commune.nom}`,
    `**Population** : ${commune.population?.toLocaleString('fr-FR') ?? 'inconnue'} habitants`,
    `**Département** : ${commune.departementNom ?? 'inconnu'}`,
    `**Région** : ${commune.regionNom ?? 'inconnue'}`
  ]

  if (commune.effectifs) {
    lines.push(`**Effectifs municipaux** : ${commune.effectifs} agents (chiffre officiel, tu peux le citer)`)
  }
  if (commune.budgetTotal) {
    lines.push(`**Budget total** : ${commune.budgetTotal} € (chiffre officiel, tu peux le citer)`)
  }
  if (commune.siteWeb) {
    lines.push(`**Site officiel** : ${commune.siteWeb}`)
  }
  if (commune.competences.length > 0) {
    lines.push(`**Compétences** : ${commune.competences.join(', ')}`)
  }

  if (commune.description) {
    const wiki = commune.description.slice(0, 3000)
    lines.push('')
    lines.push('**Extrait Wikipedia (source pour les faits géographiques et historiques uniquement — à REFORMULER intégralement, jamais copier)** :')
    lines.push(wiki)
  }

  lines.push('')
  lines.push('Génère maintenant le JSON dans une balise <json>...</json>.')

  return lines.join('\n')
}

function computeQualityScore(content: GeneratedContent, communeNom: string): number {
  let score = 0
  const nomLower = communeNom.toLowerCase()

  // Length compliance (max 50 points)
  const lengthCheck = [
    { field: 'titreH1', min: 30, max: 70, weight: 5 },
    { field: 'titreSeo', min: 45, max: 65, weight: 5 },
    { field: 'metaDescription', min: 130, max: 165, weight: 5 },
    { field: 'introduction', min: 700, max: 1300, weight: 10 },
    { field: 'pourquoiRejoindre', min: 800, max: 1500, weight: 10 },
    { field: 'cadreDeVie', min: 500, max: 1000, weight: 5 },
    { field: 'filieresMetiers', min: 800, max: 1700, weight: 10 }
  ]

  for (const c of lengthCheck) {
    const val = content[c.field as keyof GeneratedContent]?.toString() || ''
    if (val.length >= c.min && val.length <= c.max) score += c.weight
  }

  // Keyword presence (max 30 points)
  const fullText = [content.introduction, content.pourquoiRejoindre, content.cadreDeVie, content.filieresMetiers].join(' ').toLowerCase()
  const seoKeywords = ['agent territorial', 'recrutement', 'emploi', 'fonction publique', 'mairie', 'ville de', 'filière']
  for (const kw of seoKeywords) {
    if (fullText.includes(kw)) score += 30 / seoKeywords.length
  }

  // City name occurrences (max 20 points)
  const nomOccurrences = (fullText.match(new RegExp(nomLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  if (nomOccurrences >= 8) score += 20
  else if (nomOccurrences >= 5) score += 15
  else if (nomOccurrences >= 3) score += 10
  else score += Math.floor(nomOccurrences * 2)

  return Math.round(score)
}

async function main() {
  const importId = await startImport('IA_CONTENU')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }

  let totalInputTokens = 0
  let totalOutputTokens = 0

  try {
    // Sanity check env
    if (!process.env.AWS_REGION && !process.env.AWS_DEFAULT_REGION) {
      logger.warn('AWS_REGION non défini, fallback sur eu-central-1')
    }
    if (!process.env.BEDROCK_MODEL_ID) {
      logger.warn('BEDROCK_MODEL_ID non défini, fallback sur eu.anthropic.claude-sonnet-5-v1')
    }

    logger.info(`Chargement du Top ${TOP_N} des communes...`)
    const communes = await prisma.collectivite.findMany({
      where: {
        deletedAt: null,
        type: 'COMMUNE',
        population: { not: null }
      },
      orderBy: { population: 'desc' },
      take: TOP_N,
      select: {
        id: true, codeInsee: true, nom: true, nomCourt: true, population: true,
        departementNom: true, regionNom: true, description: true,
        siteWeb: true, effectifs: true, budgetTotal: true, competences: true,
        contenuPage: { select: { status: true, modeleIa: true } }
      }
    })

    stats.recordsTotal = communes.length
    logger.success(`${communes.length} communes chargées`)

    // Filter: skip already published with claude-sonnet-5 (or any published, safer)
    const toProcess = communes.filter((c) => {
      if (!c.contenuPage) return true
      if (c.contenuPage.status !== 'PUBLISHED') return true
      // Already published — skip to preserve manual/prior work
      return false
    })

    stats.recordsSkipped = communes.length - toProcess.length
    logger.info(`${toProcess.length} à générer, ${stats.recordsSkipped} déjà publiées (skip)`)

    await processBatch(toProcess, async (commune) => {
      const communeData: Commune = {
        id: commune.id,
        codeInsee: commune.codeInsee,
        nom: commune.nom,
        nomCourt: commune.nomCourt,
        population: commune.population,
        departementNom: commune.departementNom,
        regionNom: commune.regionNom,
        description: commune.description,
        siteWeb: commune.siteWeb,
        effectifs: commune.effectifs,
        budgetTotal: commune.budgetTotal,
        competences: commune.competences
      }

      try {
        const { data, inputTokens, outputTokens } = await generateJson<GeneratedContent>(
          buildUserPrompt(communeData),
          { system: SYSTEM_PROMPT, maxTokens: 4096, temperature: 0.5 }
        )

        totalInputTokens += inputTokens
        totalOutputTokens += outputTokens

        // Validate required fields
        const required: Array<keyof GeneratedContent> = ['titreH1', 'titreSeo', 'metaDescription', 'introduction', 'pourquoiRejoindre', 'cadreDeVie', 'filieresMetiers']
        for (const f of required) {
          if (!data[f] || typeof data[f] !== 'string') {
            throw new Error(`Champ manquant ou invalide: ${f}`)
          }
        }

        const scoreQualite = computeQualityScore(data, commune.nom)

        await prisma.contenuPage.upsert({
          where: { collectiviteId: commune.id },
          create: {
            collectiviteId: commune.id,
            ...data,
            status: 'PUBLISHED',
            publishedAt: new Date(),
            modeleIa: MODEL_TAG,
            promptVersion: PROMPT_VERSION,
            dateGeneration: new Date(),
            scoreQualite
          },
          update: {
            ...data,
            status: 'PUBLISHED',
            publishedAt: new Date(),
            modeleIa: MODEL_TAG,
            promptVersion: PROMPT_VERSION,
            dateGeneration: new Date(),
            scoreQualite
          }
        })

        stats.recordsImported++
      } catch (err) {
        stats.recordsErrored++
        logger.warn(`❌ ${commune.nom} (${commune.codeInsee}): ${(err as Error).message}`)
      }
    }, { batchSize: PARALLELISM, label: 'IA' })

    await completeImport(importId, stats)

    logger.info('')
    logger.success(`✔ Terminé : ${stats.recordsImported} générés, ${stats.recordsSkipped} skippés, ${stats.recordsErrored} erreurs`)
    logger.info(`📊 Tokens : ${totalInputTokens.toLocaleString('fr-FR')} in / ${totalOutputTokens.toLocaleString('fr-FR')} out`)

    // Rough cost estimate (Claude Sonnet 5 Bedrock pricing indicative)
    const inputCost = (totalInputTokens / 1_000_000) * 3
    const outputCost = (totalOutputTokens / 1_000_000) * 15
    logger.info(`💰 Coût estimé : ~$${(inputCost + outputCost).toFixed(2)} (indicatif)`)
  } catch (error) {
    await failImport(importId, error)
    throw error
  } finally {
    await disconnect()
  }
}

main().catch((e) => {
  logger.error(e)
  process.exit(1)
})
