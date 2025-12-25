"use client"

import { useEffect, useState, useMemo, Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Tag, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

interface Site {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website_url?: string
  industry?: string
  style_tags?: string[]
  screenshot_count: number
  access_level: "free" | "paid"
  featured: boolean
}

function InspirationBrowseContent() {
  const searchParams = useSearchParams()
  const initialIndustry = searchParams.get('industry') || 'all'

  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")
  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustry)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      const isAdmin = user?.user_metadata?.is_admin === true || 
                     user?.email?.toLowerCase() === "stelsubotin@gmail.com"
      const plan = isAdmin ? "paid" : (user?.user_metadata?.plan || "free")
      setUserPlan(plan as "free" | "paid")
    })
    fetchSites()
  }, [])

  useEffect(() => {
    const newIndustry = searchParams.get('industry') || 'all'
    if (newIndustry !== selectedIndustry) {
      setSelectedIndustry(newIndustry)
    }
  }, [searchParams, selectedIndustry])

  useEffect(() => {
    let filtered = sites

    if (selectedIndustry !== "all") {
      filtered = filtered.filter(s => s.industry === selectedIndustry)
    }

    setFilteredSites(filtered)
  }, [sites, selectedIndustry])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites')
      if (response.ok) {
        const data = await response.json()
        setSites(data)
        setError(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || `Failed to load sites (${response.status})`)
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error)
      setError("Failed to connect to server. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const industries = useMemo(() => {
    return Array.from(new Set(sites.map(s => s.industry).filter(Boolean))) as string[]
  }, [sites])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        {/* Left Sidebar - Industries */}
        <aside className="w-64 bg-white border-r border-border/50 min-h-[calc(100vh-4rem)] p-6 sticky top-16">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Browse by Industry</h3>
            <button
              onClick={() => setSelectedIndustry("all")}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                selectedIndustry === "all"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              All Industries
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                  selectedIndustry === industry
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="bg-white border-b border-border/50 px-8 py-6">
            <h1 className="text-3xl font-bold mb-2">Design Inspiration</h1>
            <p className="text-muted-foreground">
              Browse screenshots from {filteredSites.length} {filteredSites.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Sites Grid */}
          <div className="bg-muted/30 p-8 min-h-[calc(100vh-4rem)]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-border/50 bg-card">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="rounded-md bg-destructive/15 border border-destructive/50 p-6">
                    <h3 className="font-semibold text-destructive mb-2">Error Loading Sites</h3>
                    <p className="text-sm text-destructive/80 mb-4">{error}</p>
                    <button
                      onClick={() => {
                        setLoading(true)
                        setError(null)
                        fetchSites()
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredSites.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No sites found.</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                  <Link key={site.id} href={`/browse/inspiration/${site.slug}`}>
                    <Card className="overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group h-full">
                      {/* Thumbnail - First screenshot or placeholder */}
                      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50">
                        {/* We'll show the logo as a centered icon */}
                        {site.logo_url && (
                          <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="relative w-full h-full">
                              <Image
                                src={site.logo_url}
                                alt={site.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="lazy"
                                quality={75}
                              />
                            </div>
                          </div>
                        )}
                        {site.access_level === "paid" && userPlan === "free" && (
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                            PRO
                          </div>
                        )}
                        {site.featured && (
                          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            Featured
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          {/* Small logo */}
                          {site.logo_url && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-white shrink-0">
                              <Image
                                src={site.logo_url}
                                alt={site.name}
                                fill
                                className="object-contain p-1"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">
                              {site.name}
                            </h3>
                            {site.industry && (
                              <p className="text-xs text-muted-foreground">{site.industry}</p>
                            )}
                          </div>
                        </div>
                        
                        {site.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {site.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {site.screenshot_count} {site.screenshot_count === 1 ? 'screen' : 'screens'}
                          </span>
                          {site.style_tags && site.style_tags.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Tag className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {site.style_tags[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {site.website_url && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="inline-flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              View Screenshots
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
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
