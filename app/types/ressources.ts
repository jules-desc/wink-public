export interface RessourceCardItem {
  id: string
  slug: string
  type: string
  titre: string
  chapo: string
  tempsLecture: number | null
  imageUrl: string | null
  enAvant: boolean
  thematiques: string[]
  typesCollectivite: string[]
  datePublication: string
  dateMiseAJour: string | null
  meta: Record<string, unknown>
}

export interface RessourcesListResponse {
  data: RessourceCardItem[]
  meta: { page: number, limit: number, total: number, totalPages: number }
}

export interface RessourcesHubResponse {
  une: RessourceCardItem[]
  rubriques: Array<{ segment: string, count: number, items: RessourceCardItem[] }>
}

export interface RessourceDetail extends RessourceCardItem {
  statut: string
  auteur: string | null
  personas: string[]
  versants: string[]
  faq: Array<{ question: string, reponse: string }>
  sources: Array<{ titre: string, url: string }>
  titreSeo: string | null
  metaDescription: string | null
  html: string
  toc: Array<{ id: string, text: string, level: number }>
  modele: { source: string, html: string } | null
  htmlApres: string | null
  lies: RessourceCardItem[]
}
