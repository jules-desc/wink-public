import { z } from 'zod'

const hexColor = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Couleur hex invalide')

export const brandingUpsertSchema = z.object({
  primaryColor: hexColor.nullable().optional(),
  secondaryColor: hexColor.nullable().optional(),
  accentColor: hexColor.nullable().optional(),
  backgroundColor: hexColor.nullable().optional(),
  textColor: hexColor.nullable().optional(),

  headingFont: z.string().max(100).nullable().optional(),
  bodyFont: z.string().max(100).nullable().optional(),

  logoMainUrl: z.string().url().nullable().optional(),
  logoIconUrl: z.string().url().nullable().optional(),

  borderRadius: z.enum(['none', 'small', 'medium', 'large']).nullable().optional(),

  colorsConfig: z.record(z.unknown()).optional(),
  logosConfig: z.record(z.unknown()).optional(),
  typographyConfig: z.record(z.unknown()).optional(),
  visualsConfig: z.record(z.unknown()).optional(),

  source: z.enum(['EXTRACTED', 'CLAIMED', 'FALLBACK']).optional(),
  status: z.enum(['DRAFT', 'VALIDATED', 'PUBLISHED']).optional(),
  extractedFrom: z.string().url().nullable().optional(),
  extractedBy: z.string().max(200).nullable().optional(),
  confidenceScore: z.enum(['high', 'medium', 'low']).nullable().optional(),
  notes: z.string().nullable().optional()
})

export type BrandingUpsertPayload = z.infer<typeof brandingUpsertSchema>

export const brandingBulkImportSchema = z.object({
  items: z.array(z.object({
    slug: z.string().min(1),
    branding: brandingUpsertSchema
  })).min(1).max(100)
})

export type BrandingBulkImportPayload = z.infer<typeof brandingBulkImportSchema>
