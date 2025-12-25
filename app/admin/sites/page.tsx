"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ExternalLink, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

export default function AdminSitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [industry, setIndustry] = useState("")
  const [styleTags, setStyleTags] = useState("")
  const [accessLevel, setAccessLevel] = useState<"free" | "paid">("free")
  const [featured, setFeatured] = useState(false)

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites')
      if (response.ok) {
        const data = await response.json()
        setSites(data)
      }
    } catch (error) {
      console.error("Failed to fetch sites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          logo_url: logoUrl,
          website_url: websiteUrl,
          industry,
          style_tags: styleTags.split(',').map(t => t.trim()).filter(t => t),
          access_level: accessLevel,
          featured
        })
      })

      if (response.ok) {
        // Reset form
        setName("")
        setDescription("")
        setLogoUrl("")
        setWebsiteUrl("")
        setIndustry("")
        setStyleTags("")
        setAccessLevel("free")
        setFeatured(false)
        setShowForm(false)
        
        // Refresh sites list
        fetchSites()
      } else {
        const error = await response.json()
        alert(`Failed to create site: ${error.error}`)
      }
    } catch (error) {
      console.error("Error creating site:", error)
      alert("Failed to create site")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Sites</h1>
            <p className="text-muted-foreground">
              Create and manage product/brand collections for inspiration gallery
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Site'}
          </Button>
        </div>

        {/* Create Site Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Site</CardTitle>
              <CardDescription>
                Add a new product or brand to group screenshots. You&apos;ll be able to add screenshots to it later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Site Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., ClickUp, Figma, Notion"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g., Productivity, Design, Finance"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the product"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="styleTags">Style Tags (comma-separated)</Label>
                  <Input
                    id="styleTags"
                    value={styleTags}
                    onChange={(e) => setStyleTags(e.target.value)}
                    placeholder="Modern, Minimalist, Dark Mode"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Access Level:</label>
                    <select
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value as "free" | "paid")}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="free">Free</option>
                      <option value="paid">Pro Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={creating || !name}>
                    {creating ? 'Creating...' : 'Create Site'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Sites List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading sites...</p>
          </div>
        ) : sites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No sites yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50">
                  {site.logo_url && (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="relative w-full h-full">
                        <Image
                          src={site.logo_url}
                          alt={site.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {site.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                  {site.access_level === "paid" && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                      PRO
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
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
                      <h3 className="font-bold text-lg truncate">{site.name}</h3>
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

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">
                      {site.screenshot_count} screenshots
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

                  <div className="flex gap-2">
                    <Link href={`/browse/inspiration/${site.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/screenshots?site=${site.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Add Screenshots
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

