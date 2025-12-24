"use client"

import { useEffect, useState, useMemo, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ExternalLink, Tag, Copy, Check } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

interface Screenshot {
  id: string
  url: string
  title: string
  description?: string
  category?: string
  platform: "web" | "mobile"
  style_tags?: string[]
  image_url: string
  access_level: "free" | "paid"
  captured_at: string
}

function InspirationBrowseContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'

  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [filteredScreenshots, setFilteredScreenshots] = useState<Screenshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [selectedPlatform, setSelectedPlatform] = useState<"web" | "mobile" | "all">("all")
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      const isAdmin = user?.user_metadata?.is_admin === true || 
                     user?.email?.toLowerCase() === "stelsubotin@gmail.com"
      const plan = isAdmin ? "paid" : (user?.user_metadata?.plan || "free")
      setUserPlan(plan as "free" | "paid")
    })
    fetchScreenshots()
  }, [])

  useEffect(() => {
    const newCategory = searchParams.get('category') || 'all'
    if (newCategory !== selectedCategory) {
      setSelectedCategory(newCategory)
    }
  }, [searchParams])

  useEffect(() => {
    let filtered = screenshots

    if (selectedCategory !== "all") {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter(s => s.platform === selectedPlatform)
    }

    setFilteredScreenshots(filtered)
  }, [screenshots, selectedCategory, selectedPlatform])

  const fetchScreenshots = async () => {
    try {
      const response = await fetch('/api/screenshots')
      if (response.ok) {
        const data = await response.json()
        setScreenshots(data)
        setError(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || `Failed to load inspiration (${response.status})`)
      }
    } catch (error) {
      console.error("Failed to fetch screenshots:", error)
      setError("Failed to connect to server. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    return Array.from(new Set(screenshots.map(s => s.category).filter(Boolean))) as string[]
  }, [screenshots])

  const openScreenshot = (screenshot: Screenshot) => {
    // Check if user has access
    if (screenshot.access_level === "paid" && userPlan === "free") {
      // Show upgrade modal or redirect
      alert("This is a Pro feature. Please upgrade to access premium inspiration.")
      return
    }
    setSelectedScreenshot(screenshot)
    setCopySuccess(false) // Reset copy status
  }

  const copyScreenshot = async () => {
    if (!selectedScreenshot) return

    try {
      // Fetch the image
      const response = await fetch(selectedScreenshot.image_url)
      const blob = await response.blob()
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy screenshot:', error)
      // Fallback: open in new tab if copy fails
      window.open(selectedScreenshot.image_url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Left Sidebar - Categories */}
        <aside className="w-64 bg-white border-r border-border/50 min-h-[calc(100vh-4rem)] p-6 sticky top-16">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Filter by Category</h3>
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Filter Bar - Platform Tabs */}
          <div className="bg-white border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-4">Platform:</span>
              <Button
                variant={selectedPlatform === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlatform("all")}
              >
                All
              </Button>
              <Button
                variant={selectedPlatform === "web" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlatform("web")}
              >
                Web
              </Button>
              <Button
                variant={selectedPlatform === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlatform("mobile")}
              >
                Mobile
              </Button>
            </div>
          </div>

          {/* Screenshots Grid */}
          <div className="bg-muted/30 p-8 min-h-[calc(100vh-4rem)]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-border/50 bg-card">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="rounded-md bg-destructive/15 border border-destructive/50 p-6">
                    <h3 className="font-semibold text-destructive mb-2">Error Loading Screenshots</h3>
                    <p className="text-sm text-destructive/80 mb-4">{error}</p>
                    <button
                      onClick={() => {
                        setLoading(true)
                        setError(null)
                        fetchScreenshots()
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredScreenshots.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No inspiration found.</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScreenshots.map((screenshot) => (
                  <Card
                    key={screenshot.id}
                    className="overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
                    onClick={() => openScreenshot(screenshot)}
                  >
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={screenshot.image_url}
                        alt={screenshot.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                        quality={75}
                      />
                      {screenshot.access_level === "paid" && userPlan === "free" && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                          PRO
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {screenshot.title}
                      </h3>
                      {screenshot.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {screenshot.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {screenshot.category && (
                          <span className="text-xs text-muted-foreground">
                            {screenshot.category}
                          </span>
                        )}
                        {screenshot.style_tags && screenshot.style_tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {screenshot.style_tags[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Screenshot Detail Modal */}
      <Dialog open={!!selectedScreenshot} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] p-0 flex flex-col">
          {selectedScreenshot && (
            <>
              {/* Header - Fixed */}
              <div className="p-6 border-b border-border shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedScreenshot.title}</h2>
                    {selectedScreenshot.description && (
                      <p className="text-muted-foreground">{selectedScreenshot.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyScreenshot}
                      className="gap-2"
                    >
                      {copySuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <a
                      href={selectedScreenshot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      Visit Site
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedScreenshot.category && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      {selectedScreenshot.category}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-muted rounded text-xs capitalize">
                    {selectedScreenshot.platform}
                  </span>
                  {selectedScreenshot.style_tags?.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-muted rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scrollable Screenshot - Takes remaining space */}
              <div className="flex-1 overflow-y-auto bg-muted">
                <div className="relative w-full min-h-full flex items-start justify-center p-3">
                  <Image
                    src={selectedScreenshot.image_url}
                    alt={selectedScreenshot.title}
                    width={1920}
                    height={10000}
                    className="w-full h-auto rounded shadow-lg"
                    quality={90}
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function InspirationBrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <InspirationBrowseContent />
    </Suspense>
  )
}

