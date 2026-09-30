import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { fetchJson } from './lib/fetcher.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'
import { processBatch } from './lib/batch.js'

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'

const SPARQL_QUERY = `
SELECT ?codeInsee ?logo ?image ?imageLabel WHERE {
  ?commune wdt:P374 ?codeInsee .
  OPTIONAL { ?commune wdt:P154 ?logo }
  OPTIONAL { ?commune wdt:P18 ?image }
  FILTER(BOUND(?logo) || BOUND(?image))
}
`

interface SparqlResult {
  results: {
    bindings: Array<{
      codeInsee: { value: string }
      logo?: { value: string }
      image?: { value: string }
    }>
  }
}

function commonsUrlToThumb(commonsUrl: string, width: number): string {
  const decoded = decodeURIComponent(commonsUrl)
  const filename = decoded.split('/').pop()
  if (!filename) return commonsUrl
  const normalized = filename.replace(/ /g, '_')
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(normalized)}?width=${width}`
}

interface ImageData {
  logoUrl: string | null
  bannerUrl: string | null
  photoUrl: string | null
}

async function main() {
  const importId = await startImport('WIKIDATA_IMAGES')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }

  try {
    logger.info('Querying Wikidata SPARQL for commune logos & images...')
    const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(SPARQL_QUERY)}&format=json`
    const data = await fetchJson<SparqlResult>(url, { timeout: 120000 })

    const bindings = data.results.bindings
    stats.recordsTotal = bindings.length
    logger.success(`${bindings.length} results from Wikidata`)

    // Deduplicate by codeInsee — keep first logo & first image
    const imageMap = new Map<string, ImageData>()
    for (const b of bindings) {
      const code = b.codeInsee.value
      const existing = imageMap.get(code)

      const logoRaw = b.logo?.value || null
      const imageRaw = b.image?.value || null

      if (!existing) {
        imageMap.set(code, {
          logoUrl: logoRaw,
          bannerUrl: imageRaw,
          photoUrl: imageRaw
        })
      } else {
        if (!existing.logoUrl && logoRaw) existing.logoUrl = logoRaw
        if (!existing.bannerUrl && imageRaw) existing.bannerUrl = imageRaw
      }
    }

    logger.info(`${imageMap.size} unique communes with logo or image`)

    // Count what we have
    let withLogo = 0, withImage = 0
    for (const v of imageMap.values()) {
      if (v.logoUrl) withLogo++
      if (v.bannerUrl) withImage++
    }
    logger.info(`  → ${withLogo} logos, ${withImage} images`)

    // Clear previously imported bad URLs (from prior runs with encoding bug)
    logger.info('Clearing previous Wikidata image URLs...')
    const cleared = await prisma.collectivite.updateMany({
      where: {
        OR: [
          { bannerUrl: { startsWith: 'https://upload.wikimedia.org/' } },
          { logoUrl: { startsWith: 'https://upload.wikimedia.org/' } }
        ]
      },
      data: { bannerUrl: null, logoUrl: null, photosGallery: [] }
    })
    logger.info(`Cleared ${cleared.count} entities`)

    const entries = Array.from(imageMap.entries())

    await processBatch(entries, async ([codeInsee, images]) => {
      try {
        const existing = await prisma.collectivite.findUnique({
          where: { codeInsee },
          select: { id: true, logoUrl: true, bannerUrl: true, photosGallery: true }
        })

        if (!existing) {
          stats.recordsSkipped++
          return
        }

        const updates: Record<string, unknown> = {}

        // Logo: 300px
        if (!existing.logoUrl && images.logoUrl) {
          updates.logoUrl = commonsUrlToThumb(images.logoUrl, 300)
        }

        // Banner: 1200px (large for hero)
        if (!existing.bannerUrl && images.bannerUrl) {
          updates.bannerUrl = commonsUrlToThumb(images.bannerUrl, 1200)
        }

        // Photo gallery: add image as first photo if gallery empty
        if (images.photoUrl) {
          const currentGallery = Array.isArray(existing.photosGallery) ? existing.photosGallery as Array<{ url: string }> : []
          const photoThumb = commonsUrlToThumb(images.photoUrl, 800)

          if (!currentGallery.some((p) => p.url === photoThumb)) {
            updates.photosGallery = [
              ...currentGallery,
              { url: photoThumb, caption: null, source: 'wikidata' }
            ]
          }
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
        logger.warn(`Failed to update images for ${codeInsee}: ${e}`)
        stats.recordsErrored++
      }
    }, { batchSize: 200, label: 'Images' })

    await completeImport(importId, stats)
    logger.success(`Import WIKIDATA_IMAGES terminé: ${stats.recordsUpdated} enrichis, ${stats.recordsSkipped} skipped, ${stats.recordsErrored} erreurs`)
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
