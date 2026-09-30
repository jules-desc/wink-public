import { brandingBulkImportSchema } from '~~/server/utils/validators/branding'

export default defineEventHandler(async (event) => {
  const apiKey = getHeader(event, 'authorization')?.replace('Bearer ', '')
  const expectedKey = useRuntimeConfig().brandingApiKey
  if (!expectedKey || apiKey !== expectedKey) {
    throw createError({ statusCode: 401, statusMessage: 'Clé API invalide' })
  }

  const body = await readBody(event)
  const parsed = brandingBulkImportSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload invalide',
      data: parsed.error.flatten()
    })
  }

  const results: { imported: number; failed: number; errors: Array<{ slug: string; message: string }> } = {
    imported: 0,
    failed: 0,
    errors: []
  }

  for (const item of parsed.data.items) {
    try {
      const collectivite = await prisma.collectivite.findUnique({
        where: { slug: item.slug, deletedAt: null }
      })

      if (!collectivite) {
        results.failed++
        results.errors.push({ slug: item.slug, message: 'Collectivité non trouvée' })
        continue
      }

      const data = item.branding
      const isPublished = data.status === 'PUBLISHED'
      const now = new Date()

      const upsertData = {
        primaryColor: data.primaryColor ?? null,
        secondaryColor: data.secondaryColor ?? null,
        accentColor: data.accentColor ?? null,
        backgroundColor: data.backgroundColor ?? null,
        textColor: data.textColor ?? null,
        headingFont: data.headingFont ?? null,
        bodyFont: data.bodyFont ?? null,
        logoMainUrl: data.logoMainUrl ?? null,
        logoIconUrl: data.logoIconUrl ?? null,
        borderRadius: data.borderRadius ?? null,
        colorsConfig: data.colorsConfig ?? {},
        logosConfig: data.logosConfig ?? {},
        typographyConfig: data.typographyConfig ?? {},
        visualsConfig: data.visualsConfig ?? {},
        source: data.source ?? 'EXTRACTED',
        status: data.status ?? 'DRAFT',
        extractedFrom: data.extractedFrom ?? null,
        extractedBy: data.extractedBy ?? null,
        confidenceScore: data.confidenceScore ?? null,
        notes: data.notes ?? null,
        ...(isPublished && { publishedAt: now })
      }

      await prisma.collectiviteBranding.upsert({
        where: { collectiviteId: collectivite.id },
        update: upsertData,
        create: {
          collectiviteId: collectivite.id,
          ...upsertData
        }
      })

      results.imported++
    } catch (err) {
      results.failed++
      results.errors.push({
        slug: item.slug,
        message: err instanceof Error ? err.message : 'Erreur inconnue'
      })
    }
  }

  return results
})
