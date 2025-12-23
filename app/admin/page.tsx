"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit2, Plus, Upload } from "lucide-react"
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

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    clipboard_string: "",
    clipboard_string_dark: "",
    image_url_dark: "",
    access_level: "free" as "free" | "paid",
  })
  const [uploading, setUploading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [clipboardFormats, setClipboardFormats] = useState<Record<string, string>>({})
  const [showClipboardCapture, setShowClipboardCapture] = useState(false)

  useEffect(() => {
    // Check if user is admin
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user is admin (via metadata or email)
        const isAdmin = user.user_metadata?.is_admin === true || 
                       user.email === "steliansubotin@gmail.com" // Your admin email
        
        if (isAdmin) {
          setIsAuthenticated(true)
          fetchComponents()
        } else {
          // Not an admin - redirect to components page
          window.location.href = "/components"
        }
      } else {
        // Not logged in - show password form as fallback
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const handleLogin = () => {
    // Simple password check - in production, use proper authentication
    // For now, using a hardcoded password. Change this in production!
    const adminPassword = "admin123" // Change this to your secure password
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      fetchComponents()
    } else {
      alert("Incorrect password")
    }
  }

  const fetchComponents = async () => {
    try {
      const response = await fetch("/api/components")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Include all clipboard formats if available
      const dataToSave = {
        ...formData,
        // Store additional formats as metadata (we'll extend the API if needed)
        _clipboardFormats: Object.keys(clipboardFormats).length > 1 ? clipboardFormats : undefined,
      }
      
      if (editingId) {
        // Update existing
        const response = await fetch(`/api/components/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        })
        if (response.ok) {
          fetchComponents()
          resetForm()
        }
      } else {
        // Create new
        const response = await fetch("/api/components", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        })
        if (response.ok) {
          fetchComponents()
          resetForm()
        }
      }
    } catch (error) {
      console.error("Failed to save component:", error)
      alert("Failed to save component")
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
    setEditingId(component.id)
    const componentWithDark = component as Component & {
      clipboard_string_dark?: string
      image_url_dark?: string
      access_level?: "free" | "paid"
    }
    setFormData({
      name: component.name,
      description: component.description || "",
      image_url: component.image_url,
      clipboard_string: component.clipboard_string,
      clipboard_string_dark: componentWithDark.clipboard_string_dark || "",
      image_url_dark: componentWithDark.image_url_dark || "",
      access_level: componentWithDark.access_level || "free",
    })
    setUploadPreview(component.image_url)
    setClipboardFormats({})
    setShowClipboardCapture(false)
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      name: "",
      description: "",
      image_url: "",
      clipboard_string: "",
      clipboard_string_dark: "",
      image_url_dark: "",
      access_level: "free",
    })
    setUploadPreview(null)
    setClipboardFormats({})
    setShowClipboardCapture(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setFormData((prev) => ({
        ...prev,
        image_url: data.path,
      }))
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
      setUploadPreview(null)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter the admin password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Figma components
            </p>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("admin_authenticated")
              setIsAuthenticated(false)
            }}
            variant="outline"
          >
            Logout
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Component" : "Add New Component"}
              </CardTitle>
              <CardDescription>
                {editingId
                  ? "Update the component details"
                  : "Add a new Figma component to your library"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access_level">Access Level *</Label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="access_level"
                        value="free"
                        checked={formData.access_level === "free"}
                        onChange={(e) =>
                          setFormData({ ...formData, access_level: e.target.value as "free" | "paid" })
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Free (accessible to all users)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="access_level"
                        value="paid"
                        checked={formData.access_level === "paid"}
                        onChange={(e) =>
                          setFormData({ ...formData, access_level: e.target.value as "free" | "paid" })
                        }
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Paid (Pro users only)</span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose whether this component is free for all users or requires a Pro subscription
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Component Screenshot *</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="cursor-pointer"
                      />
                      {uploading && (
                        <span className="text-sm text-muted-foreground">
                          Uploading...
                        </span>
                      )}
                    </div>
                    {uploadPreview && (
                      <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={normalizeImageUrl(uploadPreview)}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => {
                        // Clean up the URL - decode if it's encoded
                        let url = e.target.value.trim()
                        try {
                          // If URL is encoded, decode it
                          if (url.includes('%')) {
                            url = decodeURIComponent(url)
                          }
                        } catch (err) {
                          // If decoding fails, use original
                          console.log('URL decode failed, using original')
                        }
                        setFormData({ ...formData, image_url: url })
                      }}
                      placeholder="Or enter image URL manually"
                      required
                    />
                    {formData.image_url && !formData.image_url.startsWith('/') && !formData.image_url.startsWith('http') && (
                      <p className="text-xs text-red-500">
                        ⚠️ URL should start with / (for local) or http:// / https:// (for external)
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload an image file or enter the URL manually (must start with / or http:// or https://)
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="clipboard_string">Light Mode Clipboard String *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          // Request clipboard read permission
                          const clipboardItems = await navigator.clipboard.read()
                          const formats: Record<string, string> = {}
                          const formatDetails: string[] = []
                          
                          for (const item of clipboardItems) {
                            for (const type of item.types) {
                              formatDetails.push(`Found format: ${type}`)
                              try {
                                const blob = await item.getType(type)
                                const text = await blob.text()
                                formats[type] = text
                                formatDetails.push(`  Length: ${text.length} chars`)
                                formatDetails.push(`  Preview: ${text.substring(0, 100)}...`)
                              } catch (err) {
                                formatDetails.push(`  Error reading ${type}: ${err}`)
                                console.error(`Failed to read ${type}:`, err)
                              }
                            }
                          }
                          
                          console.log('Clipboard formats found:', formatDetails)
                          setClipboardFormats(formats)
                          
                          // Figma uses HTML format for clipboard! Prioritize text/html over text/plain
                          let bestFormat = formats['text/html'] || formats['text/plain']
                          
                          // Look for Figma-specific formats
                          const figmaFormats = Object.keys(formats).filter(f => 
                            f.includes('figma') || 
                            f.includes('application') ||
                            f.includes('json')
                          )
                          
                          if (figmaFormats.length > 0) {
                            bestFormat = formats[figmaFormats[0]]
                            alert(`Found ${figmaFormats.length} potential Figma format(s)! Using: ${figmaFormats[0]}\n\nAll formats:\n${Object.keys(formats).join('\n')}`)
                          } else if (formats['text/html']) {
                            bestFormat = formats['text/html']
                            alert(`✅ Found HTML format! This is what Figma uses.\n\nCaptured formats:\n${Object.keys(formats).join('\n')}`)
                          } else if (formats['text/plain']) {
                            bestFormat = formats['text/plain']
                            alert(`⚠️ Only found text/plain. Figma prefers HTML format.\n\nAvailable formats:\n${Object.keys(formats).join('\n')}\n\nTry: Copy from Figma → Use clipboard inspector → Look for "text/html" format`)
                          } else {
                            alert(`No usable format found. Available formats:\n${Object.keys(formats).join('\n')}`)
                            return
                          }
                          
                          if (bestFormat) {
                            setFormData({
                              ...formData,
                              clipboard_string: bestFormat,
                            })
                            setShowClipboardCapture(true)
                          }
                        } catch (err) {
                          console.error('Failed to read clipboard:', err)
                          alert(`Failed to read clipboard: ${err}\n\nPossible reasons:\n1. Clipboard permissions not granted\n2. Nothing copied to clipboard\n3. Figma uses a format not accessible via web APIs\n\nTry: Copy from Figma → Use clipboard inspector tool → Copy the text/plain value manually`)
                        }
                      }}
                    >
                      📋 Capture from Clipboard
                    </Button>
                  </div>
                  {showClipboardCapture && Object.keys(clipboardFormats).length > 0 && (
                    <div className="rounded-md bg-muted p-2 text-xs">
                      <p className="font-semibold mb-1">Captured formats:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {Object.keys(clipboardFormats).map((format) => (
                          <li key={format}>{format}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Textarea
                    id="clipboard_string"
                    value={formData.clipboard_string}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clipboard_string: e.target.value,
                      })
                    }
                    placeholder="Click 'Capture from Clipboard' button after copying from Figma, or paste manually here"
                    rows={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Dark Mode Clipboard String (Optional)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            const clipboardItems = await navigator.clipboard.read()
                            const formats: Record<string, string> = {}
                            
                            for (const item of clipboardItems) {
                              for (const type of item.types) {
                                try {
                                  const blob = await item.getType(type)
                                  const text = await blob.text()
                                  formats[type] = text
                                } catch (err) {
                                  console.error(`Failed to read ${type}:`, err)
                                }
                              }
                            }
                            
                            let bestFormat = formats['text/html'] || formats['text/plain']
                            
                            if (formats['text/html']) {
                              bestFormat = formats['text/html']
                              alert(`✅ Found HTML format for dark mode!`)
                            } else if (formats['text/plain']) {
                              bestFormat = formats['text/plain']
                              alert(`⚠️ Only found text/plain for dark mode.`)
                            } else {
                              alert(`No usable format found.`)
                              return
                            }
                            
                            if (bestFormat) {
                              setFormData({
                                ...formData,
                                clipboard_string_dark: bestFormat,
                              })
                            }
                          } catch (err) {
                            console.error('Failed to read clipboard:', err)
                            alert(`Failed to read clipboard: ${err}`)
                          }
                        }}
                      >
                        📋 Capture Dark Mode
                      </Button>
                    </div>
                    <Textarea
                      id="clipboard_string_dark"
                      value={formData.clipboard_string_dark}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clipboard_string_dark: e.target.value,
                        })
                      }
                      placeholder="Paste dark mode clipboard string here (optional)"
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      If provided, users can toggle between light and dark versions
                    </p>
                  </div>
                  <div className="space-y-2 rounded-md bg-muted p-3 text-xs">
                    <p className="font-semibold">📋 How to Capture Figma Clipboard Data</p>
                    <p className="text-muted-foreground">
                      Figma uses <strong>HTML format</strong> for clipboard data. Use this workflow:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Copy component in Figma (Cmd/Ctrl + C)</li>
                      <li>Open <a href="https://evercoder.github.io/clipboard-inspector/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Clipboard Inspector</a> in a new tab</li>
                      <li>Paste in the inspector (Cmd/Ctrl + V)</li>
                      <li>Find the <strong>&quot;text/html&quot;</strong> section (this is what Figma uses!)</li>
                      <li>If text/html is not available, use <strong>&quot;text/plain&quot;</strong> as fallback</li>
                      <li>Click the copy button next to the value</li>
                      <li>Come back here and paste into the textarea above</li>
                    </ol>
                    <p className="text-muted-foreground mt-2">
                      <strong>Tip:</strong> The &quot;Capture from Clipboard&quot; button will try to get the HTML format automatically, but manual copy from clipboard inspector is more reliable.
                    </p>
                  </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update" : "Add"} Component
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Components List */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Components ({components.length})
            </h2>
            <div className="space-y-4">
              {components.map((component) => (
                <Card key={component.id}>
                  <div className="flex gap-4">
                    <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={normalizeImageUrl(component.image_url)}
                        alt={component.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // If image fails to load, show placeholder
                          console.error('Image load error:', component.image_url)
                          e.currentTarget.src = '/figma-components/placeholder.svg'
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{component.name}</CardTitle>
                        {component.description && (
                          <CardDescription className="line-clamp-2">
                            {component.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(component)}
                          >
                            <Edit2 className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(component.id)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
              {components.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No components yet. Add your first component using the form.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

