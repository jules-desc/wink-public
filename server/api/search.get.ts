export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()

  if (q.length < 2) {
    return []
  }

  return prisma.collectivite.findMany({
    where: {
      nom: { contains: q, mode: 'insensitive' },
      deletedAt: null
    },
    select: {
      slug: true,
      nom: true,
      type: true,
      sousType: true,
      departementNom: true,
      codesPostaux: true,
      blasonUrl: true,
      logoUrl: true
    },
    orderBy: { population: { sort: 'desc', nulls: 'last' } },
    take: 10
  })
})
