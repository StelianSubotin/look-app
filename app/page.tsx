"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid3x3, Image as ImageIcon, Camera, Box, Music as MusicIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

type ContentType = "components" | "illustrations" | "photos" | "3d-models" | "music"

const contentTypes = [
  { id: "components", label: "Components", icon: Grid3x3 },
  { id: "illustrations", label: "Illustrations", icon: ImageIcon },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "3d-models", label: "3D Models", icon: Box },
  { id: "music", label: "Music", icon: MusicIcon },
] as const

const getSuggestions = (type: ContentType) => {
  switch (type) {
    case "components":
      return ["All Components", "Hero", "Footer", "CTA", "Navbar"]
    case "illustrations":
      return ["All Illustrations", "Business", "People", "Nature", "Technology"]
    case "photos":
      return ["All Photos", "Business", "Nature", "Technology", "People"]
    case "3d-models":
      return ["All 3D Models", "Characters", "Objects", "Buildings", "Nature"]
    case "music":
      return ["All Music", "Background", "Upbeat", "Calm", "Electronic"]
    default:
      return ["All Components", "Hero", "Footer", "CTA", "Navbar"]
  }
}

const categoryCards = [
  {
    id: "components",
    title: "Components",
    description: "Ready-to-use Figma components",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "100+",
    available: true,
  },
  {
    id: "illustrations",
    title: "Illustrations",
    description: "Beautiful illustrations for your designs",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "Coming soon",
    available: false,
  },
  {
    id: "templates",
    title: "Templates",
    description: "Complete page templates",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "Coming soon",
    available: false,
  },
  {
    id: "icons",
    title: "Icons",
    description: "Icon sets for your projects",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "Coming soon",
    available: false,
  },
]

export default function HubPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ContentType>("components")
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Force a refresh when auth state changes
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse/${selectedType}?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSuggestionClick = (suggestion: string, type: ContentType) => {
    // If "All [Type]", just go to browse page without category filter
    if (suggestion.startsWith("All ")) {
      router.push(`/browse/${type}`)
    } else {
      router.push(`/browse/${type}?category=${encodeURIComponent(suggestion)}`)
    }
  }

  const getPlaceholder = () => {
    switch (selectedType) {
      case "components":
        return "Search components..."
      case "illustrations":
        return "Search illustrations..."
      case "photos":
        return "Search photos..."
      case "3d-models":
        return "Search 3D models..."
      case "music":
        return "Search music..."
      default:
        return "Search..."
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar key={user?.id || 'anonymous'} />
      
      {/* Hero Section with Search */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr,400px] gap-12 items-start max-w-7xl mx-auto">
          {/* Left Side - Search and Content */}
          <div>
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4">
                Design resources for creatives and developers
              </h1>
              <p className="text-xl text-muted-foreground">
                The ultimate design kit for Figma
              </p>
            </div>

            {/* Content Type Tabs */}
            <div className="inline-flex items-center gap-2 mb-4 p-1 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-border/50">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedType(type.id as ContentType)}
                    className="gap-1.5 h-8"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {type.label}
                  </Button>
                )
              })}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative shadow-md rounded-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={getPlaceholder()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base bg-white border-border/50"
                />
              </div>
            </form>

            {/* Suggestion Tags */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Popular now:</p>
              <div className="flex flex-wrap gap-2">
                {getSuggestions(selectedType).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion, selectedType)}
                    className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <Search className="h-3 w-3 inline mr-1.5" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Illustration Cards */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              {categoryCards.slice(0, 4).map((card, index) => (
                <div
                  key={card.id}
                  className="relative aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center"
                  style={{
                    transform: index % 2 === 0 ? 'translateY(0)' : 'translateY(20px)'
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={150}
                    height={150}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Preview Cards */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Explore our collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((card) => (
              <Link
                key={card.id}
                href={card.available ? `/browse/${card.id}` : "#"}
                className={`group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg ${
                  !card.available ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={(e) => {
                  if (!card.available) {
                    e.preventDefault()
                  }
                }}
              >
                <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-purple-50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform"
                  />
                  {!card.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                      <span className="text-lg font-semibold">Coming Soon</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{card.count}</span>
                    {card.available && (
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        Browse →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
