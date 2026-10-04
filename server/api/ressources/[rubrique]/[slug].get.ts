// Détail d'une ressource publiée, rendu Markdown compris, avec des contenus liés.
export default defineEventHandler(async (event) => {
  const rubrique = rubriqueBySegment(getRouterParam(event, 'rubrique') || '')
  const slug = getRouterParam(event, 'slug') || ''
  if (!rubrique) throw createError({ statusCode: 404, statusMessage: 'Rubrique inconnue' })

  const ressource = await prisma.ressource.findFirst({
    where: { ...publishedWhere, type: rubrique.type, slug }
  })
  if (!ressource) throw createError({ statusCode: 404, statusMessage: 'Ressource non trouvée' })

  const parts = rubrique.type === 'MODELE' ? splitModele(ressource.contenu) : null
  const rendered = renderMarkdown(parts ? parts.avant : ressource.contenu)
  const modele = parts?.modele
    ? { source: parts.modele, html: renderMarkdown(parts.modele).html }
    : null
  const apres = parts?.apres ? renderMarkdown(parts.apres) : null

  const lies = await prisma.ressource.findMany({
    where: {
      ...publishedWhere,
      id: { not: ressource.id },
      thematiques: ressource.thematiques.length ? { hasSome: ressource.thematiques } : undefined
    },
    select: ressourceCardSelect,
    orderBy: { datePublication: 'desc' },
    take: 3
  })

  const { contenu: _contenu, fichierSource: _f, empreinte: _e, ...rest } = ressource

  return {
    ...rest,
    html: rendered.html,
    toc: [...rendered.toc, ...(modele ? [{ id: 'le-modele', text: 'Le modèle', level: 2 }] : []), ...(apres?.toc ?? [])],
    modele,
    htmlApres: apres?.html ?? null,
    lies
  }
})
