export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const requestUrl = getRequestURL(event as Parameters<typeof getRequestURL>[0])
  const siteUrl = config.public.siteUrl || requestUrl.origin

  const [collectivites, departements, regions, ressources] = await Promise.all([
    prisma.collectivite.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
      orderBy: { population: 'desc' }
    }),
    prisma.collectivite.groupBy({
      by: ['departementCode'],
      where: { deletedAt: null, departementCode: { not: null } },
      _max: { updatedAt: true }
    }),
    prisma.collectivite.groupBy({
      by: ['regionCode'],
      where: { deletedAt: null, regionCode: { not: null } },
      _max: { updatedAt: true }
    }),
    prisma.ressource.findMany({
      where: { statut: 'PUBLIE' },
      select: { type: true, slug: true, updatedAt: true },
      orderBy: { datePublication: 'desc' }
    })
  ])

  const urls: Array<{ loc: string, lastmod?: string, changefreq: string, priority: string }> = []

  urls.push({ loc: siteUrl, changefreq: 'daily', priority: '1.0' })
  urls.push({ loc: `${siteUrl}/ressources`, changefreq: 'daily', priority: '0.9' })
  urls.push({ loc: `${siteUrl}/annuaire`, changefreq: 'weekly', priority: '0.8' })
  urls.push({ loc: `${siteUrl}/ressources/grilles`, changefreq: 'monthly', priority: '0.8' })
  urls.push({ loc: `${siteUrl}/ressources/chiffres-cles`, changefreq: 'monthly', priority: '0.7' })
  for (const r of RUBRIQUES) {
    urls.push({ loc: `${siteUrl}/ressources/${r.segment}`, changefreq: 'weekly', priority: '0.8' })
  }
  for (const r of ressources) {
    urls.push({
      loc: `${siteUrl}${ressourcePath(r.type, r.slug)}`,
      lastmod: r.updatedAt.toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    })
  }

  for (const c of collectivites) {
    urls.push({
      loc: `${siteUrl}/etablissement/${c.slug}`,
      lastmod: c.updatedAt.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8'
    })
  }

  for (const d of departements) {
    if (!d.departementCode) continue
    urls.push({
      loc: `${siteUrl}/departement/${d.departementCode}`,
      lastmod: d._max.updatedAt?.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.6'
    })
  }

  for (const r of regions) {
    if (!r.regionCode) continue
    urls.push({
      loc: `${siteUrl}/region/${r.regionCode}`,
      lastmod: r._max.updatedAt?.toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.5'
    })
  }

  const entries = urls.map((u) => {
    let xml = `  <url>\n    <loc>${escapeXml(u.loc)}</loc>`
    if (u.lastmod) xml += `\n    <lastmod>${u.lastmod}</lastmod>`
    xml += `\n    <changefreq>${u.changefreq}</changefreq>`
    xml += `\n    <priority>${u.priority}</priority>`
    xml += '\n  </url>'
    return xml
  }).join('\n')

  setResponseHeader(event as Parameters<typeof setResponseHeader>[0], 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
})

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
