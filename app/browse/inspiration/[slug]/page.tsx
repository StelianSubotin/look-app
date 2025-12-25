"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ExternalLink, Tag, Copy, Check, Download, ArrowLeft, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
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
  page_name?: string
  access_level: "free" | "paid"
  captured_at: string
}

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
  screenshots: Screenshot[]
}

export default function SiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")
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
    fetchSite()
  }, [resolvedParams.slug])

  const fetchSite = async () => {
    try {
      const response = await fetch(`/api/sites/${resolvedParams.slug}`)
      if (response.ok) {
        const data = await response.json()
        setSite(data)
        setError(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || `Site not found`)
      }
    } catch (error) {
      console.error("Failed to fetch site:", error)
      setError("Failed to load site. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const openScreenshot = (screenshot: Screenshot) => {
    if (screenshot.access_level === "paid" && userPlan === "free") {
      alert("This is a Pro feature. Please upgrade to access premium inspiration.")
      return
    }
    setSelectedScreenshot(screenshot)
    setCopySuccess(false)
  }

  const copyScreenshot = async () => {
    if (!selectedScreenshot) return

    try {
      if (!navigator.clipboard || !ClipboardItem) {
        throw new Error('Clipboard API not supported')
      }

      const response = await fetch(selectedScreenshot.image_url, {
        mode: 'cors',
        cache: 'no-cache'
      })
      
      if (!response.ok) throw new Error('Failed to fetch image')

      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ])
      
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy screenshot:', error)
      alert('Could not copy to clipboard. Please use the Download button instead.')
    }
  }

  const downloadScreenshot = () => {
    if (!selectedScreenshot) return

    const link = document.createElement('a')
    link.href = selectedScreenshot.image_url
    link.download = `${site?.name || 'screenshot'}-${selectedScreenshot.page_name || 'page'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-video" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Link href="/browse/inspiration">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Inspiration
            </Button>
          </Link>
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <h3 className="text-xl font-semibold mb-2">Site Not Found</h3>
              <p className="text-muted-foreground mb-4">{error || "This site doesn't exist or has been removed."}</p>
              <Link href="/browse/inspiration">
                <Button>Browse All Sites</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Back Button */}
        <Link href="/browse/inspiration">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Inspiration
          </Button>
        </Link>

        {/* Site Header */}
        <div className="mb-12">
          <div className="flex items-start gap-6">
            {/* Logo */}
            {site.logo_url && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border bg-white shrink-0">
                <Image
                  src={site.logo_url}
                  alt={site.name}
                  fill
                  className="object-contain p-3"
                />
              </div>
            )}
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{site.name}</h1>
                {site.access_level === "paid" && userPlan === "free" && (
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    PRO
                  </span>
                )}
              </div>
              
              {site.description && (
                <p className="text-lg text-muted-foreground mb-4">{site.description}</p>
              )}
              
              <div className="flex items-center gap-4">
                {site.website_url && (
                  <a
                    href={site.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
                
                {site.industry && (
                  <span className="px-3 py-1 bg-muted rounded-full text-sm">
                    {site.industry}
                  </span>
                )}
                
                <span className="text-sm text-muted-foreground">
                  {site.screenshot_count} {site.screenshot_count === 1 ? 'screen' : 'screens'}
                </span>
              </div>
              
              {site.style_tags && site.style_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {site.style_tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Screenshots Grid */}
        {site.screenshots && site.screenshots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {site.screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="group relative cursor-pointer rounded-xl overflow-hidden border bg-card hover:border-primary/50 transition-all hover:shadow-lg"
                onClick={() => openScreenshot(screenshot)}
              >
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={screenshot.image_url}
                    alt={screenshot.page_name || screenshot.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                  />
                  {screenshot.access_level === "paid" && userPlan === "free" && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                      PRO
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {screenshot.page_name || screenshot.title}
                  </h3>
                  {screenshot.category && (
                    <p className="text-xs text-muted-foreground mt-1">{screenshot.category}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-muted-foreground">No screenshots available yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Screenshot Detail Modal */}
      <Dialog open={!!selectedScreenshot} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] p-0 flex flex-col">
          {selectedScreenshot && (
            <>
              <div className="p-6 border-b border-border shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">
                      {site.name} • {selectedScreenshot.page_name || selectedScreenshot.title}
                    </h2>
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadScreenshot}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <a
                      href={selectedScreenshot.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      Visit Page
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-muted">
                <div className="relative w-full min-h-full flex items-start justify-center p-3">
                  <Image
                    src={selectedScreenshot.image_url}
                    alt={selectedScreenshot.page_name || selectedScreenshot.title}
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

