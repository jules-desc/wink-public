// Enums TypeScript — calqués sur Wink ATS pour compatibilité future
// Pas d'enums Prisma : validation en TypeScript/Zod, stockage en String

// --- Collectivite ---

export const CollectiviteType = {
  COMMUNE: 'COMMUNE',
  EPCI: 'EPCI',
  DEPARTEMENT: 'DEPARTEMENT',
  REGION: 'REGION',
  CDG: 'CDG',
  SYNDICAT_MIXTE: 'SYNDICAT_MIXTE'
} as const

export type CollectiviteType = (typeof CollectiviteType)[keyof typeof CollectiviteType]

export const EpciSousType = {
  COMMUNAUTE_COMMUNES: 'COMMUNAUTE_COMMUNES',
  COMMUNAUTE_AGGLO: 'COMMUNAUTE_AGGLO',
  COMMUNAUTE_URBAINE: 'COMMUNAUTE_URBAINE',
  METROPOLE: 'METROPOLE'
} as const

export type EpciSousType = (typeof EpciSousType)[keyof typeof EpciSousType]

export const PageStatus = {
  AUTO: 'AUTO',
  CLAIMED: 'CLAIMED',
  VERIFIED: 'VERIFIED'
} as const

export type PageStatus = (typeof PageStatus)[keyof typeof PageStatus]

// --- OffreEmploi ---

export const OffreSource = {
  EMPLOI_TERRITORIAL: 'EMPLOI_TERRITORIAL',
  FRANCE_TRAVAIL: 'FRANCE_TRAVAIL',
  EMPLOI_PUBLIC: 'EMPLOI_PUBLIC',
  SITE_OFFICIEL: 'SITE_OFFICIEL'
} as const

export type OffreSource = (typeof OffreSource)[keyof typeof OffreSource]

export const OffreStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  REMOVED: 'REMOVED'
} as const

export type OffreStatus = (typeof OffreStatus)[keyof typeof OffreStatus]

// Repris de Wink : ContractTypeEnum
export const ContractType = {
  PERMANENT: 'PERMANENT',
  FIXED_TERM: 'FIXED_TERM',
  APPRENTICESHIP: 'APPRENTICESHIP',
  INTERNSHIP: 'INTERNSHIP',
  TEMPORARY: 'TEMPORARY',
  FREELANCE: 'FREELANCE',
  VOLUNTEER: 'VOLUNTEER',
  STUDENT_JOB: 'STUDENT_JOB',
  SEASONAL: 'SEASONAL',
  CASUAL: 'CASUAL'
} as const

export type ContractType = (typeof ContractType)[keyof typeof ContractType]

// Repris de Wink : WorkScheduleEnum
export const WorkSchedule = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME'
} as const

export type WorkSchedule = (typeof WorkSchedule)[keyof typeof WorkSchedule]

// Repris de Wink : RemoteEnum
export const Remote = {
  ON_SITE: 'ON_SITE',
  HYBRID: 'HYBRID',
  FULL_REMOTE: 'FULL_REMOTE'
} as const

export type Remote = (typeof Remote)[keyof typeof Remote]

// Repris de Wink : EmployerTypeEnum
export const EmployerType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
} as const

export type EmployerType = (typeof EmployerType)[keyof typeof EmployerType]

// Repris de Wink : ExperienceEnum
export const Experience = {
  EXP_0_TO_1_YEAR: 'EXP_0_TO_1_YEAR',
  EXP_1_TO_3_YEARS: 'EXP_1_TO_3_YEARS',
  EXP_3_TO_5_YEARS: 'EXP_3_TO_5_YEARS',
  EXP_5_TO_10_YEARS: 'EXP_5_TO_10_YEARS',
  EXP_MORE_THAN_10_YEARS: 'EXP_MORE_THAN_10_YEARS'
} as const

export type Experience = (typeof Experience)[keyof typeof Experience]

// FPT : Codes filières (repris de Wink connectors)
export const FiliereFPT = {
  ADMINISTRATIF: '1',
  CULTUREL: '2',
  TECHNIQUE: '4',
  ANIMATION: '5',
  DIVERS: '6',
  SAPEUR_POMPIER: '7',
  POLICE: '10',
  SPORTIF: '11',
  MULTIPLE: '12',
  MEDICO_SOCIAL: '14',
  EMPLOI_FONCTIONNEL_DIRECTION: '15'
} as const

export type FiliereFPT = (typeof FiliereFPT)[keyof typeof FiliereFPT]

// FPT : Catégories
export const CategorieFPT = {
  A: 'A',
  B: 'B',
  C: 'C'
} as const

export type CategorieFPT = (typeof CategorieFPT)[keyof typeof CategorieFPT]

// --- Contenu Page ---

export const ContenuStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  REVIEW: 'REVIEW',
  ARCHIVED: 'ARCHIVED'
} as const

export type ContenuStatus = (typeof ContenuStatus)[keyof typeof ContenuStatus]

// --- Branding ---

export const BrandingSource = {
  EXTRACTED: 'EXTRACTED',
  CLAIMED: 'CLAIMED',
  FALLBACK: 'FALLBACK'
} as const

export type BrandingSource = (typeof BrandingSource)[keyof typeof BrandingSource]

export const BrandingStatus = {
  DRAFT: 'DRAFT',
  VALIDATED: 'VALIDATED',
  PUBLISHED: 'PUBLISHED'
} as const

export type BrandingStatus = (typeof BrandingStatus)[keyof typeof BrandingStatus]

export const BrandingConfidence = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const

export type BrandingConfidence = (typeof BrandingConfidence)[keyof typeof BrandingConfidence]

export const BrandingBorderRadius = {
  NONE: 'none',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const

export type BrandingBorderRadius = (typeof BrandingBorderRadius)[keyof typeof BrandingBorderRadius]

// --- Data Sources ---

export const DataSource = {
  GEO_API: 'GEO_API',
  SERVICE_PUBLIC: 'SERVICE_PUBLIC',
  DATA_GOUV: 'DATA_GOUV',
  EMPLOI_TERRITORIAL: 'EMPLOI_TERRITORIAL',
  WIKIPEDIA: 'WIKIPEDIA',
  HUBSPOT_CRM: 'HUBSPOT_CRM'
} as const

export type DataSource = (typeof DataSource)[keyof typeof DataSource]

export const DataType = {
  CONTACT: 'CONTACT',
  BUDGET: 'BUDGET',
  EFFECTIFS: 'EFFECTIFS',
  DEMOGRAPHIE: 'DEMOGRAPHIE',
  BLASON: 'BLASON',
  DESCRIPTION: 'DESCRIPTION'
} as const

export type DataType = (typeof DataType)[keyof typeof DataType]

// --- Claim Request ---

export const ClaimStatus = {
  PENDING: 'PENDING',
  CONTACTED: 'CONTACTED',
  CONVERTED: 'CONVERTED',
  REJECTED: 'REJECTED'
} as const

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]

// --- Import Source ---

export const ImportStatus = {
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  PARTIAL: 'PARTIAL'
} as const

export type ImportStatus = (typeof ImportStatus)[keyof typeof ImportStatus]
