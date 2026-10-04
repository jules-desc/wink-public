import { brandingUpsertSchema } from '~~/server/utils/validators/branding'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug requis' })
  }

  const apiKey = getHeader(event, 'authorization')?.replace('Bearer ', '')
  const expectedKey = useRuntimeConfig().brandingApiKey
  if (!expectedKey || apiKey !== expectedKey) {
    throw createError({ statusCode: 401, statusMessage: 'Clé API invalide' })
  }

  const body = await readBody(event)
  const parsed = brandingUpsertSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Payload invalide',
      data: parsed.error.flatten()
    })
  }

  const collectivite = await prisma.collectivite.findUnique({
    where: { slug, deletedAt: null }
  })
  if (!collectivite) {
    throw createError({ statusCode: 404, statusMessage: 'Collectivité non trouvée' })
  }

  const data = parsed.data
  const now = new Date()
  const isPublished = data.status === 'PUBLISHED'

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

  const branding = await prisma.collectiviteBranding.upsert({
    where: { collectiviteId: collectivite.id },
    update: upsertData,
    create: {
      collectiviteId: collectivite.id,
      ...upsertData
    }
  })

  return branding
})
