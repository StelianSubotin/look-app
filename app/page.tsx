"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { FigmaComponent } from "@/components/figma-component"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Component {
  id: string
  name: string
  description?: string
  image_url: string
  clipboard_string: string
  clipboard_string_dark?: string
  image_url_dark?: string
  access_level?: "free" | "paid"
  category?: string
  platform?: "web" | "dashboard" | "mobile"
}

export default function Home() {
  const [components, setComponents] = useState<Component[]>([])
  const [filteredComponents, setFilteredComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPlatform, setSelectedPlatform] = useState<"web" | "dashboard" | "mobile" | "all">("all")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const fetchFavorites = async (userId: string) => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        const favoriteIds = new Set<string>(data.map((item: any) => item.id as string))
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      
      const isAdmin = user?.user_metadata?.is_admin === true || 
                     user?.email?.toLowerCase() === "stelsubotin@gmail.com"
      
      const plan = isAdmin ? "paid" : (user?.user_metadata?.plan || "free")
      setUserPlan(plan as "free" | "paid")
      
      fetchComponents(plan as "free" | "paid", user?.email || '')
      
      // Fetch favorites if user is logged in
      if (user) {
        fetchFavorites(user.id)
      }
    })
  }, [])

  useEffect(() => {
    // Filter components based on selected category and platform
    let filtered = components

    if (selectedCategory !== "all") {
      filtered = filtered.filter(c => c.category === selectedCategory)
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter(c => c.platform === selectedPlatform)
    }

    setFilteredComponents(filtered)
  }, [components, selectedCategory, selectedPlatform])

  const fetchComponents = async (plan: "free" | "paid" = "free", email: string = '') => {
    try {
      const response = await fetch(`/api/components?plan=${plan}&email=${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        setComponents(data)
        setError(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || `Failed to load components (${response.status})`)
      }
    } catch (error) {
      console.error("Failed to fetch components:", error)
      setError("Failed to connect to server. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from components
  const categories = Array.from(new Set(components.map(c => c.category).filter(Boolean))) as string[]

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
                variant={selectedPlatform === "dashboard" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedPlatform("dashboard")}
              >
                Dashboard
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

          {/* Components Grid */}
          <div className="bg-muted/30 p-8 min-h-[calc(100vh-4rem)]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-border/50 bg-card">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex justify-between pt-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="rounded-md bg-destructive/15 border border-destructive/50 p-6">
                    <h3 className="font-semibold text-destructive mb-2">Error Loading Components</h3>
                    <p className="text-sm text-destructive/80 mb-4">{error}</p>
                    <button
                      onClick={() => {
                        setLoading(true)
                        setError(null)
                        fetchComponents()
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : filteredComponents.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No components found.</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or check back later.
                  </p>
                </div>
              </div>
            ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {filteredComponents.map((component) => (
                         <FigmaComponent
                           key={component.id}
                           component={{
                             id: component.id,
                             name: component.name,
                             description: component.description,
                             imageUrl: component.image_url,
                             clipboardString: component.clipboard_string,
                             clipboardStringDark: component.clipboard_string_dark,
                             imageUrlDark: component.image_url_dark,
                             accessLevel: component.access_level,
                             category: component.category,
                             platform: component.platform,
                           }}
                           userPlan={userPlan}
                           userId={user?.id}
                           isFavorited={favorites.has(component.id)}
                           onFavoriteChange={() => {
                             // Refresh favorites when changed
                             if (user) {
                               fetchFavorites(user.id)
                             }
                           }}
                         />
                       ))}
                     </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

