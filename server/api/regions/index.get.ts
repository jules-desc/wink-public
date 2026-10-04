export default defineEventHandler(async () => {
  const groups = await prisma.collectivite.groupBy({
    by: ['regionCode', 'regionNom'],
    where: {
      deletedAt: null,
      regionCode: { not: null }
    },
    _count: { id: true },
    orderBy: { regionCode: 'asc' }
  })

  return groups
    .filter(g => g.regionCode && g.regionNom)
    .map(g => ({
      code: g.regionCode!,
      nom: g.regionNom!,
      count: g._count.id
    }))
})
