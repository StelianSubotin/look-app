"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit2, Plus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { normalizeImageUrl } from "@/lib/image-url"
import { createClient } from "@/lib/supabase-client"

interface Component {
  id: string
  name: string
  description?: string
  image_url: string
  clipboard_string: string
  created_at?: string
  access_level?: "free" | "paid"
}

export default function ManageComponentsPage() {
  const router = useRouter()
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const isAdmin = user.user_metadata?.is_admin === true || 
                       user.email === "stelsubotin@gmail.com"
        
        if (isAdmin) {
          fetchComponents()
        } else {
          router.push("/components")
        }
      } else {
        router.push("/login")
      }
    }
    
    checkAuth()
  }, [router])

  const fetchComponents = async () => {
    try {
      const response = await fetch("/api/components?plan=paid&email=stelsubotin@gmail.com")
      if (response.ok) {
        const data = await response.json()
        setComponents(data)
      }
    } catch (error) {
      console.error("Failed to fetch components:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this component?")) return

    try {
      const response = await fetch(`/api/components/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchComponents()
      }
    } catch (error) {
      console.error("Failed to delete component:", error)
      alert("Failed to delete component")
    }
  }

  const handleEdit = (component: Component) => {
    router.push(`/admin/edit/${component.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Components</h1>
              <p className="text-muted-foreground mt-2">
                View, edit, and delete existing components
              </p>
            </div>
            <Button onClick={() => router.push("/admin/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        {components.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No components found.</p>
              <Button onClick={() => router.push("/admin/create")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Component
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <Card key={component.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <Image
                    src={normalizeImageUrl(component.image_url)}
                    alt={component.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error('Image load error:', component.image_url)
                      e.currentTarget.src = '/figma-components/placeholder.svg'
                    }}
                  />
                  {component.access_level === "paid" && (
                    <div className="absolute top-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-1 z-20">
                      <span className="text-xs font-semibold text-primary-foreground">PRO</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{component.name}</CardTitle>
                  {component.description && (
                    <CardDescription>{component.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(component)}
                      className="flex-1"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(component.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

