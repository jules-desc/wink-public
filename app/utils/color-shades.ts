const SHADE_LIGHTNESS: Record<number, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.78,
  400: 0.66,
  500: 0.55,
  600: 0.47,
  700: 0.39,
  800: 0.32,
  900: 0.25,
  950: 0.17
}

export function generateColorScale(hex: string): Record<number, string> {
  const [r, g, b] = hexToRgb(hex)
  const [, c, h] = rgbToOklch(r, g, b)

  const scale: Record<number, string> = {}
  for (const [shade, targetL] of Object.entries(SHADE_LIGHTNESS)) {
    const chromaScale = Math.min(c, targetL < 0.3 ? c * 0.8 : targetL > 0.85 ? c * 0.5 : c)
    const [sr, sg, sb] = oklchToRgb(targetL, chromaScale, h)
    scale[Number(shade)] = rgbToHex(sr, sg, sb)
  }

  return scale
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3
    ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
    : h
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(1, v))
  const toHex = (v: number) => Math.round(clamp(v) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

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

  return [L, C, H < 0 ? H + 360 : H]
}

function oklchToRgb(L: number, C: number, H: number): [number, number, number] {
  const hRad = (H * Math.PI) / 180
  const a = C * Math.cos(hRad)
  const bk = C * Math.sin(hRad)

  const l = L + 0.3963377774 * a + 0.2158037573 * bk
  const m = L - 0.1055613458 * a - 0.0638541728 * bk
  const s = L - 0.0894841775 * a - 1.2914855480 * bk

  const l_ = l * l * l
  const m_ = m * m * m
  const s_ = s * s * s

  const r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_

  return [linearToSrgb(r), linearToSrgb(g), linearToSrgb(b)]
}
