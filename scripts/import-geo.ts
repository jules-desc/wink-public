import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { fetchJson, createThrottledFetcher } from './lib/fetcher.js'
import { communeSlug, epciSlug, departementSlug, regionSlug, deduplicateSlugs } from './lib/slugify.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'
import { processBatch, processSequential } from './lib/batch.js'

const GEO_API = 'https://geo.api.gouv.fr'

interface GeoRegion {
  nom: string
  code: string
}

interface GeoDepartement {
  nom: string
  code: string
  codeRegion: string
}

interface GeoCommune {
  nom: string
  code: string
  codesPostaux: string[]
  population?: number
  codeDepartement: string
  codeRegion: string
  centre?: { type: string, coordinates: [number, number] }
}

interface GeoEpci {
  nom: string
  code: string
  population?: number
}

interface GeoEpciDetail {
  nom: string
  code: string
  population?: number
  type?: string
}

async function main() {
  const importId = await startImport('GEO_API')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }

  try {
    // 1. Fetch regions
    logger.info('Fetching régions...')
    const regions = await fetchJson<GeoRegion[]>(`${GEO_API}/regions?fields=nom,code`)
    logger.success(`${regions.length} régions fetched`)

    const regionMap = new Map(regions.map(r => [r.code, r.nom]))

    // 2. Fetch departements
    logger.info('Fetching départements...')
    const departements = await fetchJson<GeoDepartement[]>(`${GEO_API}/departements?fields=nom,code,codeRegion`)
    logger.success(`${departements.length} départements fetched`)

    const deptMap = new Map(departements.map(d => [d.code, d]))

    // 3. Fetch communes (bulk)
    logger.info('Fetching communes (bulk)...')
    const communes = await fetchJson<GeoCommune[]>(
      `${GEO_API}/communes?fields=nom,code,codesPostaux,population,codeDepartement,codeRegion,centre&format=json&limit=50000`
    )
    logger.success(`${communes.length} communes fetched`)

    // 4. Fetch EPCI list
    logger.info('Fetching EPCI list...')
    const epcis = await fetchJson<GeoEpci[]>(`${GEO_API}/epcis?fields=nom,code,population&limit=2000`)
    logger.success(`${epcis.length} EPCI fetched`)

    // Build slug maps for collision detection
    const slugToInsee = new Map<string, string[]>()

    for (const r of regions) {
      const s = regionSlug(r.nom)
      slugToInsee.set(s, [...(slugToInsee.get(s) || []), `${r.code}R`])
    }
    for (const d of departements) {
      const s = departementSlug(d.nom, d.code)
      slugToInsee.set(s, [...(slugToInsee.get(s) || []), `${d.code}D`])
    }
    for (const c of communes) {
      const cp = c.codesPostaux[0] || c.codeDepartement + '000'
      const s = communeSlug(c.nom, cp)
      slugToInsee.set(s, [...(slugToInsee.get(s) || []), c.code])
    }
    for (const e of epcis) {
      const s = epciSlug(e.nom, '')
      slugToInsee.set(s, [...(slugToInsee.get(s) || []), e.code])
    }

    const inseeToSlug = deduplicateSlugs(slugToInsee)

    const totalEntities = regions.length + departements.length + communes.length + epcis.length
    stats.recordsTotal = totalEntities

    // 5. Upsert regions
    logger.info('Upserting régions...')
    await processBatch(regions, async (r) => {
      const codeInsee = `${r.code}R`
      const slug = inseeToSlug.get(codeInsee) || regionSlug(r.nom)
      try {
        await prisma.collectivite.upsert({
          where: { codeInsee },
          create: {
            slug,
            nom: r.nom,
            type: 'REGION',
            codeInsee,
            regionCode: r.code,
            regionNom: r.nom
          },
          update: {
            nom: r.nom,
            slug,
            regionCode: r.code,
            regionNom: r.nom
          }
        })
        stats.recordsImported++
      } catch (e) {
        logger.error(`Failed to upsert region ${r.nom}: ${e}`)
        stats.recordsErrored++
      }
    }, { label: 'Régions', batchSize: 50 })

    // 6. Upsert departements
    logger.info('Upserting départements...')
    await processBatch(departements, async (d) => {
      const codeInsee = `${d.code}D`
      const slug = inseeToSlug.get(codeInsee) || departementSlug(d.nom, d.code)
      try {
        await prisma.collectivite.upsert({
          where: { codeInsee },
          create: {
            slug,
            nom: d.nom,
            type: 'DEPARTEMENT',
            codeInsee,
            departementCode: d.code,
            departementNom: d.nom,
            regionCode: d.codeRegion,
            regionNom: regionMap.get(d.codeRegion) || null
          },
          update: {
            nom: d.nom,
            slug,
            departementCode: d.code,
            departementNom: d.nom,
            regionCode: d.codeRegion,
            regionNom: regionMap.get(d.codeRegion) || null
          }
        })
        stats.recordsImported++
      } catch (e) {
        logger.error(`Failed to upsert dept ${d.nom}: ${e}`)
        stats.recordsErrored++
      }
    }, { label: 'Départements', batchSize: 50 })

    // 7. Upsert communes
    logger.info('Upserting communes...')
    await processBatch(communes, async (c) => {
      const slug = inseeToSlug.get(c.code) || communeSlug(c.nom, c.codesPostaux[0] || '')
      const dept = deptMap.get(c.codeDepartement)
      try {
        await prisma.collectivite.upsert({
          where: { codeInsee: c.code },
          create: {
            slug,
            nom: c.nom,
            type: 'COMMUNE',
            codeInsee: c.code,
            codesPostaux: c.codesPostaux,
            population: c.population || null,
            latitude: c.centre?.coordinates[1] || null,
            longitude: c.centre?.coordinates[0] || null,
            departementCode: c.codeDepartement,
            departementNom: dept?.nom || null,
            regionCode: c.codeRegion,
            regionNom: regionMap.get(c.codeRegion) || null
          },
          update: {
            nom: c.nom,
            slug,
            codesPostaux: c.codesPostaux,
            population: c.population || null,
            latitude: c.centre?.coordinates[1] || null,
            longitude: c.centre?.coordinates[0] || null,
            departementCode: c.codeDepartement,
            departementNom: dept?.nom || null,
            regionCode: c.codeRegion,
            regionNom: regionMap.get(c.codeRegion) || null
          }
        })
        stats.recordsImported++
      } catch (e) {
        logger.error(`Failed to upsert commune ${c.nom} (${c.code}): ${e}`)
        stats.recordsErrored++
      }
    }, { label: 'Communes', batchSize: 100 })

    // 8. Fetch EPCI details + members (rate-limited)
    logger.info('Fetching EPCI details and members (rate-limited)...')
    const throttledFetch = createThrottledFetcher(2)

    await processSequential(epcis, async (e, _i) => {
      try {
        const [detail, members] = await Promise.all([
          throttledFetch<GeoEpciDetail>(`${GEO_API}/epcis/${e.code}`),
          fetchJson<GeoCommune[]>(`${GEO_API}/epcis/${e.code}/communes?fields=code,codeDepartement,codeRegion`)
        ])

        const sousType = mapEpciType(detail.type)
        const firstMember = members[0]
        const deptCode = firstMember?.codeDepartement || null
        const dept = deptCode ? deptMap.get(deptCode) : null
        const regionCode = firstMember?.codeRegion || null
        const membresInsee = members.map(m => m.code)

        const slug = inseeToSlug.get(e.code) || epciSlug(e.nom, deptCode || '')
        await prisma.collectivite.upsert({
          where: { codeInsee: e.code },
          create: {
            slug,
            nom: e.nom,
            type: 'EPCI',
            sousType,
            codeInsee: e.code,
            population: e.population || null,
            departementCode: deptCode,
            departementNom: dept?.nom || null,
            regionCode,
            regionNom: regionCode ? (regionMap.get(regionCode) || null) : null,
            membresInsee
          },
          update: {
            nom: e.nom,
            slug,
            sousType,
            population: e.population || null,
            departementCode: deptCode,
            departementNom: dept?.nom || null,
            regionCode,
            regionNom: regionCode ? (regionMap.get(regionCode) || null) : null,
            membresInsee
          }
        })
        stats.recordsImported++
      } catch (e2) {
        logger.error(`Failed to upsert EPCI ${e.nom} (${e.code}): ${e2}`)
        stats.recordsErrored++
      }
    }, { logEvery: 100, label: 'EPCI' })

    await completeImport(importId, stats)
    logger.success(`Import GEO_API terminé: ${stats.recordsImported} importés, ${stats.recordsErrored} erreurs`)
  } catch (error) {
    await failImport(importId, error)
    throw error
  } finally {
    await disconnect()
  }
}

function mapEpciType(type?: string): string | null {
  if (!type) return null
  const mapping: Record<string, string> = {
    CA: 'COMMUNAUTE_AGGLO',
    CC: 'COMMUNAUTE_COMMUNES',
    CU: 'COMMUNAUTE_URBAINE',
    MET69: 'METROPOLE',
    METRO: 'METROPOLE',
    MET: 'METROPOLE'
  }
  return mapping[type] || null
}

main().catch((e) => {
  logger.error(e)
  process.exit(1)
})
