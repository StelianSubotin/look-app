"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, CheckCircle, XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminScreenshotsPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    description: "",
    category: "",
    platform: "web" as "web" | "mobile",
    styleTags: [] as string[],
    accessLevel: "free" as "free" | "paid",
  })
  const [capturing, setCapturing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const categories = [
    "Hero Section",
    "Landing Page",
    "Dashboard",
    "Pricing Page",
    "Login Page",
    "Signup Page",
    "Portfolio",
    "E-commerce",
    "Blog",
    "Documentation",
    "Settings",
    "Profile",
    "Other"
  ]

  const styleOptions = [
    "Minimalist",
    "Colorful",
    "Dark Mode",
    "Gradient",
    "Modern",
    "Corporate",
    "Playful",
    "Elegant"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCapturing(true)
    setSuccessMessage("")
    setErrorMessage("")
    setPreviewUrl(null)

    try {
      const response = await fetch("/api/screenshots/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || "Failed to capture screenshot")
        setCapturing(false)
        return
      }

      setSuccessMessage("Screenshot captured and saved successfully!")
      setPreviewUrl(data.screenshot.image_url)
      
      // Reset form
      setFormData({
        url: "",
        title: "",
        description: "",
        category: "",
        platform: "web",
        styleTags: [],
        accessLevel: "free",
      })
    } catch (error) {
      console.error("Capture error:", error)
      setErrorMessage("An error occurred. Please try again.")
    } finally {
      setCapturing(false)
    }
  }

  const toggleStyleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      styleTags: prev.styleTags.includes(tag)
        ? prev.styleTags.filter(t => t !== tag)
        : [...prev.styleTags, tag]
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Camera className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Capture Screenshot</h1>
              <p className="text-muted-foreground">Add new inspiration to the gallery</p>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    {successMessage}
                  </h3>
                  {previewUrl && (
                    <div className="mt-3">
                      <Image
                        src={previewUrl}
                        alt="Captured screenshot"
                        width={400}
                        height={300}
                        className="rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => router.push('/browse/inspiration')}
                    >
                      View in Gallery
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSuccessMessage("")
                        setPreviewUrl(null)
                      }}
                    >
                      Capture Another
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-md bg-destructive/15 border border-destructive/50 p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Capture Form */}
          <Card>
            <CardHeader>
              <CardTitle>Screenshot Details</CardTitle>
              <CardDescription>
                Enter the URL and metadata for the screenshot to capture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* URL */}
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL *</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                    disabled={capturing}
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Stripe Landing Page"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    disabled={capturing}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the design..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={capturing}
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={capturing}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <Label>Platform *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="platform"
                        value="web"
                        checked={formData.platform === "web"}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value as "web" | "mobile" })}
                        disabled={capturing}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Web</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="platform"
                        value="mobile"
                        checked={formData.platform === "mobile"}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value as "web" | "mobile" })}
                        disabled={capturing}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Mobile</span>
                    </label>
                  </div>
                </div>

                {/* Style Tags */}
                <div className="space-y-2">
                  <Label>Style Tags (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {styleOptions.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyleTag(style)}
                        disabled={capturing}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          formData.styleTags.includes(style)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Access Level */}
                <div className="space-y-2">
                  <Label>Access Level *</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="free"
                        checked={formData.accessLevel === "free"}
                        onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as "free" | "paid" })}
                        disabled={capturing}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Free</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="accessLevel"
                        value="paid"
                        checked={formData.accessLevel === "paid"}
                        onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as "free" | "paid" })}
                        disabled={capturing}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Pro Only</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={capturing}
                  className="w-full"
                >
                  {capturing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Capturing Screenshot...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Screenshot
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

