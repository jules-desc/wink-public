import * as cheerio from 'cheerio'
import { prisma, disconnect } from './lib/prisma.js'
import { logger } from './lib/logger.js'
import { fetchJson, fetchText, sleep } from './lib/fetcher.js'
import { startImport, completeImport, failImport } from './lib/import-tracker.js'
import { processSequential } from './lib/batch.js'

const CLSP_API = 'https://choisirleservicepublic.gouv.fr'

interface EmployeurMobile {
  ID: string
  display_name: string
  user_login: string
  talensoft_id: string
  logo_url: string
  qui_sommes_nous: {
    title: string
    image: string
    text: string
  }
}

interface ScrapedData {
  effectifs: number | null
  budget: number | null
  ratioFemmes: number | null
  ageMoyen: number | null
  bannerUrl: string | null
  gallery: Array<{ url: string, caption: string | null, source: string }>
  benefits: string[]
  socialLinks: Record<string, string>
  siteWeb: string | null
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, '\'')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function parseNumber(text: string): number | null {
  const cleaned = text.replace(/\s/g, '').replace(/,/g, '.')
  const match = cleaned.match(/([\d.]+)/)
  if (!match) return null
  const num = parseFloat(match[1])
  if (isNaN(num)) return null
  if (cleaned.includes('Md') || cleaned.includes('milliard')) return Math.round(num * 1_000_000_000)
  if (cleaned.includes('M') || cleaned.includes('million')) return Math.round(num * 1_000_000)
  return Math.round(num)
}

function parsePercentage(text: string): number | null {
  const match = text.match(/([\d.,]+)\s*%/)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

function parseAge(text: string): number | null {
  const match = text.match(/([\d.,]+)\s*an/)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

async function scrapeEmployerPage(slug: string): Promise<ScrapedData> {
  const result: ScrapedData = {
    effectifs: null,
    budget: null,
    ratioFemmes: null,
    ageMoyen: null,
    bannerUrl: null,
    gallery: [],
    benefits: [],
    socialLinks: {},
    siteWeb: null
  }

  try {
    const html = await fetchText(`${CLSP_API}/employeurs/${slug}/`)
    const $ = cheerio.load(html)

    // Banner image
    const bannerImg = $('img.banner-image, .employer-banner img, .header-image img, [class*="banner"] img').first()
    if (bannerImg.length) {
      result.bannerUrl = bannerImg.attr('src') || bannerImg.attr('data-src') || null
    }

    // Stats ("Chiffres clés")
    $('[class*="chiffre"], [class*="stat"], [class*="key-figure"], .chiffres-cles .item, .key-figures .item').each((_i, el) => {
      const text = $(el).text()
      if (/agent|collaborat|salari/i.test(text) && !result.effectifs) {
        result.effectifs = parseNumber(text)
      }
      if (/budget|€|euro/i.test(text) && !result.budget) {
        result.budget = parseNumber(text)
      }
      if (/(femme|homme|parit|genre)/i.test(text)) {
        const pct = parsePercentage(text)
        if (pct && /femme/i.test(text)) result.ratioFemmes = pct
      }
      if (/âge|age moyen/i.test(text)) {
        result.ageMoyen = parseAge(text)
      }
    })

    // Gallery photos
    $('[class*="gallery"] img, [class*="decouvrir"] img, .nous-decouvrir img').each((_i, el) => {
      const url = $(el).attr('src') || $(el).attr('data-src')
      if (url && !url.includes('logo') && !url.includes('favicon')) {
        result.gallery.push({
          url: url.startsWith('http') ? url : `${CLSP_API}${url}`,
          caption: $(el).attr('alt') || null,
          source: 'choisirleservicepublic.gouv.fr'
        })
      }
    })

    // Benefits ("Nos atouts")
    $('[class*="atout"], [class*="benefit"], .nos-atouts li, .nos-atouts p').each((_i, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 3 && text.length < 200) {
        result.benefits.push(text)
      }
    })

    // Social links
    $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="x.com"], a[href*="linkedin.com"], a[href*="instagram.com"], a[href*="youtube.com"]').each((_i, el) => {
      const href = $(el).attr('href')
      if (!href) return
      if (href.includes('facebook.com')) result.socialLinks.facebook = href
      else if (href.includes('twitter.com') || href.includes('x.com')) result.socialLinks.x = href
      else if (href.includes('linkedin.com')) result.socialLinks.linkedin = href
      else if (href.includes('instagram.com')) result.socialLinks.instagram = href
      else if (href.includes('youtube.com')) result.socialLinks.youtube = href
    })

    // Website
    const siteLink = $('a[href]:contains("Site officiel"), a[href]:contains("site web"), a.site-officiel').first()
    if (siteLink.length) {
      result.siteWeb = siteLink.attr('href') || null
    }
  } catch (e) {
    logger.warn(`Failed to scrape ${slug}: ${e}`)
  }

  return result
}

async function matchEmployer(displayName: string): Promise<string | null> {
  const normalized = slugify(displayName)

  // Exact match on nom
  let match = await prisma.collectivite.findFirst({
    where: { nom: { equals: displayName, mode: 'insensitive' } },
    select: { codeInsee: true }
  })
  if (match) return match.codeInsee

  // Match on nomCourt
  match = await prisma.collectivite.findFirst({
    where: { nomCourt: { equals: displayName, mode: 'insensitive' } },
    select: { codeInsee: true }
  })
  if (match) return match.codeInsee

  // Match without common prefixes
  const prefixes = ['ville de ', 'commune de ', 'mairie de ', 'département de ', 'département du ', 'département de l\'', 'département des ', 'region ', 'région ']
  let cleaned = displayName.toLowerCase()
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length)
      break
    }
  }

  match = await prisma.collectivite.findFirst({
    where: {
      OR: [
        { nom: { contains: cleaned, mode: 'insensitive' } },
        { nomCourt: { contains: cleaned, mode: 'insensitive' } }
      ]
    },
    select: { codeInsee: true }
  })
  if (match) return match.codeInsee

  // Slug-based matching
  match = await prisma.collectivite.findFirst({
    where: { slug: { contains: normalized } },
    select: { codeInsee: true }
  })
  if (match) return match.codeInsee

  return null
}

async function main() {
  const importId = await startImport('CHOISIR_SP')
  const stats = { recordsTotal: 0, recordsImported: 0, recordsUpdated: 0, recordsSkipped: 0, recordsErrored: 0 }
  const unmatched: string[] = []

  try {
    // 1. Fetch employer mobile API
    logger.info('Fetching employeur-mobile API...')
    const employers = await fetchJson<EmployeurMobile[]>(`${CLSP_API}/wp-json/api/employeur-mobile`)
    stats.recordsTotal = employers.length
    logger.success(`${employers.length} employers fetched`)

    // 2. Process each employer
    await processSequential(employers, async (emp, _i) => {
      const slug = emp.user_login || emp.ID

      // Match to collectivite
      const codeInsee = await matchEmployer(emp.display_name)
      if (!codeInsee) {
        unmatched.push(`${emp.display_name} (slug: ${slug})`)
        stats.recordsSkipped++
        return
      }

      try {
        // Scrape full page for rich data
        await sleep(2000)
        const scraped = await scrapeEmployerPage(slug)

        const logoUrl = emp.logo_url || null
        const featuredImage = emp.qui_sommes_nous?.image || null
        const description = emp.qui_sommes_nous?.text
          ? stripHtml(emp.qui_sommes_nous.text)
          : null

        // Build gallery
        const gallery = [...scraped.gallery]
        if (featuredImage && !gallery.some(p => p.url === featuredImage)) {
          gallery.unshift({
            url: featuredImage,
            caption: emp.display_name,
            source: 'choisirleservicepublic.gouv.fr'
          })
        }

        // Get current data
        const existing = await prisma.collectivite.findUnique({
          where: { codeInsee },
          select: {
            id: true,
            logoUrl: true,
            bannerUrl: true,
            description: true,
            effectifs: true,
            budgetTotal: true,
            benefits: true,
            socialMediaLinks: true,
            siteWeb: true
          }
        })

        if (!existing) {
          stats.recordsSkipped++
          return
        }

        const updates: Record<string, unknown> = {}

        if (!existing.logoUrl && logoUrl) updates.logoUrl = logoUrl
        if (!existing.bannerUrl && scraped.bannerUrl) updates.bannerUrl = scraped.bannerUrl
        if (!existing.description && description) updates.description = description
        if (!existing.effectifs && scraped.effectifs) updates.effectifs = scraped.effectifs
        if (!existing.budgetTotal && scraped.budget) {
          updates.budgetTotal = scraped.budget
        }
        if (scraped.ratioFemmes) updates.ratioFemmes = scraped.ratioFemmes
        if (scraped.ageMoyen) updates.ageMoyen = scraped.ageMoyen
        if (gallery.length > 0) updates.photosGallery = gallery
        if (scraped.benefits.length > 0) {
          const mergedBenefits = [...new Set([...(existing.benefits || []), ...scraped.benefits])]
          updates.benefits = mergedBenefits
        }
        if (Object.keys(scraped.socialLinks).length > 0) {
          const existingLinks = (existing.socialMediaLinks as Record<string, string>) || {}
          updates.socialMediaLinks = { ...existingLinks, ...scraped.socialLinks }
        }
        if (!existing.siteWeb && scraped.siteWeb) updates.siteWeb = scraped.siteWeb

        if (Object.keys(updates).length > 0) {
          await prisma.collectivite.update({
            where: { codeInsee },
            data: updates
          })
          stats.recordsUpdated++
        } else {
          stats.recordsSkipped++
        }

        // Store raw data in DonneePublique
        const rawData = { api: emp, scraped }
        const hash = Buffer.from(JSON.stringify(rawData)).toString('base64').slice(0, 64)

        await prisma.donneePublique.upsert({
          where: {
            id: `clsp-${emp.ID}`
          },
          create: {
            id: `clsp-${emp.ID}`,
            collectiviteId: existing.id,
            source: 'CHOISIR_SP',
            typeDonnee: 'RAW_SCRAPE',
            donnees: rawData,
            hash
          },
          update: {
            donnees: rawData,
            hash,
            dateCollecte: new Date()
          }
        })
      } catch (e) {
        logger.warn(`Failed to process ${emp.display_name}: ${e}`)
        stats.recordsErrored++
      }
    }, { logEvery: 25, label: 'CLSP' })

    if (unmatched.length > 0) {
      logger.warn(`${unmatched.length} unmatched employers:`)
      for (const name of unmatched.slice(0, 30)) {
        logger.warn(`  - ${name}`)
      }
      if (unmatched.length > 30) {
        logger.warn(`  ... and ${unmatched.length - 30} more`)
      }
    }

    await completeImport(importId, stats)
    logger.success(`Import CHOISIR_SP terminé: ${stats.recordsUpdated} enrichis, ${stats.recordsSkipped} skipped, ${stats.recordsErrored} erreurs, ${unmatched.length} unmatched`)
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
