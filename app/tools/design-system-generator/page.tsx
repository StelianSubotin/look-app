"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Layers, Download, Sparkles, Check } from "lucide-react"
import { generateHarmoniousPalette, hexToHSL, hslToHex } from "@/lib/palette-generator"

interface DesignSystem {
  brand: {
    name: string
    industry: string
    description: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string[]
    success: string
    warning: string
    error: string
  }
  typography: {
    headingFont: string
    bodyFont: string
    scale: number[]
  }
  spacing: {
    base: number
    scale: number[]
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export default function DesignSystemGeneratorPage() {
  const router = useRouter()
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("")
  const [description, setDescription] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#3B82F6")
  const [generating, setGenerating] = useState(false)
  const [designSystem, setDesignSystem] = useState<DesignSystem | null>(null)

  const fontPairings = [
    { heading: "Inter", body: "Inter" },
    { heading: "Poppins", body: "Inter" },
    { heading: "Playfair Display", body: "Source Sans Pro" },
    { heading: "Montserrat", body: "Open Sans" },
    { heading: "Space Grotesk", body: "IBM Plex Sans" },
  ]

  const generateSystem = () => {
    if (!brandName || !industry) {
      alert("Please fill in brand name and industry")
      return
    }

    setGenerating(true)

    setTimeout(() => {
      // Generate harmonious color palette based on primary color
      const hsl = hexToHSL(primaryColor)
      
      // Secondary: Complementary
      const secondary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
      
      // Accent: Triadic
      const accent = hslToHex((hsl.h + 120) % 360, Math.max(hsl.s - 10, 50), Math.min(hsl.l + 10, 60))
      
      // Neutrals: Desaturated versions
      const neutrals = [
        hslToHex(hsl.h, 5, 95), // Very light
        hslToHex(hsl.h, 8, 85),
        hslToHex(hsl.h, 10, 70),
        hslToHex(hsl.h, 12, 50),
        hslToHex(hsl.h, 15, 30),
        hslToHex(hsl.h, 18, 15), // Very dark
      ]

      // Semantic colors
      const success = "#10B981" // Green
      const warning = "#F59E0B" // Amber
      const error = "#EF4444" // Red

      // Select font pairing based on industry
      let fontPair = fontPairings[0]
      if (industry.toLowerCase().includes("tech") || industry.toLowerCase().includes("software")) {
        fontPair = fontPairings[1]
      } else if (industry.toLowerCase().includes("fashion") || industry.toLowerCase().includes("luxury")) {
        fontPair = fontPairings[2]
      } else if (industry.toLowerCase().includes("finance") || industry.toLowerCase().includes("professional")) {
        fontPair = fontPairings[3]
      } else if (industry.toLowerCase().includes("creative") || industry.toLowerCase().includes("design")) {
        fontPair = fontPairings[4]
      }

      const system: DesignSystem = {
        brand: {
          name: brandName,
          industry,
          description
        },
        colors: {
          primary: primaryColor,
          secondary,
          accent,
          neutral: neutrals,
          success,
          warning,
          error
        },
        typography: {
          headingFont: fontPair.heading,
          bodyFont: fontPair.body,
          scale: [12, 14, 16, 20, 24, 32, 40, 48, 64]
        },
        spacing: {
          base: 8,
          scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
        },
        borderRadius: {
          sm: "4px",
          md: "8px",
          lg: "12px",
          xl: "16px"
        }
      }

      setDesignSystem(system)
      setGenerating(false)
    }, 2000)
  }

  const exportSystem = () => {
    if (!designSystem) return

    const content = `# ${designSystem.brand.name} Design System

## Brand
- **Name:** ${designSystem.brand.name}
- **Industry:** ${designSystem.brand.industry}
${designSystem.brand.description ? `- **Description:** ${designSystem.brand.description}` : ''}

## Colors

### Primary Colors
- **Primary:** ${designSystem.colors.primary}
- **Secondary:** ${designSystem.colors.secondary}
- **Accent:** ${designSystem.colors.accent}

### Neutral Colors
${designSystem.colors.neutral.map((c, i) => `- **Neutral ${i + 1}:** ${c}`).join('\n')}

### Semantic Colors
- **Success:** ${designSystem.colors.success}
- **Warning:** ${designSystem.colors.warning}
- **Error:** ${designSystem.colors.error}

## Typography
- **Heading Font:** ${designSystem.typography.headingFont}
- **Body Font:** ${designSystem.typography.bodyFont}
- **Type Scale:** ${designSystem.typography.scale.join('px, ')}px

## Spacing
- **Base Unit:** ${designSystem.spacing.base}px
- **Scale:** ${designSystem.spacing.scale.join('px, ')}px

## Border Radius
- **Small:** ${designSystem.borderRadius.sm}
- **Medium:** ${designSystem.borderRadius.md}
- **Large:** ${designSystem.borderRadius.lg}
- **Extra Large:** ${designSystem.borderRadius.xl}
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${brandName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-design-system.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-medium hover:text-primary transition-colors mb-4"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-3 mb-3">
            <Layers className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Design System Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Generate a complete design system for your brand
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side - Input */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>
                  Tell us about your brand to generate a custom design system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name *</Label>
                  <Input
                    id="brand-name"
                    placeholder="Acme Inc."
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    placeholder="Technology, Fashion, Finance..."
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your brand..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Brand Color</Label>
                  <div className="flex gap-3">
                    <Input
                      id="primary-color"
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                      placeholder="#3B82F6"
                      className="font-mono"
                    />
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value.toUpperCase())}
                      className="h-10 w-20 rounded border border-input cursor-pointer"
                    />
                  </div>
                </div>

                <Button
                  onClick={generateSystem}
                  disabled={generating || !brandName || !industry}
                  size="lg"
                  className="w-full gap-2"
                >
                  {generating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Generating System...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Design System
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Output */}
          <div className="lg:col-span-3">
            {designSystem ? (
              <div className="space-y-6">
                {/* Export Button */}
                <div className="flex justify-end">
                  <Button onClick={exportSystem} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export as Markdown
                  </Button>
                </div>

                {/* Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle>Color Palette</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Primary Colors */}
                    <div>
                      <h4 className="font-semibold mb-3">Primary Colors</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Primary', color: designSystem.colors.primary },
                          { label: 'Secondary', color: designSystem.colors.secondary },
                          { label: 'Accent', color: designSystem.colors.accent }
                        ].map((item) => (
                          <div key={item.label}>
                            <div
                              className="h-20 rounded-lg mb-2 border"
                              style={{ backgroundColor: item.color }}
                            />
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground font-mono">{item.color}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Neutrals */}
                    <div>
                      <h4 className="font-semibold mb-3">Neutral Colors</h4>
                      <div className="grid grid-cols-6 gap-3">
                        {designSystem.colors.neutral.map((color, i) => (
                          <div key={i}>
                            <div
                              className="h-16 rounded-lg mb-2 border"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-xs text-muted-foreground font-mono">{color}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Semantic */}
                    <div>
                      <h4 className="font-semibold mb-3">Semantic Colors</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Success', color: designSystem.colors.success },
                          { label: 'Warning', color: designSystem.colors.warning },
                          { label: 'Error', color: designSystem.colors.error }
                        ].map((item) => (
                          <div key={item.label}>
                            <div
                              className="h-16 rounded-lg mb-2 border"
                              style={{ backgroundColor: item.color }}
                            />
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground font-mono">{item.color}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Typography */}
                <Card>
                  <CardHeader>
                    <CardTitle>Typography</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Heading Font</p>
                      <p className="text-3xl font-bold" style={{ fontFamily: designSystem.typography.headingFont }}>
                        {designSystem.typography.headingFont}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Body Font</p>
                      <p className="text-lg" style={{ fontFamily: designSystem.typography.bodyFont }}>
                        {designSystem.typography.bodyFont}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Type Scale</p>
                      <div className="flex flex-wrap gap-2">
                        {designSystem.typography.scale.map((size) => (
                          <span key={size} className="px-3 py-1 bg-muted rounded text-sm font-mono">
                            {size}px
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Spacing & Radius */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Spacing Scale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {designSystem.spacing.scale.map((space) => (
                          <div key={space} className="flex items-center gap-3">
                            <div
                              className="bg-primary h-6 rounded"
                              style={{ width: `${space}px` }}
                            />
                            <span className="text-sm font-mono">{space}px</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Border Radius</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(designSystem.borderRadius).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3">
                            <div
                              className="w-16 h-16 bg-primary"
                              style={{ borderRadius: value }}
                            />
                            <div>
                              <p className="text-sm font-medium capitalize">{key}</p>
                              <p className="text-xs text-muted-foreground">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No design system yet</h3>
                  <p className="text-muted-foreground">
                    Fill in your brand information and click &quot;Generate Design System&quot; to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

