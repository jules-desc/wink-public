import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { page, limit, skip } = parsePagination(event)
  const query = getQuery(event)

  const where: Prisma.CollectiviteWhereInput = { deletedAt: null }

  if (query.type) {
    where.type = String(query.type)
  }
  if (query.departementCode) {
    where.departementCode = String(query.departementCode)
  }
  if (query.regionCode) {
    where.regionCode = String(query.regionCode)
  }
  if (query.search) {
    where.nom = { contains: String(query.search), mode: 'insensitive' }
  }

  const [data, total] = await Promise.all([
    prisma.collectivite.findMany({
      where,
      select: {
        id: true,
        slug: true,
        nom: true,
        nomCourt: true,
        type: true,
        sousType: true,
        departementCode: true,
        departementNom: true,
        regionCode: true,
        regionNom: true,
        population: true,
        effectifs: true,
        blasonUrl: true,
        logoUrl: true,
        codesPostaux: true
      },
      orderBy: [{ population: { sort: 'desc', nulls: 'last' } }, { nom: 'asc' }],
      skip,
      take: limit
    }),
    prisma.collectivite.count({ where })
  ])

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
})
