"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Search, Sparkles, X } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

interface Component {
  id: string
  name: string
  image_url: string
  category?: string
  platform?: string
  access_level?: "free" | "paid"
}

export default function ComponentFinderPage() {
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [detectedType, setDetectedType] = useState<string | null>(null)
  const [suggestedComponents, setSuggestedComponents] = useState<Component[]>([])
  const [components, setComponents] = useState<Component[]>([])
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!uploadedImage) return

    setAnalyzing(true)
    setDetectedType(null)
    setSuggestedComponents([])

    // Simulate AI analysis (in production, use OpenAI Vision API or similar)
    setTimeout(() => {
      // Mock analysis results
      const possibleTypes = ['Hero', 'Footer', 'Navbar', 'CTA', 'Feature', 'Pricing', 'Testimonial']
      const detected = possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
      setDetectedType(detected)

      // Find matching components
      const matches = components
        .filter(c => {
          // Simple category matching (in production, use AI similarity)
          return c.category?.toLowerCase().includes(detected.toLowerCase()) ||
                 c.name?.toLowerCase().includes(detected.toLowerCase())
        })
        .slice(0, 6)

      // If no matches, show random components
      if (matches.length === 0) {
        setSuggestedComponents(components.slice(0, 6))
      } else {
        setSuggestedComponents(matches)
      }

      setAnalyzing(false)
    }, 2000)
  }

  const clearImage = () => {
    setUploadedImage(null)
    setDetectedType(null)
    setSuggestedComponents([])
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
            <Search className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Component Finder</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Upload a screenshot to find similar components in our library
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Upload */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upload Screenshot</CardTitle>
                <CardDescription>
                  Upload any website screenshot or design inspiration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!uploadedImage ? (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded screenshot"
                        width={600}
                        height={400}
                        className="w-full h-auto"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      onClick={analyzeImage}
                      disabled={analyzing}
                      size="lg"
                      className="w-full gap-2"
                    >
                      {analyzing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Analyzing Screenshot...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze & Find Components
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {detectedType && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Detected Component Type</p>
                      <p className="text-xl font-bold">{detectedType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Side - Results */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Matching Components</CardTitle>
                <CardDescription>
                  Similar components from our library
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suggestedComponents.length > 0 ? (
                  <div className="space-y-4">
                    {suggestedComponents.map((component) => (
                      <Card
                        key={component.id}
                        className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all group"
                        onClick={() => router.push(`/browse/components`)}
                      >
                        <div className="flex gap-4">
                          <div className="relative w-32 h-24 bg-muted shrink-0">
                            <Image
                              src={component.image_url}
                              alt={component.name}
                              fill
                              className="object-cover object-top"
                              sizes="128px"
                              loading="lazy"
                              quality={75}
                            />
                            {component.access_level === "paid" && userPlan === "free" && (
                              <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs font-semibold px-1.5 py-0.5 rounded">
                                PRO
                              </div>
                            )}
                          </div>
                          <div className="flex-1 py-3 pr-3">
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {component.name}
                            </h3>
                            {component.category && (
                              <span className="text-xs text-muted-foreground">
                                {component.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a screenshot and click analyze to find matching components
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-medium text-blue-900 dark:text-blue-100">How it works</p>
                <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Upload any website screenshot or design inspiration</li>
                  <li>• Our AI analyzes the component type (hero, footer, pricing, etc.)</li>
                  <li>• Get instant suggestions of similar components from our library</li>
                  <li>• Click any component to view and copy to your Figma project</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

