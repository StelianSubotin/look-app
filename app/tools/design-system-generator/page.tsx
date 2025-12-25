"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layers, Download, Sparkles, Check, Copy, Code, FileJson, Palette } from "lucide-react"
import { generateHarmoniousPalette, hexToHSL, hslToHex } from "@/lib/palette-generator"
import { 
  generateTailwindConfig, 
  generateShadcnCSS, 
  generateDesignTokens, 
  generateReactTheme,
  generateInstructions,
  getRequiredDependencies
} from "@/lib/design-system-export"

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
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = (format: string) => {
    if (!designSystem) return

    const brandSlug = brandName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    
    switch(format) {
      case 'tailwind':
        downloadFile(
          generateTailwindConfig(designSystem), 
          `tailwind.config.js`, 
          'text/javascript'
        )
        break
      case 'shadcn':
        downloadFile(
          generateShadcnCSS(designSystem), 
          `globals.css`, 
          'text/css'
        )
        break
      case 'tokens':
        downloadFile(
          generateDesignTokens(designSystem), 
          `${brandSlug}-tokens.json`, 
          'application/json'
        )
        break
      case 'react':
        downloadFile(
          generateReactTheme(designSystem), 
          `theme.ts`, 
          'text/typescript'
        )
        break
    }
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
              <Card className="overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="border-b">
                    <div className="flex items-center justify-between px-6 pt-4">
                      <TabsList className="h-9">
                        <TabsTrigger value="preview" className="gap-2">
                          <Palette className="h-3.5 w-3.5" />
                          Preview
                        </TabsTrigger>
                        <TabsTrigger value="tailwind" className="gap-2">
                          <Code className="h-3.5 w-3.5" />
                          Tailwind
                        </TabsTrigger>
                        <TabsTrigger value="shadcn" className="gap-2">
                          <Code className="h-3.5 w-3.5" />
                          shadcn/ui
                        </TabsTrigger>
                        <TabsTrigger value="tokens" className="gap-2">
                          <FileJson className="h-3.5 w-3.5" />
                          Tokens
                        </TabsTrigger>
                        <TabsTrigger value="react" className="gap-2">
                          <Code className="h-3.5 w-3.5" />
                          React
                        </TabsTrigger>
                      </TabsList>
                      {activeTab !== "preview" && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const content = activeTab === 'tailwind' ? generateTailwindConfig(designSystem) :
                                            activeTab === 'shadcn' ? generateShadcnCSS(designSystem) :
                                            activeTab === 'tokens' ? generateDesignTokens(designSystem) :
                                            activeTab === 'react' ? generateReactTheme(designSystem) : ''
                              copyToClipboard(content)
                            }}
                            className="gap-2"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleExport(activeTab)}
                            className="gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Tab */}
                  <TabsContent value="preview" className="m-0 p-6">
                    <div className="space-y-6">
                      {/* Live Component Preview */}
                      <Card className="bg-muted/30">
                        <CardHeader>
                          <CardTitle className="text-lg">Live Component Preview</CardTitle>
                          <CardDescription>See your design system in action</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Button Preview */}
                          <div>
                            <p className="text-sm font-medium mb-3">Buttons</p>
                            <div className="flex flex-wrap gap-3">
                              <button
                                style={{ 
                                  backgroundColor: designSystem.colors.primary,
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: designSystem.borderRadius.md,
                                  fontFamily: designSystem.typography.bodyFont,
                                  fontSize: designSystem.typography.scale[2] + 'px'
                                }}
                              >
                                Primary Button
                              </button>
                              <button
                                style={{ 
                                  backgroundColor: designSystem.colors.secondary,
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: designSystem.borderRadius.md,
                                  fontFamily: designSystem.typography.bodyFont,
                                  fontSize: designSystem.typography.scale[2] + 'px'
                                }}
                              >
                                Secondary
                              </button>
                              <button
                                style={{ 
                                  backgroundColor: designSystem.colors.accent,
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: designSystem.borderRadius.md,
                                  fontFamily: designSystem.typography.bodyFont,
                                  fontSize: designSystem.typography.scale[2] + 'px'
                                }}
                              >
                                Accent
                              </button>
                            </div>
                          </div>

                          {/* Card Preview */}
                          <div>
                            <p className="text-sm font-medium mb-3">Card</p>
                            <div 
                              style={{
                                backgroundColor: designSystem.colors.neutral[0],
                                border: `1px solid ${designSystem.colors.neutral[2]}`,
                                borderRadius: designSystem.borderRadius.lg,
                                padding: designSystem.spacing.scale[5] + 'px'
                              }}
                            >
                              <h3 
                                style={{
                                  fontFamily: designSystem.typography.headingFont,
                                  fontSize: designSystem.typography.scale[4] + 'px',
                                  marginBottom: designSystem.spacing.scale[2] + 'px',
                                  color: designSystem.colors.neutral[5]
                                }}
                              >
                                Card Title
                              </h3>
                              <p 
                                style={{
                                  fontFamily: designSystem.typography.bodyFont,
                                  fontSize: designSystem.typography.scale[2] + 'px',
                                  color: designSystem.colors.neutral[4],
                                  marginBottom: designSystem.spacing.scale[4] + 'px'
                                }}
                              >
                                This is a preview of how a card component would look with your brand&apos;s design system applied.
                              </p>
                              <button
                                style={{ 
                                  backgroundColor: designSystem.colors.primary,
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: designSystem.borderRadius.sm,
                                  fontFamily: designSystem.typography.bodyFont,
                                  fontSize: designSystem.typography.scale[1] + 'px'
                                }}
                              >
                                Learn More
                              </button>
                            </div>
                          </div>

                          {/* Alert Badges */}
                          <div>
                            <p className="text-sm font-medium mb-3">Alerts & Badges</p>
                            <div className="flex flex-wrap gap-3">
                              {[
                                { label: 'Success', color: designSystem.colors.success },
                                { label: 'Warning', color: designSystem.colors.warning },
                                { label: 'Error', color: designSystem.colors.error }
                              ].map((item) => (
                                <div
                                  key={item.label}
                                  style={{
                                    backgroundColor: item.color + '15',
                                    color: item.color,
                                    padding: '4px 12px',
                                    borderRadius: designSystem.borderRadius.sm,
                                    fontSize: designSystem.typography.scale[1] + 'px',
                                    fontFamily: designSystem.typography.bodyFont,
                                    border: `1px solid ${item.color}40`
                                  }}
                                >
                                  {item.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

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
                  </TabsContent>

                  {/* Tailwind Config Tab */}
                  <TabsContent value="tailwind" className="m-0">
                    <div className="grid md:grid-cols-2 h-[calc(100vh-280px)]">
                      <div className="border-r">
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">Installation Instructions</h3>
                          <p className="text-sm text-muted-foreground">Follow these steps to use your Tailwind config</p>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-360px)] prose prose-sm dark:prose-invert">
                          <div dangerouslySetInnerHTML={{ 
                            __html: generateInstructions('tailwind', brandName)
                              .replace(/```bash\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/```css\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/```jsx\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
                              .replace(/### /g, '<h3 class="text-base font-semibold mt-4 mb-2">')
                              .replace(/## /g, '</h3><h2 class="text-lg font-bold mt-6 mb-3">')
                              .replace(/# /g, '</h2><h1 class="text-xl font-bold mb-4">')
                              .replace(/\n\n/g, '</p><p class="mb-3">')
                              .replace(/^([^<])/gm, '<p class="mb-3">$1')
                          }} />
                        </div>
                      </div>
                      <div>
                        <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold mb-1">tailwind.config.js</h3>
                            <p className="text-sm text-muted-foreground">Your custom Tailwind configuration</p>
                          </div>
                        </div>
                        <div className="relative">
                          <pre className="p-6 overflow-x-auto max-h-[calc(100vh-360px)] overflow-y-auto text-xs bg-slate-950 text-slate-50 dark:bg-slate-900">
                            <code>{generateTailwindConfig(designSystem)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* shadcn/ui CSS Tab */}
                  <TabsContent value="shadcn" className="m-0">
                    <div className="grid md:grid-cols-2 h-[calc(100vh-280px)]">
                      <div className="border-r">
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">Installation Instructions</h3>
                          <p className="text-sm text-muted-foreground">Follow these steps to use shadcn/ui with your brand</p>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-360px)] prose prose-sm dark:prose-invert">
                          <div dangerouslySetInnerHTML={{ 
                            __html: generateInstructions('shadcn', brandName)
                              .replace(/```bash\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/```css\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/```jsx\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
                              .replace(/### /g, '<h3 class="text-base font-semibold mt-4 mb-2">')
                              .replace(/## /g, '</h3><h2 class="text-lg font-bold mt-6 mb-3">')
                              .replace(/# /g, '</h2><h1 class="text-xl font-bold mb-4">')
                              .replace(/\n\n/g, '</p><p class="mb-3">')
                              .replace(/^([^<])/gm, '<p class="mb-3">$1')
                          }} />
                        </div>
                      </div>
                      <div>
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">globals.css</h3>
                          <p className="text-sm text-muted-foreground">CSS variables for shadcn/ui</p>
                        </div>
                        <div className="relative">
                          <pre className="p-6 overflow-x-auto max-h-[calc(100vh-360px)] overflow-y-auto text-xs bg-slate-950 text-slate-50 dark:bg-slate-900">
                            <code>{generateShadcnCSS(designSystem)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Design Tokens Tab */}
                  <TabsContent value="tokens" className="m-0">
                    <div className="grid md:grid-cols-2 h-[calc(100vh-280px)]">
                      <div className="border-r">
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">Installation Instructions</h3>
                          <p className="text-sm text-muted-foreground">How to use design tokens</p>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-360px)] prose prose-sm dark:prose-invert">
                          <div dangerouslySetInnerHTML={{ 
                            __html: generateInstructions('tokens', brandName)
                              .replace(/```bash\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/```js\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
                              .replace(/### /g, '<h3 class="text-base font-semibold mt-4 mb-2">')
                              .replace(/## /g, '</h3><h2 class="text-lg font-bold mt-6 mb-3">')
                              .replace(/# /g, '</h2><h1 class="text-xl font-bold mb-4">')
                              .replace(/\n\n/g, '</p><p class="mb-3">')
                              .replace(/^([^<])/gm, '<p class="mb-3">$1')
                          }} />
                        </div>
                      </div>
                      <div>
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">tokens.json</h3>
                          <p className="text-sm text-muted-foreground">Design tokens in JSON format</p>
                        </div>
                        <div className="relative">
                          <pre className="p-6 overflow-x-auto max-h-[calc(100vh-360px)] overflow-y-auto text-xs bg-slate-950 text-slate-50 dark:bg-slate-900">
                            <code>{generateDesignTokens(designSystem)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* React Theme Tab */}
                  <TabsContent value="react" className="m-0">
                    <div className="grid md:grid-cols-2 h-[calc(100vh-280px)]">
                      <div className="border-r">
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">Installation Instructions</h3>
                          <p className="text-sm text-muted-foreground">How to use the React theme</p>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(100vh-360px)] prose prose-sm dark:prose-invert">
                          <div dangerouslySetInnerHTML={{ 
                            __html: generateInstructions('react', brandName)
                              .replace(/```tsx\n([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
                              .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
                              .replace(/### /g, '<h3 class="text-base font-semibold mt-4 mb-2">')
                              .replace(/## /g, '</h3><h2 class="text-lg font-bold mt-6 mb-3">')
                              .replace(/# /g, '</h2><h1 class="text-xl font-bold mb-4">')
                              .replace(/\n\n/g, '</p><p class="mb-3">')
                              .replace(/^([^<])/gm, '<p class="mb-3">$1')
                          }} />
                        </div>
                      </div>
                      <div>
                        <div className="p-6 border-b bg-muted/30">
                          <h3 className="font-semibold mb-1">theme.ts</h3>
                          <p className="text-sm text-muted-foreground">React theme object</p>
                        </div>
                        <div className="relative">
                          <pre className="p-6 overflow-x-auto max-h-[calc(100vh-360px)] overflow-y-auto text-xs bg-slate-950 text-slate-50 dark:bg-slate-900">
                            <code>{generateReactTheme(designSystem)}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
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

