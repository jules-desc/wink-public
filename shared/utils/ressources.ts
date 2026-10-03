// Référentiel de la section Ressources, partagé entre l'app et le serveur.

export const RESSOURCE_TYPES = ['GUIDE', 'MODELE', 'ACTUALITE', 'METIER', 'PORTRAIT'] as const
export type RessourceType = typeof RESSOURCE_TYPES[number]

export interface Rubrique {
  type: RessourceType
  segment: string
  label: string
  kicker: string
  description: string
  icon: string
}

export const RUBRIQUES: Rubrique[] = [
  {
    type: 'GUIDE',
    segment: 'guides',
    label: 'Guides du recrutement public',
    kicker: 'Guide',
    description: 'Les étapes, les règles et les bons réflexes pour recruter dans une collectivité.',
    icon: 'i-lucide-book-open'
  },
  {
    type: 'MODELE',
    segment: 'modeles',
    label: 'Modèles et outils',
    kicker: 'Modèle',
    description: 'Fiches de poste, trames d\'entretien, grilles de jury : des documents prêts à copier.',
    icon: 'i-lucide-file-text'
  },
  {
    type: 'METIER',
    segment: 'metiers',
    label: 'Fiches métiers du recruteur',
    kicker: 'Fiche métier',
    description: 'Cadre statutaire, viviers de candidats et pièges à éviter, métier par métier.',
    icon: 'i-lucide-id-card'
  },
  {
    type: 'ACTUALITE',
    segment: 'actualites',
    label: 'Actualités RH publiques',
    kicker: 'Actualité',
    description: 'Les évolutions réglementaires décryptées pour celles et ceux qui recrutent.',
    icon: 'i-lucide-newspaper'
  },
  {
    type: 'PORTRAIT',
    segment: 'portraits',
    label: 'Portraits d\'employeurs',
    kicker: 'Portrait',
    description: 'Des équipes RH de collectivités racontent leurs recrutements.',
    icon: 'i-lucide-messages-square'
  }
]

export function rubriqueBySegment(segment: string): Rubrique | undefined {
  return RUBRIQUES.find(r => r.segment === segment)
}

export function rubriqueByType(type: string): Rubrique | undefined {
  return RUBRIQUES.find(r => r.type === type)
}

export function ressourcePath(type: string, slug: string): string {
  const rubrique = rubriqueByType(type)
  return rubrique ? `/ressources/${rubrique.segment}/${slug}` : '/ressources'
}

export const THEMATIQUES: Record<string, string> = {
  'recrutement': 'Recrutement',
  'contractuels': 'Contractuels',
  'concours': 'Concours',
  'remuneration': 'Rémunération',
  'fiche-de-poste': 'Fiche de poste',
  'jury-entretien': 'Jury et entretien',
  'integration': 'Intégration',
  'marque-employeur': 'Marque employeur',
  'petites-communes': 'Petites communes',
  'reglementation': 'Réglementation'
}

export const TYPES_COLLECTIVITE: Record<string, string> = {
  'tous': 'Toutes collectivités',
  'commune': 'Communes',
  'petite-commune': 'Petites communes',
  'epci': 'Intercommunalités',
  'departement': 'Départements',
  'region': 'Régions'
}

export const VERSANTS: Record<string, string> = {
  territoriale: 'Fonction publique territoriale',
  etat: 'Fonction publique de l\'État',
  hospitaliere: 'Fonction publique hospitalière'
}
