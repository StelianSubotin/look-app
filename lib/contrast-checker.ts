// WCAG 2.0 Contrast Ratio Calculation
// Based on: https://www.w3.org/TR/WCAG20-TECHS/G17.html

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Calculate relative luminance for a color
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return 1

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Format contrast ratio as string (e.g., "4.5:1")
 */
export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`
}

/**
 * Check WCAG compliance levels
 */
export interface WCAGCompliance {
  AA: {
    normal: boolean
    large: boolean
  }
  AAA: {
    normal: boolean
    large: boolean
  }
}

export function checkWCAGCompliance(ratio: number): WCAGCompliance {
  return {
    AA: {
      normal: ratio >= 4.5,
      large: ratio >= 3,
    },
    AAA: {
      normal: ratio >= 7,
      large: ratio >= 4.5,
    },
  }
}

/**
 * Get overall compliance grade
 */
export function getComplianceGrade(ratio: number): 'AAA' | 'AA' | 'FAIL' {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'FAIL'
}

/**
 * Validate hex color
 */
export function isValidHex(hex: string): boolean {
  return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(hex)
}

/**
 * Ensure hex color has # prefix
 */
export function normalizeHex(hex: string): string {
  return hex.startsWith('#') ? hex : `#${hex}`
}

