"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { FigmaComponent } from "@/components/figma-component"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import { Heart } from "lucide-react"
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

export default function FavoritesPage() {
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")

  const fetchFavorites = async (userId: string) => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setComponents(data)
        setError(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || `Failed to load favorites (${response.status})`)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
      setError("Failed to connect to server. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push("/login?redirect=/favorites")
        return
      }
      
      setUser(user)
      
      const isAdmin = user?.user_metadata?.is_admin === true || 
                     user?.email?.toLowerCase() === "stelsubotin@gmail.com"
      
      const plan = isAdmin ? "paid" : (user?.user_metadata?.plan || "free")
      setUserPlan(plan as "free" | "paid")
      
      fetchFavorites(user.id)
    })
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            <h1 className="text-4xl font-bold">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            Components you&apos;ve saved for quick access
          </p>
        </div>

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
                <h3 className="font-semibold text-destructive mb-2">Error Loading Favorites</h3>
                <p className="text-sm text-destructive/80 mb-4">{error}</p>
                <button
                  onClick={() => {
                    if (user) {
                      setLoading(true)
                      setError(null)
                      fetchFavorites(user.id)
                    }
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : components.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6">
                Start adding components to your favorites by clicking the heart icon on any component.
              </p>
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Components
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
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
                isFavorited={true}
                onFavoriteChange={() => {
                  // Refresh favorites when one is removed
                  if (user) {
                    fetchFavorites(user.id)
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

