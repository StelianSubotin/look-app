"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid3x3, Image as ImageIcon, Camera, Box, Music as MusicIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type ContentType = "components" | "illustrations" | "photos" | "3d-models" | "music"

const contentTypes = [
  { id: "components", label: "Components", icon: Grid3x3, available: true },
  { id: "illustrations", label: "Illustrations", icon: ImageIcon, available: false },
  { id: "photos", label: "Photos", icon: Camera, available: false },
  { id: "3d-models", label: "3D Models", icon: Box, available: false },
  { id: "music", label: "Music", icon: MusicIcon, available: false },
] as const

const componentSuggestions = [
  "Hero",
  "Footer",
  "CTA",
  "Navbar",
  "Pricing",
  "Testimonials",
  "FAQ",
  "Cards",
  "Forms",
  "Buttons",
]

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
]

export default function HubPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ContentType>("components")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse/${selectedType}?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    router.push(`/browse/components?category=${encodeURIComponent(suggestion)}`)
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
      <Navbar />
      
      {/* Hero Section with Search */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Design resources for creatives and developers
            </h1>
            <p className="text-xl text-muted-foreground">
              The ultimate design kit for Figma
            </p>
          </div>

          {/* Content Type Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedType(type.id as ContentType)}
                  disabled={!type.available}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {type.label}
                  {!type.available && (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Soon</span>
                  )}
                </Button>
              )
            })}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={getPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg"
              />
            </div>
          </form>

          {/* Suggestion Tags (only show for components) */}
          {selectedType === "components" && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Popular now:</p>
              <div className="flex flex-wrap gap-2">
                {componentSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
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
