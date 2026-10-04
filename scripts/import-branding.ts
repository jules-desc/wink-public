import { readFileSync } from 'node:fs'
import { prisma, disconnect } from './lib/prisma.js'
import { logger, progress, resetProgress } from './lib/logger.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'

interface ExtractionColor {
  hex: string
  usage?: string
  source?: string
  isCharte?: boolean
}

interface ExtractionResult {
  collectivite: string
  slug?: string
  codeInsee?: string
  siteWeb?: string
  colors: {
    primary: ExtractionColor | string
    secondary?: ExtractionColor | string | null
    accent?: ExtractionColor | string | null
    background?: string | null
    text?: string | null
    extra?: Array<{ hex: string; name?: string; usage?: string; isCharte?: boolean }>
  }
  logos?: {
    main?: { url?: string | null; description?: string; format?: string; hasTransparentBackground?: boolean | null }
    icon?: { url?: string | null; description?: string }
    blason?: { url?: string | null; description?: string }
  }
  typography?: {
    heading?: { family?: string; weight?: string; source?: string; certainty?: string; isCommercial?: boolean; libreFallback?: string | null }
    body?: { family?: string; weight?: string; source?: string; certainty?: string; isCommercial?: boolean; libreFallback?: string | null }
  }
  visuals?: {
    borderRadius?: string
    buttonStyle?: string
    patterns?: string | null
    photoStyle?: string
  }
  confidence?: {
    colors?: string
    typography?: string
    logos?: string
    overall?: string
  }
  wcagCheck?: Record<string, unknown>
  notes?: string
}

function extractHex(color: ExtractionColor | string | null | undefined): string | null {
  if (!color) return null
  if (typeof color === 'string') return isValidHex(color) ? color : null
  return isValidHex(color.hex) ? color.hex : null
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$/.test(value)
}

function resolveFont(typo: ExtractionResult['typography']): { headingFont: string | null; bodyFont: string | null } {
  const heading = typo?.heading
  const body = typo?.body

  const headingFont = heading?.isCommercial && heading?.libreFallback
    ? heading.libreFallback
    : heading?.family || null

  const bodyFont = body?.isCommercial && body?.libreFallback
    ? body.libreFallback
    : body?.family || null

  return { headingFont, bodyFont }
}

async function main() {
  const args = process.argv.slice(2)
  const fileIdx = args.indexOf('--file')
  const autoPublish = args.includes('--auto-publish')

  if (fileIdx === -1 || !args[fileIdx + 1]) {
    logger.error('Usage: npx tsx scripts/import-branding.ts --file <path.json> [--auto-publish]')
    process.exit(1)
  }

  const filePath = args[fileIdx + 1]
  const raw = readFileSync(filePath, 'utf-8')
  let items: ExtractionResult[]

  try {
    const parsed = JSON.parse(raw)
    items = Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    logger.error(`Erreur de parsing JSON: ${filePath}`)
    process.exit(1)
  }

  logger.info(`[Branding] ${items.length} extraction(s) à importer depuis ${filePath}`)
  if (autoPublish) logger.info('[Branding] Mode auto-publish activé')

  const importId = await startImport('BRANDING_EXTRACTION')
  let imported = 0
  let skipped = 0
  let errored = 0

  resetProgress()

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    progress(i + 1, items.length, 'Branding')

    try {
      const where = item.slug
        ? { slug: item.slug, deletedAt: null }
        : item.codeInsee
          ? { codeInsee: item.codeInsee }
          : null

      if (!where) {
        logger.warn(`[Branding] Ni slug ni codeInsee pour "${item.collectivite}", skip`)
        skipped++
        continue
      }

      const collectivite = await prisma.collectivite.findFirst({ where })
      if (!collectivite) {
        logger.warn(`[Branding] Collectivité non trouvée: ${item.slug || item.codeInsee}`)
        skipped++
        continue
      }

      const { headingFont, bodyFont } = resolveFont(item.typography)
      const status = autoPublish ? 'PUBLISHED' : 'DRAFT'
      const now = new Date()

      const upsertData = {
        primaryColor: extractHex(item.colors.primary),
        secondaryColor: extractHex(item.colors.secondary),
        accentColor: extractHex(item.colors.accent),
        backgroundColor: extractHex(item.colors.background),
        textColor: extractHex(item.colors.text),
        headingFont,
        bodyFont,
        logoMainUrl: item.logos?.main?.url || null,
        logoIconUrl: item.logos?.icon?.url || null,
        borderRadius: item.visuals?.borderRadius || null,
        colorsConfig: item.colors as unknown as Record<string, unknown>,
        logosConfig: (item.logos || {}) as Record<string, unknown>,
        typographyConfig: (item.typography || {}) as Record<string, unknown>,
        visualsConfig: (item.visuals || {}) as Record<string, unknown>,
        source: 'EXTRACTED' as const,
        status,
        extractedFrom: item.siteWeb || null,
        confidenceScore: item.confidence?.overall || null,
        notes: item.notes || null,
        ...(autoPublish && { publishedAt: now })
      }

      await prisma.collectiviteBranding.upsert({
        where: { collectiviteId: collectivite.id },
        update: upsertData,
        create: {
          collectiviteId: collectivite.id,
          ...upsertData
        }
      })

      imported++
      logger.success(`[Branding] ${collectivite.nom} — ${status}`)
    } catch (err) {
      errored++
      logger.error(`[Branding] Erreur pour "${item.collectivite}": ${err instanceof Error ? err.message : err}`)
    }
  }

  await completeImport(importId, {
    recordsTotal: items.length,
    recordsImported: imported,
    recordsSkipped: skipped,
    recordsErrored: errored
  })

  logger.info(`[Branding] Terminé: ${imported} importés, ${skipped} skippés, ${errored} erreurs`)
}

main()
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
  .finally(() => disconnect())
