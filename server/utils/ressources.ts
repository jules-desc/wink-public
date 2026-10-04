import type { Prisma } from '@prisma/client'

/** Champs d'une ressource pour les listes (sans le contenu). */
export const ressourceCardSelect = {
  id: true,
  slug: true,
  type: true,
  titre: true,
  chapo: true,
  tempsLecture: true,
  imageUrl: true,
  enAvant: true,
  thematiques: true,
  typesCollectivite: true,
  datePublication: true,
  dateMiseAJour: true,
  meta: true
} satisfies Prisma.RessourceSelect

export type RessourceCardRow = Prisma.RessourceGetPayload<{ select: typeof ressourceCardSelect }>

export const publishedWhere = { statut: 'PUBLIE' } satisfies Prisma.RessourceWhereInput
