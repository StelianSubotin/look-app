"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { FigmaComponent } from "@/components/figma-component"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

interface Component {
  id: string
  name: string
  description?: string
  image_url: string
  clipboard_string: string
  clipboard_string_dark?: string
  image_url_dark?: string
  access_level?: "free" | "paid"
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userPlan, setUserPlan] = useState<"free" | "paid">("free")

  useEffect(() => {
    // Get user and plan
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      
      // Check if user is admin - admins always have paid access
      const isAdmin = user?.user_metadata?.is_admin === true || 
                     user?.email?.toLowerCase() === "steliansubotin@gmail.com"
      
      // Admin always gets paid plan, otherwise use their subscription plan
      const plan = isAdmin ? "paid" : (user?.user_metadata?.plan || "free")
      setUserPlan(plan as "free" | "paid")
      
      // Fetch all components (no filtering - all components visible to everyone)
      // Access control is handled in the component card (PRO badge and pricing modal)
      fetchComponents(plan as "free" | "paid", user?.email || '')
    })
  }, [])

  const fetchComponents = async (plan: "free" | "paid" = "free", email: string = '') => {
    try {
      // Fetch all components (no filtering on server - all visible to everyone)
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Figma Components</h1>
          <p className="text-muted-foreground mt-2">
            Copy these components directly into your Figma files
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading components...</p>
            </div>
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
        ) : components.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No components available yet.</p>
              <p className="text-sm text-muted-foreground">
                Components will appear here once they&apos;re added by an admin.
              </p>
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
                }}
                userPlan={userPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

