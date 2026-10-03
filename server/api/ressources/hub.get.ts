// Données de la page d'accueil des ressources : à la une, derniers contenus par rubrique, compteurs.
export default defineEventHandler(async () => {
  const [enAvant, recents, counts] = await Promise.all([
    prisma.ressource.findMany({
      where: { ...publishedWhere, enAvant: true },
      select: ressourceCardSelect,
      orderBy: { datePublication: 'desc' },
      take: 3
    }),
    Promise.all(RUBRIQUES.map(r =>
      prisma.ressource.findMany({
        where: { ...publishedWhere, type: r.type },
        select: ressourceCardSelect,
        orderBy: { datePublication: 'desc' },
        take: 4
      })
    )),
    prisma.ressource.groupBy({
      by: ['type'],
      where: publishedWhere,
      _count: { _all: true }
    })
  ])

  // À défaut de contenus mis en avant, la une reprend les plus récents.
  const une = enAvant.length
    ? enAvant
    : recents.flat().sort((a, b) => b.datePublication.getTime() - a.datePublication.getTime()).slice(0, 3)

  return {
    une,
    rubriques: RUBRIQUES.map((r, i) => ({
      segment: r.segment,
      count: counts.find(c => c.type === r.type)?._count._all ?? 0,
      items: recents[i] ?? []
    }))
  }
})
