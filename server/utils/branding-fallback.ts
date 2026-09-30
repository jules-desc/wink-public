import type { Collectivite, CollectiviteBranding } from '@prisma/client'

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

const TYPE_PALETTES: Record<string, { primary: string; secondary: string }> = {
  COMMUNE: { primary: '#1E40AF', secondary: '#3B82F6' },
  EPCI: { primary: '#0E7490', secondary: '#06B6D4' },
  DEPARTEMENT: { primary: '#7C3AED', secondary: '#8B5CF6' },
  REGION: { primary: '#059669', secondary: '#10B981' },
  CDG: { primary: '#4338CA', secondary: '#6366F1' },
  SYNDICAT_MIXTE: { primary: '#0369A1', secondary: '#0284C7' }
}

const REGION_ACCENTS: Record<string, string> = {
  '84': '#E11D48',
  '27': '#D97706',
  '53': '#0891B2',
  '24': '#7C3AED',
  '94': '#DC2626',
  '44': '#2563EB',
  '32': '#059669',
  '11': '#1D4ED8',
  '28': '#DB2777',
  '75': '#B91C1C',
  '76': '#C2410C',
  '52': '#EA580C',
  '93': '#2563EB',
  '01': '#0D9488',
  '02': '#16A34A',
  '03': '#059669',
  '04': '#0EA5E9',
  '06': '#7C3AED'
}

const WINK_DEFAULT: ResolvedBranding = {
  primaryColor: '#2563EB',
  secondaryColor: null,
  accentColor: null,
  backgroundColor: null,
  textColor: null,
  headingFont: null,
  bodyFont: null,
  logoMainUrl: null,
  logoIconUrl: null,
  borderRadius: null,
  source: 'default'
}

type CollectiviteWithBranding = Collectivite & {
  branding?: CollectiviteBranding | null
}

export function resolveBranding(collectivite: CollectiviteWithBranding): ResolvedBranding {
  const branding = collectivite.branding

  // Level 0: Published CollectiviteBranding
  if (branding && branding.status === 'PUBLISHED') {
    const typoConfig = branding.typographyConfig as Record<string, unknown> | null
    const headingMeta = typoConfig?.heading as Record<string, unknown> | undefined
    const bodyMeta = typoConfig?.body as Record<string, unknown> | undefined

    return {
      primaryColor: branding.primaryColor || resolveFromLegacy(collectivite) || resolveFromFallback(collectivite) || WINK_DEFAULT.primaryColor,
      secondaryColor: branding.secondaryColor || null,
      accentColor: branding.accentColor || null,
      backgroundColor: branding.backgroundColor || null,
      textColor: branding.textColor || null,
      headingFont: resolveFont(branding.headingFont, headingMeta),
      bodyFont: resolveFont(branding.bodyFont, bodyMeta),
      logoMainUrl: branding.logoMainUrl || collectivite.logoUrl || null,
      logoIconUrl: branding.logoIconUrl || null,
      borderRadius: branding.borderRadius || null,
      source: 'branding'
    }
  }

  // Level 1: Legacy fields on Collectivite
  if (collectivite.primaryColor) {
    return {
      ...WINK_DEFAULT,
      primaryColor: collectivite.primaryColor,
      logoMainUrl: collectivite.logoUrl || null,
      source: 'legacy'
    }
  }

  // Level 2: Fallback by type + region accent
  const typePalette = TYPE_PALETTES[collectivite.type]
  if (typePalette) {
    const regionAccent = collectivite.regionCode
      ? REGION_ACCENTS[collectivite.regionCode] || null
      : null

    return {
      ...WINK_DEFAULT,
      primaryColor: typePalette.primary,
      secondaryColor: typePalette.secondary,
      accentColor: regionAccent,
      logoMainUrl: collectivite.logoUrl || null,
      source: 'fallback'
    }
  }

  // Level 3: Wink neutral default
  return {
    ...WINK_DEFAULT,
    logoMainUrl: collectivite.logoUrl || null
  }
}

function resolveFont(
  fontField: string | null,
  meta: Record<string, unknown> | undefined
): string | null {
  if (!fontField) return null
  if (meta?.isCommercial && meta?.libreFallback) {
    return meta.libreFallback as string
  }
  return fontField
}

function resolveFromLegacy(collectivite: CollectiviteWithBranding): string | null {
  return collectivite.primaryColor || null
}

function resolveFromFallback(collectivite: CollectiviteWithBranding): string | null {
  return TYPE_PALETTES[collectivite.type]?.primary || null
}
