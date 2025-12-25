"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Palette, Search, Sparkles } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { hexToHSL } from "@/lib/contrast-checker"
import type { User } from "@supabase/supabase-js"

interface Component {
  id: string
  name: string
  image_url: string
  category?: string
  platform?: string
  access_level?: "free" | "paid"
}

export default function StyleMatcherPage() {
  const router = useRouter()
  const [brandColor, setBrandColor] = useState("#3B82F6")
  const [brandColorInput, setBrandColorInput] = useState("#3B82F6")
  const [components, setComponents] = useState<Component[]>([])
  const [matchedComponents, setMatchedComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      const isAdmin = user?.user_metadata?.is_admin === true || 
                     user?.email?.toLowerCase() === "stelsubotin@gmail.com"
      const plan = isAdmin ? "paid" : (user?.user_metadata?.plan || "free")
      setUserPlan(plan as "free" | "paid")
    })
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      const response = await fetch('/api/components')
      if (response.ok) {
        const data = await response.json()
        setComponents(data)
      }
    } catch (error) {
      console.error("Failed to fetch components:", error)
    }
  }

  // Color similarity algorithm
  const getColorSimilarity = (color1: string, color2: string): number => {
    const hsl1 = hexToHSL(color1)
    const hsl2 = hexToHSL(color2)

    // Calculate hue difference (circular distance)
    let hueDiff = Math.abs(hsl1.h - hsl2.h)
    if (hueDiff > 180) hueDiff = 360 - hueDiff
    
    // Calculate saturation and lightness differences
    const satDiff = Math.abs(hsl1.s - hsl2.s)
    const lightDiff = Math.abs(hsl1.l - hsl2.l)

    // Weighted similarity score (0-100)
    const hueScore = (180 - hueDiff) / 180 * 100
    const satScore = (100 - satDiff) / 100 * 100
    const lightScore = (100 - lightDiff) / 100 * 100

    // Hue is most important, then saturation, then lightness
    return (hueScore * 0.5) + (satScore * 0.3) + (lightScore * 0.2)
  }

  const findMatches = () => {
    setLoading(true)
    
    // For demo: simulate analyzing component images
    // In production, you'd extract dominant colors from images
    setTimeout(() => {
      const scored = components.map(component => ({
        ...component,
        // Simulate color extraction - in reality, you'd analyze the image
        // For now, generate pseudo-random but consistent scores
        score: getColorSimilarity(brandColor, generatePseudoColor(component.id))
      }))

      // Sort by similarity and take top matches (score > 60)
      const matches = scored
        .filter(c => c.score > 60)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12)

      setMatchedComponents(matches)
      setLoading(false)
    }, 800)
  }

  // Generate consistent pseudo-color for demo (replace with actual image analysis)
  const generatePseudoColor = (id: string): string => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hue = hash % 360
    return `hsl(${hue}, 70%, 50%)`
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
            <Palette className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Style Matcher</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Find components that match your brand colors
          </p>
        </div>

        {/* Color Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Brand Color</CardTitle>
            <CardDescription>
              Enter your primary brand color to find matching components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 max-w-md">
                <Label htmlFor="brand-color">Brand Color</Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="brand-color"
                    type="text"
                    value={brandColorInput}
                    onChange={(e) => {
                      setBrandColorInput(e.target.value.toUpperCase())
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        setBrandColor(e.target.value.toUpperCase())
                      }
                    }}
                    placeholder="#3B82F6"
                    className="font-mono"
                  />
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => {
                      setBrandColor(e.target.value.toUpperCase())
                      setBrandColorInput(e.target.value.toUpperCase())
                    }}
                    className="h-10 w-20 rounded border border-input cursor-pointer"
                  />
                </div>
              </div>
              <Button 
                onClick={findMatches}
                disabled={loading}
                size="lg"
                className="gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Find Matching Components
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {matchedComponents.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Matching Components</h2>
                <p className="text-muted-foreground">
                  Found {matchedComponents.length} components that match your brand color
                </p>
              </div>
              <div 
                className="px-4 py-2 rounded-lg font-semibold"
                style={{ backgroundColor: brandColor, color: '#fff' }}
              >
                {brandColor}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedComponents.map((component) => (
                <Card
                  key={component.id}
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => router.push(`/browse/components`)}
                >
                  <div className="relative aspect-video bg-muted">
                    <Image
                      src={component.image_url}
                      alt={component.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={75}
                    />
                    {component.access_level === "paid" && userPlan === "free" && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                        PRO
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {Math.round((component as any).score)}% Match
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {component.name}
                    </h3>
                    {component.category && (
                      <span className="text-xs text-muted-foreground">
                        {component.category}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : !loading && (
          <div className="text-center py-20">
            <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground">
              Enter your brand color above and click &quot;Find Matching Components&quot; to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

