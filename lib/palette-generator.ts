// Palette generation utilities

/**
 * Generate a random color in hex format
 */
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

/**
 * Convert hex to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360
  s = s / 100
  l = l / 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

/**
 * Adjust color lightness
 */
export function adjustLightness(hex: string, amount: number): string {
  const hsl = hexToHSL(hex)
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount))
  return hslToHex(hsl.h, hsl.s, hsl.l)
}

/**
 * Adjust color saturation
 */
export function adjustSaturation(hex: string, amount: number): string {
  const hsl = hexToHSL(hex)
  hsl.s = Math.max(0, Math.min(100, hsl.s + amount))
  return hslToHex(hsl.h, hsl.s, hsl.l)
}

/**
 * Adjust color hue
 */
export function adjustHue(hex: string, amount: number): string {
  const hsl = hexToHSL(hex)
  hsl.h = (hsl.h + amount + 360) % 360
  return hslToHex(hsl.h, hsl.s, hsl.l)
}

/**
 * Generate complementary color
 */
export function getComplementary(hex: string): string {
  const hsl = hexToHSL(hex)
  return hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
}

/**
 * Generate analogous colors
 */
export function getAnalogous(hex: string): string[] {
  const hsl = hexToHSL(hex)
  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hex,
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
  ]
}

/**
 * Generate triadic colors
 */
export function getTriadic(hex: string): string[] {
  const hsl = hexToHSL(hex)
  return [
    hex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
  ]
}

/**
 * Check if color is light or dark
 */
export function isLightColor(hex: string): boolean {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return true

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  // Using relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

/**
 * Generate a harmonious palette
 */
export function generateHarmoniousPalette(count: number = 5): string[] {
  const baseHue = Math.floor(Math.random() * 360)
  const palette: string[] = []

  for (let i = 0; i < count; i++) {
    const hue = (baseHue + (i * 360) / count) % 360
    const saturation = 60 + Math.random() * 30 // 60-90%
    const lightness = 45 + Math.random() * 30 // 45-75%
    palette.push(hslToHex(hue, saturation, lightness))
  }

  return palette
}

/**
 * Generate a random palette
 */
export function generateRandomPalette(count: number = 5): string[] {
  const palette: string[] = []
  for (let i = 0; i < count; i++) {
    palette.push(generateRandomColor())
  }
  return palette
}

/**
 * Format palette as CSS
 */
export function exportAsCSS(colors: string[], names?: string[]): string {
  let css = ':root {\n'
  colors.forEach((color, index) => {
    const name = names?.[index] || `color-${index + 1}`
    css += `  --${name}: ${color};\n`
  })
  css += '}'
  return css
}

/**
 * Format palette as array
 */
export function exportAsArray(colors: string[]): string {
  return JSON.stringify(colors, null, 2)
}

/**
 * Generate URL with palette
 */
export function exportAsURL(colors: string[]): string {
  const colorString = colors.map(c => c.replace('#', '')).join('-')
  return `${window.location.origin}/tools/palette-generator?colors=${colorString}`
}

