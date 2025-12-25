"use client"

import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, RefreshCw, Contrast, Search, Layers, Sparkles, ArrowRight, FileText, PenTool, LayoutDashboard } from "lucide-react"

const tools = [
  {
    id: "dashboard-builder",
    title: "Dashboard Builder",
    description: "Build beautiful dashboards with drag-and-drop. Use pre-built components, customize with AI prompts, and export clean React code.",
    icon: LayoutDashboard,
    color: "bg-cyan-500",
    href: "/tools/dashboard-builder",
    tags: ["New", "AI-Powered"]
  },
  {
    id: "mood-board",
    title: "Mood Board Creator",
    description: "Create beautiful mood boards with an infinite canvas. Add images, shapes, sticky notes, and more. Share with clients instantly.",
    icon: PenTool,
    color: "bg-rose-500",
    href: "/tools/mood-board",
    tags: ["New", "Canvas"]
  },
  {
    id: "proposal-generator",
    title: "Proposal Generator",
    description: "Create professional client proposals with shareable links and PDF export. Impress your clients with beautiful, branded proposals.",
    icon: FileText,
    color: "bg-indigo-500",
    href: "/tools/proposal-generator",
    tags: ["New", "Business"]
  },
  {
    id: "palette-generator",
    title: "Palette Generator",
    description: "Generate beautiful color palettes with a single spacebar press. Lock colors you like and explore infinite variations.",
    icon: Palette,
    color: "bg-purple-500",
    href: "/tools/palette-generator",
    tags: ["Popular", "Colors"]
  },
  {
    id: "contrast-checker",
    title: "Contrast Checker",
    description: "Check WCAG compliance and ensure your designs meet accessibility standards with real-time contrast ratio calculations.",
    icon: Contrast,
    color: "bg-blue-500",
    href: "/tools/contrast-checker",
    tags: ["Accessibility", "WCAG"]
  },
  {
    id: "style-matcher",
    title: "Style Matcher",
    description: "Upload your brand colors and find components from our library that match your style perfectly.",
    icon: RefreshCw,
    color: "bg-green-500",
    href: "/tools/style-matcher",
    tags: ["New", "Components"]
  },
  {
    id: "component-finder",
    title: "Component Finder",
    description: "Upload any website screenshot and get AI-powered suggestions of similar components from our library.",
    icon: Search,
    color: "bg-orange-500",
    href: "/tools/component-finder",
    tags: ["New", "AI-Powered"]
  },
  {
    id: "design-system-generator",
    title: "Design System Generator",
    description: "Generate a complete design system with colors, typography, spacing, and guidelines based on your brand.",
    icon: Layers,
    color: "bg-pink-500",
    href: "/tools/design-system-generator",
    tags: ["New", "Brand"]
  },
]

export default function ToolsHubPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-medium hover:text-primary transition-colors mb-4"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Design Tools</h1>
              <p className="text-lg text-muted-foreground">
                Free tools to help you create better designs
              </p>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card
                key={tool.id}
                className="cursor-pointer hover:shadow-lg transition-all group"
                onClick={() => router.push(tool.href)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 ${tool.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">More Tools Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                We&apos;re constantly adding new tools to help you design better. Stay tuned!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Gradient Maker", "Icon Generator", "Typography Tester", "Color Blindness Simulator"].map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

