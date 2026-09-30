import { createHash } from 'node:crypto'
import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { fetchJson } from './lib/fetcher.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'
import { processBatch } from './lib/batch.js'

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'

const SPARQL_QUERY = `
SELECT ?codeInsee ?blason WHERE {
  ?commune wdt:P374 ?codeInsee .
  ?commune wdt:P94 ?blason .
  ?commune wdt:P31/wdt:P279* wd:Q484170 .
}
`

interface SparqlResult {
  results: {
    bindings: Array<{
      codeInsee: { value: string }
      blason: { value: string }
    }>
  }
}

function commonsUrlToThumb(commonsUrl: string, width: number = 120): string {
  // Convert "http://commons.wikimedia.org/wiki/Special:FilePath/Filename.svg"
  // to "https://upload.wikimedia.org/wikipedia/commons/thumb/hash/Filename.svg/120px-Filename.svg.png"
  const filename = commonsUrl.split('/').pop()
  if (!filename) return commonsUrl

  const encoded = filename.replace(/ /g, '_')
  const md5 = createHash('md5').update(encoded).digest('hex')
  const a = md5[0]
  const ab = md5.slice(0, 2)

  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${ab}/${encoded}/${width}px-${encoded}.png`
}

async function main() {
  const importId = await startImport('WIKIDATA')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }

  try {
    logger.info('Querying Wikidata SPARQL for commune blasons...')
    const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(SPARQL_QUERY)}&format=json`
    const data = await fetchJson<SparqlResult>(url, { timeout: 60000 })

    const bindings = data.results.bindings
    stats.recordsTotal = bindings.length
    logger.success(`${bindings.length} blasons found in Wikidata`)

    // Deduplicate by codeInsee (keep first)
    const blasonMap = new Map<string, string>()
    for (const b of bindings) {
      const code = b.codeInsee.value
      if (!blasonMap.has(code)) {
        blasonMap.set(code, b.blason.value)
      }
    }
    logger.info(`${blasonMap.size} unique communes with blasons`)

    const entries = Array.from(blasonMap.entries())

    await processBatch(entries, async ([codeInsee, commonsUrl]) => {
      try {
        const existing = await prisma.collectivite.findUnique({
          where: { codeInsee },
          select: { blasonUrl: true }
        })

        if (!existing) {
          stats.recordsSkipped++
          return
        }

        if (existing.blasonUrl) {
          stats.recordsSkipped++
          return
        }

        const thumbUrl = commonsUrlToThumb(commonsUrl, 200)
        await prisma.collectivite.update({
          where: { codeInsee },
          data: { blasonUrl: thumbUrl }
        })
        stats.recordsUpdated++
      } catch (e) {
        logger.warn(`Failed to update blason for ${codeInsee}: ${e}`)
        stats.recordsErrored++
      }
    }, { batchSize: 200, label: 'Blasons' })

    await completeImport(importId, stats)
    logger.success(`Import WIKIDATA terminé: ${stats.recordsUpdated} blasons ajoutés, ${stats.recordsSkipped} skipped, ${stats.recordsErrored} erreurs`)
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
