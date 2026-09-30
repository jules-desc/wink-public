import type { Ref } from 'vue'
import type { ResolvedBranding } from '~/types/api'
import { generateColorScale } from '~/utils/color-shades'

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const RADIUS_MAP: Record<string, string> = {
  none: '0',
  small: '0.25rem',
  medium: '0.5rem',
  large: '0.75rem'
}

export function useCollectiviteBranding(branding: Ref<ResolvedBranding | null>) {
  const brandingStyles = computed(() => {
    const b = branding.value
    if (!b || b.source === 'default') return ''

    const lines: string[] = []

    if (b.primaryColor) {
      const scale = generateColorScale(b.primaryColor)
      for (const shade of SHADES) {
        lines.push(`--ui-color-primary-${shade}: ${hexToOklchCss(scale[shade])};`)
      }
    }

    if (b.secondaryColor) {
      const scale = generateColorScale(b.secondaryColor)
      for (const shade of SHADES) {
        lines.push(`--ui-color-secondary-${shade}: ${hexToOklchCss(scale[shade])};`)
      }
    }

    if (b.accentColor) {
      const scale = generateColorScale(b.accentColor)
      for (const shade of SHADES) {
        lines.push(`--ui-color-accent-${shade}: ${hexToOklchCss(scale[shade])};`)
      }
    }

    if (b.bodyFont) {
      lines.push(`--font-sans: '${b.bodyFont}', 'Inter', sans-serif;`)
    }
    if (b.headingFont) {
      lines.push(`--font-heading: '${b.headingFont}', 'Inter', sans-serif;`)
    }

    if (b.borderRadius && RADIUS_MAP[b.borderRadius]) {
      lines.push(`--ui-radius: ${RADIUS_MAP[b.borderRadius]};`)
    }

    if (!lines.length) return ''
    return `:root { ${lines.join(' ')} }`
  })

  const fontLinks = computed(() => {
    const b = branding.value
    if (!b) return []

    const families: string[] = []
    if (b.headingFont) families.push(`family=${encodeURIComponent(b.headingFont)}:wght@400;600;700`)
    if (b.bodyFont && b.bodyFont !== b.headingFont) {
      families.push(`family=${encodeURIComponent(b.bodyFont)}:wght@400;600`)
    }

    if (!families.length) return []

    return [{
      rel: 'stylesheet' as const,
      href: `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
    }]
  })

  useHead({
    style: () => brandingStyles.value
      ? [{ innerHTML: brandingStyles.value, id: 'collectivite-branding', tagPriority: 10 }]
      : [],
    link: fontLinks
  })
}

function hexToOklchCss(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255

  const lr = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const lg = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const lb = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb

  const l = Math.cbrt(l_)
  const m = Math.cbrt(m_)
  const s = Math.cbrt(s_)

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const bk = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  const C = Math.sqrt(a * a + bk * bk)
  const H = Math.atan2(bk, a) * (180 / Math.PI)

  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(4)} ${(H < 0 ? H + 360 : H).toFixed(1)})`
}
