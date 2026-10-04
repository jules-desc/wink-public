export interface CollectiviteSummary {
  id: string
  slug: string
  nom: string
  nomCourt: string | null
  type: string
  sousType: string | null
  departementCode: string | null
  departementNom: string | null
  regionCode: string | null
  regionNom: string | null
  population: number | null
  effectifs: number | null
  blasonUrl: string | null
  logoUrl: string | null
  codesPostaux: string[]
}

export interface ContenuPage {
  id: string
  titreSeo: string | null
  metaDescription: string | null
  titreH1: string | null
  introduction: string | null
  pourquoiRejoindre: string | null
  cadreDeVie: string | null
  filieresMetiers: string | null
  sectionsExtra: unknown
  status: string
  publishedAt: string | null
}

export interface OffreEmploi {
  id: string
  titre: string
  description: string | null
  urlSource: string | null
  source: string
  contractType: string | null
  workSchedule: string | null
  remote: string | null
  adresseVille: string | null
  adresseCodePostal: string | null
  experience: string | null
  education: string | null
  salaryMin: string | null
  salaryMax: string | null
  salaryCurrency: string | null
  salaryPeriod: string | null
  publicGradeCategories: string[]
  datePublication: string | null
  dateExpiration: string | null
  dateLimite: string | null
  status: string
}

export interface CollectiviteBrandingData {
  id: string
  primaryColor: string | null
  secondaryColor: string | null
  accentColor: string | null
  backgroundColor: string | null
  textColor: string | null
  headingFont: string | null
  bodyFont: string | null
  logoMainUrl: string | null
  logoIconUrl: string | null
  borderRadius: string | null
  colorsConfig: Record<string, unknown>
  logosConfig: Record<string, unknown>
  typographyConfig: Record<string, unknown>
  visualsConfig: Record<string, unknown>
  source: string
  status: string
  confidenceScore: string | null
}

export interface ResolvedBranding {
  primaryColor: string
  secondaryColor: string | null
  accentColor: string | null
  backgroundColor: string | null
  textColor: string | null
  headingFont: string | null
  bodyFont: string | null
  logoMainUrl: string | null
  logoIconUrl: string | null
  borderRadius: string | null
  source: 'branding' | 'legacy' | 'fallback' | 'default'
}

export interface CollectiviteDetail {
  id: string
  slug: string
  nom: string
  nomCourt: string | null
  type: string
  sousType: string | null
  codeInsee: string | null
  codesPostaux: string[]
  departementCode: string | null
  departementNom: string | null
  regionCode: string | null
  regionNom: string | null
  latitude: number | null
  longitude: number | null
  adresseNumero: string | null
  adresseRue: string | null
  adresseVille: string | null
  adresseCodePostal: string | null
  adresseFormatee: string | null
  telephone: string | null
  email: string | null
  siteWeb: string | null
  horaires: string | null
  logoUrl: string | null
  blasonUrl: string | null
  bannerUrl: string | null
  description: string | null
  primaryColor: string | null
  socialMediaLinks: Record<string, string> | null
  population: number | null
  effectifs: number | null
  budgetTotal: string | null
  ratioFemmes: number | null
  ageMoyen: number | null
  photosGallery: Array<{ url: string, caption: string | null, source: string }> | null
  benefits: string[]
  competences: string[]
  pageStatus: string
  isClaimed: boolean
  contenuPage: ContenuPage | null
  branding: CollectiviteBrandingData | null
  resolvedBranding: ResolvedBranding
  offresEmploi: OffreEmploi[]
  offresCount: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SearchResult {
  slug: string
  nom: string
  type: string
  sousType: string | null
  departementNom: string | null
  codesPostaux: string[]
  blasonUrl: string | null
  logoUrl: string | null
}

export interface DepartementItem {
  code: string
  nom: string
  count: number
}

export interface RegionItem {
  code: string
  nom: string
  count: number
}
