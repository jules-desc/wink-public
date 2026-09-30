import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'

const ANNUAIRE_URL = 'https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/exports/json?where=pivot%20like%20%22mairie%22&limit=-1'

interface AnnuaireRecord {
  id: string
  nom: string
  code_insee_commune: string
  adresse_courriel: string | null
  siren: string | null
  siret: string | null
  adresse: string | null
  telephone: string | null
  site_internet: string | null
  plage_ouverture: string | null
}

interface AdresseEntry {
  numero_voie?: string
  code_postal?: string
  nom_commune?: string
  longitude?: string
  latitude?: string
}

interface TelephoneEntry {
  valeur?: string
}

interface SiteInternetEntry {
  valeur?: string
}

interface PlageOuvertureEntry {
  nom_jour_debut?: string
  nom_jour_fin?: string
  valeur_heure_debut_1?: string
  valeur_heure_fin_1?: string
  valeur_heure_debut_2?: string
  valeur_heure_fin_2?: string
  commentaire?: string
}

function safeParse<T>(jsonStr: string | null): T[] {
  if (!jsonStr) return []
  try {
    const parsed = JSON.parse(jsonStr)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function formatHoraires(plages: PlageOuvertureEntry[]): string | null {
  if (!plages.length) return null
  const lines = plages.map((p) => {
    const jours = p.nom_jour_debut === p.nom_jour_fin
      ? p.nom_jour_debut
      : `${p.nom_jour_debut} - ${p.nom_jour_fin}`
    const slots: string[] = []
    if (p.valeur_heure_debut_1 && p.valeur_heure_fin_1) {
      slots.push(`${p.valeur_heure_debut_1.slice(0, 5)}-${p.valeur_heure_fin_1.slice(0, 5)}`)
    }
    if (p.valeur_heure_debut_2 && p.valeur_heure_fin_2) {
      slots.push(`${p.valeur_heure_debut_2.slice(0, 5)}-${p.valeur_heure_fin_2.slice(0, 5)}`)
    }
    return `${jours} : ${slots.join(' / ') || 'Fermé'}`
  })
  return lines.join('\n')
}

function formatAdresse(addr: AdresseEntry): string | null {
  const parts = [addr.numero_voie, addr.code_postal, addr.nom_commune].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

function extractNumeroRue(numeroVoie?: string): { numero: string | null, rue: string | null } {
  if (!numeroVoie) return { numero: null, rue: null }
  const match = numeroVoie.match(/^(\d+\s*(bis|ter)?)\s+(.+)$/i)
  if (match) return { numero: match[1], rue: match[3] }
  return { numero: null, rue: numeroVoie }
}

async function main() {
  const importId = await startImport('SERVICE_PUBLIC')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }

  try {
    logger.info('Downloading annuaire dataset (35k+ records)...')
    const response = await fetch(ANNUAIRE_URL, {
      headers: { 'User-Agent': 'WinkPages/1.0 (data-pipeline)' }
    })

    if (!response.ok) {
      throw new Error(`Failed to download annuaire: HTTP ${response.status}`)
    }

    const records = await response.json() as AnnuaireRecord[]
    stats.recordsTotal = records.length
    logger.success(`${records.length} mairie records downloaded`)

    const BATCH_SIZE = 100
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE)

      await Promise.all(batch.map(async (record) => {
        const codeInsee = record.code_insee_commune
        if (!codeInsee) {
          stats.recordsSkipped++
          return
        }

        try {
          const existing = await prisma.collectivite.findUnique({
            where: { codeInsee },
            select: {
              id: true,
              telephone: true,
              email: true,
              siteWeb: true,
              horaires: true,
              adresseNumero: true,
              adresseRue: true,
              adresseVille: true,
              adresseCodePostal: true,
              adresseFormatee: true,
              codeSiren: true,
              latitude: true,
              longitude: true
            }
          })

          if (!existing) {
            stats.recordsSkipped++
            return
          }

          const adresses = safeParse<AdresseEntry>(record.adresse)
          const telephones = safeParse<TelephoneEntry>(record.telephone)
          const sites = safeParse<SiteInternetEntry>(record.site_internet)
          const plages = safeParse<PlageOuvertureEntry>(record.plage_ouverture)

          const addr = adresses[0]
          const { numero, rue } = extractNumeroRue(addr?.numero_voie)

          const updates: Record<string, unknown> = {}

          if (!existing.telephone && telephones[0]?.valeur) {
            updates.telephone = telephones[0].valeur
          }
          if (!existing.email && record.adresse_courriel) {
            updates.email = record.adresse_courriel
          }
          if (!existing.siteWeb && sites[0]?.valeur) {
            updates.siteWeb = sites[0].valeur
          }
          if (!existing.horaires) {
            const horaires = formatHoraires(plages)
            if (horaires) updates.horaires = horaires
          }
          if (!existing.adresseNumero && numero) {
            updates.adresseNumero = numero
          }
          if (!existing.adresseRue && rue) {
            updates.adresseRue = rue
          }
          if (!existing.adresseVille && addr?.nom_commune) {
            updates.adresseVille = addr.nom_commune
          }
          if (!existing.adresseCodePostal && addr?.code_postal) {
            updates.adresseCodePostal = addr.code_postal
          }
          if (!existing.adresseFormatee && addr) {
            const formatted = formatAdresse(addr)
            if (formatted) updates.adresseFormatee = formatted
          }
          if (!existing.codeSiren && record.siren) {
            updates.codeSiren = record.siren
          }
          if (!existing.latitude && addr?.latitude) {
            updates.latitude = parseFloat(addr.latitude)
          }
          if (!existing.longitude && addr?.longitude) {
            updates.longitude = parseFloat(addr.longitude)
          }

          if (Object.keys(updates).length > 0) {
            await prisma.collectivite.update({
              where: { codeInsee },
              data: updates
            })
            stats.recordsUpdated++
          } else {
            stats.recordsSkipped++
          }
        } catch (e) {
          logger.warn(`Failed to enrich ${codeInsee}: ${e}`)
          stats.recordsErrored++
        }
      }))

      const processed = Math.min(i + BATCH_SIZE, records.length)
      if (processed % 5000 === 0 || processed === records.length) {
        logger.info(`[Annuaire] ${processed}/${records.length} (${Math.floor((processed / records.length) * 100)}%)`)
      }
    }

    await completeImport(importId, stats)
    logger.success(`Import SERVICE_PUBLIC terminé: ${stats.recordsUpdated} enrichis, ${stats.recordsSkipped} skipped, ${stats.recordsErrored} erreurs`)
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
