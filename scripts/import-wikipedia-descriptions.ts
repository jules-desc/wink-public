import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'
import { sleep } from './lib/fetcher.js'

const WIKI_API = 'https://fr.wikipedia.org/w/api.php'
const BATCH_API_SIZE = 20 // Wikipedia accepts up to 50 titles per query

interface WikiPage {
  pageid: number
  title: string
  extract?: string
}

async function fetchExtracts(titles: string[]): Promise<Map<string, string>> {
  const params = new URLSearchParams({
    action: 'query',
    titles: titles.join('|'),
    prop: 'extracts',
    exintro: '1',
    explaintext: '1',
    format: 'json',
    exlimit: String(titles.length)
  })

  const res = await fetch(`${WIKI_API}?${params}`, {
    headers: { 'User-Agent': 'WinkPages/1.0 (contact@wink.fr)' }
  })

  if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`)

  const data = await res.json()
  const result = new Map<string, string>()
  const pages: Record<string, WikiPage> = data.query?.pages || {}

  for (const page of Object.values(pages)) {
    if (page.extract && page.extract.length > 50) {
      result.set(page.title.toLowerCase(), page.extract)
    }
  }

  // Handle redirects/normalizations
  const normalized: Array<{ from: string, to: string }> = data.query?.normalized || []
  const redirects: Array<{ from: string, to: string }> = data.query?.redirects || []

  for (const n of [...normalized, ...redirects]) {
    const extract = result.get(n.to.toLowerCase())
    if (extract) {
      result.set(n.from.toLowerCase(), extract)
    }
  }

  return result
}

async function main() {
  const importId = await startImport('WIKIPEDIA')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }

  try {
    logger.info('Loading top communes by population...')
    const communes = await prisma.collectivite.findMany({
      where: { deletedAt: null, type: 'COMMUNE', population: { not: null } },
      orderBy: { population: 'desc' },
      take: 500,
      select: { id: true, nom: true, nomCourt: true, description: true, codeInsee: true }
    })

    stats.recordsTotal = communes.length
    logger.success(`${communes.length} communes to enrich`)

    // Process in batches of BATCH_API_SIZE
    for (let i = 0; i < communes.length; i += BATCH_API_SIZE) {
      const batch = communes.slice(i, i + BATCH_API_SIZE)

      // Use nomCourt if available, otherwise nom (strip "Ville de" etc.)
      const searchNames = batch.map((c) => {
        const name = c.nomCourt || c.nom
          .replace(/^(Ville de |Commune de |Mairie de |Commune nouvelle de )/i, '')
          .replace(/^(Ville d'|Commune d'|Mairie d')/i, '')
        return { id: c.id, description: c.description, searchName: name }
      })

      const titles = searchNames.map(s => s.searchName)

      try {
        const extracts = await fetchExtracts(titles)

        for (const entry of searchNames) {
          const extract = extracts.get(entry.searchName.toLowerCase())

          if (!extract) {
            stats.recordsSkipped++
            continue
          }

          if (entry.description && entry.description.length >= extract.length) {
            stats.recordsSkipped++
            continue
          }

          await prisma.collectivite.update({
            where: { id: entry.id },
            data: { description: extract }
          })
          stats.recordsUpdated++
        }
      } catch (e) {
        logger.warn(`Batch error at ${i}: ${e}`)
        stats.recordsErrored += batch.length
      }

      if ((i + BATCH_API_SIZE) % 100 === 0 || i + BATCH_API_SIZE >= communes.length) {
        logger.info(`[Wikipedia] ${Math.min(i + BATCH_API_SIZE, communes.length)}/${communes.length} — ${stats.recordsUpdated} enrichis`)
      }

      await sleep(200)
    }

    await completeImport(importId, stats)
    logger.success(`Import WIKIPEDIA terminé: ${stats.recordsUpdated} descriptions ajoutées, ${stats.recordsSkipped} skipped, ${stats.recordsErrored} erreurs`)
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
