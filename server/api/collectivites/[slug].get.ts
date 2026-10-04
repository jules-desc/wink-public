export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug requis' })
  }

  const [collectivite, offresCount] = await Promise.all([
    prisma.collectivite.findUnique({
      where: { slug, deletedAt: null },
      include: {
        contenuPage: true,
        branding: true,
        offresEmploi: {
          where: { status: 'ACTIVE' },
          orderBy: { datePublication: 'desc' },
          take: 20
        }
      }
    }),
    prisma.offreEmploi.count({
      where: {
        collectivite: { slug, deletedAt: null },
        status: 'ACTIVE'
      }
    })
  ])

  if (!collectivite) {
    throw createError({ statusCode: 404, message: 'Collectivité non trouvée' })
  }

  const contenuPage = collectivite.contenuPage?.status === 'PUBLISHED'
    ? collectivite.contenuPage
    : null

  const branding = collectivite.branding?.status === 'PUBLISHED'
    ? collectivite.branding
    : null

  const resolvedBranding = resolveBranding(collectivite)

  return {
    ...collectivite,
    contenuPage,
    branding,
    resolvedBranding,
    offresCount
  }
})
