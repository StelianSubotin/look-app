"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid3x3, Sparkles, Wrench, Layers, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

type ContentType = "components" | "inspiration" | "tools" | "academy" | "design-system"

const contentTypes = [
  { id: "components", label: "Components", icon: Grid3x3 },
  { id: "inspiration", label: "Inspiration", icon: Sparkles },
  { id: "tools", label: "Tools", icon: Wrench },
  { id: "academy", label: "Academy", icon: GraduationCap },
  { id: "design-system", label: "Design System", icon: Layers },
] as const

const getSuggestions = (type: ContentType) => {
  switch (type) {
    case "components":
      return ["All Components", "Hero", "Footer", "CTA", "Navbar"]
    case "inspiration":
      return ["All Inspiration", "Landing Page", "Dashboard", "Hero Section", "Pricing Page"]
    case "tools":
      return ["Palette Generator", "Contrast Checker", "Style Matcher", "Component Finder"]
    case "academy":
      return ["Typography", "Color Theory", "Layout", "Accessibility", "Design Systems"]
    case "design-system":
      return ["Typography", "Colors", "Spacing", "Components", "Guidelines"]
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
    id: "inspiration",
    title: "Inspiration",
    description: "Real website design inspiration",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "New!",
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
    id: "tools",
    title: "Tools",
    description: "Design tools for accessibility & workflows",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "5 tools",
    available: true,
  },
  {
    id: "academy",
    title: "Academy",
    description: "Learn design fundamentals from experts",
    image: "https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp",
    count: "6 articles",
    available: true,
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
      if (selectedType === "tools") {
        router.push("/tools")
      } else if (selectedType === "academy") {
        router.push("/academy")
      } else if (selectedType === "design-system") {
        alert("Design System coming soon!")
      } else {
        router.push(`/browse/${selectedType}?search=${encodeURIComponent(searchQuery)}`)
      }
    }
  }

  const handleSuggestionClick = (suggestion: string, type: ContentType) => {
    // Handle different content types
    if (type === "tools") {
      // Navigate to specific tools
      if (suggestion === "Palette Generator") {
        router.push("/tools/palette-generator")
      } else if (suggestion === "Contrast Checker") {
        router.push("/tools/contrast-checker")
      } else if (suggestion === "Style Matcher") {
        router.push("/tools/style-matcher")
      } else if (suggestion === "Component Finder") {
        router.push("/tools/component-finder")
      } else {
        router.push("/tools")
      }
    } else if (type === "academy") {
      // Navigate to academy with category filter
      router.push("/academy")
    } else if (type === "design-system") {
      // Coming soon page - just stay on homepage for now
      alert("Design System coming soon!")
    } else {
      // For components and inspiration
      if (suggestion.startsWith("All ")) {
        router.push(`/browse/${type}`)
      } else {
        router.push(`/browse/${type}?category=${encodeURIComponent(suggestion)}`)
      }
    }
  }

  const getPlaceholder = () => {
    switch (selectedType) {
      case "components":
        return "Search components..."
      case "inspiration":
        return "Search design inspiration..."
      case "tools":
        return "Search design tools..."
      case "academy":
        return "Search articles..."
      case "design-system":
        return "Search design system..."
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
