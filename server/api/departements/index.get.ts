export default defineEventHandler(async () => {
  const groups = await prisma.collectivite.groupBy({
    by: ['departementCode', 'departementNom'],
    where: {
      deletedAt: null,
      departementCode: { not: null }
    },
    _count: { id: true },
    orderBy: { departementCode: 'asc' }
  })

  return groups
    .filter(g => g.departementCode && g.departementNom)
    .map(g => ({
      code: g.departementCode!,
      nom: g.departementNom!,
      count: g._count.id
    }))
})
