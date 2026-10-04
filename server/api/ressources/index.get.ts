import type { Prisma } from '@prisma/client'

// Liste paginée des ressources publiées, filtrable par rubrique, thématique et type de collectivité.
export default defineEventHandler(async (event) => {
  const { page, limit, skip } = parsePagination(event)
  const query = getQuery(event)

  const where: Prisma.RessourceWhereInput = { ...publishedWhere }

  if (query.rubrique) {
    const rubrique = rubriqueBySegment(String(query.rubrique))
    if (!rubrique) throw createError({ statusCode: 400, statusMessage: 'Rubrique inconnue' })
    where.type = rubrique.type
  }
  if (query.thematique) {
    where.thematiques = { has: String(query.thematique) }
  }
  if (query.typeCollectivite && query.typeCollectivite !== 'tous') {
    where.typesCollectivite = { hasSome: [String(query.typeCollectivite), 'tous'] }
  }
  if (query.q) {
    const q = String(query.q).slice(0, 100)
    where.OR = [
      { titre: { contains: q, mode: 'insensitive' } },
      { chapo: { contains: q, mode: 'insensitive' } }
    ]
  }

  const [data, total] = await Promise.all([
    prisma.ressource.findMany({
      where,
      select: ressourceCardSelect,
      orderBy: [{ datePublication: 'desc' }, { titre: 'asc' }],
      skip,
      take: limit
    }),
    prisma.ressource.count({ where })
  ])

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  }
})
