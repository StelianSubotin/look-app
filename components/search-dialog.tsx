"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, TrendingUp, Folder, Monitor, Eye, GitBranch, X } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { normalizeImageUrl } from "@/lib/image-url"

interface Component {
  id: string
  name: string
  description?: string
  image_url: string
  clipboard_string: string
  category?: string
  platform?: "web" | "dashboard" | "mobile"
  access_level?: "free" | "paid"
}

type NavigationItem = "trending" | "categories" | "screens" | "ui-elements" | "flows"

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [components, setComponents] = React.useState<Component[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedNav, setSelectedNav] = React.useState<NavigationItem>("screens")
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (open) {
      // Fetch components when dialog opens
      fetch("/api/components")
        .then((res) => res.json())
        .then((data) => setComponents(data))
        .catch(() => setComponents([]))
    } else {
      // Reset search when closing
      setSearchQuery("")
      setSelectedNav("screens")
    }
  }, [open])

  // Filter components based on search and navigation
  const filteredComponents = React.useMemo(() => {
    let filtered = components

    // Filter by navigation selection
    switch (selectedNav) {
      case "screens":
        // Show mobile platform components or components with "screen" in name/category
        filtered = filtered.filter(
          (c) => c.platform === "mobile" || 
                 c.name.toLowerCase().includes("screen") ||
                 c.category?.toLowerCase().includes("screen")
        )
        break
      case "ui-elements":
        // Show web/dashboard components or smaller UI elements
        filtered = filtered.filter(
          (c) => c.platform === "web" || 
                 c.platform === "dashboard" ||
                 c.category?.toLowerCase().includes("element")
        )
        break
      case "flows":
        // Show components that might be flows (multi-step, checkout, onboarding, etc.)
        filtered = filtered.filter(
          (c) => c.name.toLowerCase().includes("flow") ||
                 c.name.toLowerCase().includes("checkout") ||
                 c.name.toLowerCase().includes("onboarding") ||
                 c.name.toLowerCase().includes("wizard") ||
                 c.category?.toLowerCase().includes("flow")
        )
        break
      case "categories":
        // Show all, grouped by category
        filtered = filtered
        break
      case "trending":
        // Show recently added (sorted by created_at, but we'll show all for now)
        filtered = filtered
        break
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query) ||
          c.category?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [components, selectedNav, searchQuery])

  const handleComponentClick = (component: Component) => {
    setOpen(false)
    router.push("/")
    // Scroll to component on the page after navigation
    setTimeout(() => {
      const element = document.querySelector(
        `[data-component-id="${component.id}"]`
      )
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        // Highlight the component briefly
        element.classList.add("ring-2", "ring-primary")
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary")
        }, 2000)
      }
    }, 300)
  }

  const navigationItems: { id: NavigationItem; label: string; icon: React.ReactNode }[] = [
    { id: "trending", label: "Trending", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "categories", label: "Categories", icon: <Folder className="h-4 w-4" /> },
    { id: "screens", label: "Screens", icon: <Monitor className="h-4 w-4" /> },
    { id: "ui-elements", label: "UI Elements", icon: <Eye className="h-4 w-4" /> },
    { id: "flows", label: "Flows", icon: <GitBranch className="h-4 w-4" /> },
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline-block">Search components...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-[90vw] h-[85vh] p-0 gap-0 bg-background border-border/50">
          <div className="flex flex-col h-full">
            {/* Search Bar */}
            <div className="border-b border-border/50 p-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="iOS Apps, Screens, UI Elements, Flows or Keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Left Sidebar Navigation */}
              <aside className="w-64 border-r border-border/50 bg-muted/30 p-4 overflow-y-auto">
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        selectedNav === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold capitalize">
                    {selectedNav === "ui-elements" ? "UI Elements" : selectedNav === "trending" ? "Trending" : selectedNav.charAt(0).toUpperCase() + selectedNav.slice(1)}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredComponents.length} {filteredComponents.length === 1 ? "component" : "components"} found
                  </p>
                </div>

                {filteredComponents.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">No components found.</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or selecting a different category.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredComponents.map((component) => (
                      <Card
                        key={component.id}
                        className="overflow-hidden border-border/50 cursor-pointer hover:border-primary/50 transition-colors group"
                        onClick={() => handleComponentClick(component)}
                      >
                        <div className="relative aspect-video bg-muted">
                          <Image
                            src={normalizeImageUrl(component.image_url)}
                            alt={component.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                            quality={60}
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            onError={(e) => {
                              console.error('Image load error:', component.image_url)
                              e.currentTarget.src = '/figma-components/placeholder.svg'
                            }}
                          />
                          {component.access_level === "paid" && (
                            <div className="absolute top-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-1 z-10">
                              <span className="text-xs font-semibold text-primary-foreground">PRO</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{component.name}</h3>
                          {component.category && (
                            <span className="text-xs text-muted-foreground">{component.category}</span>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </main>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

