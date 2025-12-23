"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { normalizeImageUrl } from "@/lib/image-url"
import { createClient } from "@/lib/supabase-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

export default function EditComponentPage() {
  const router = useRouter()
  const params = useParams()
  const componentId = params.id as string
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
  const [uploadingDark, setUploadingDark] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadPreviewDark, setUploadPreviewDark] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const isAdmin = user.user_metadata?.is_admin === true || 
                       user.email === "stelsubotin@gmail.com"
        
        if (!isAdmin) {
          router.push("/components")
          return
        }
      } else {
        router.push("/login")
        return
      }

      // Fetch component data
      try {
        const response = await fetch(`/api/components/${componentId}`)
        if (response.ok) {
          const component = await response.json() as Component & {
            clipboard_string_dark?: string
            image_url_dark?: string
          }
          setFormData({
            name: component.name,
            description: component.description || "",
            image_url: component.image_url,
            clipboard_string: component.clipboard_string,
            clipboard_string_dark: component.clipboard_string_dark || "",
            image_url_dark: component.image_url_dark || "",
            access_level: component.access_level || "free",
          })
          setUploadPreview(component.image_url)
          if (component.image_url_dark) {
            setUploadPreviewDark(component.image_url_dark)
          }
        }
      } catch (error) {
        console.error("Failed to fetch component:", error)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [componentId, router])

  const handleImageUpload = async (file: File, isDark: boolean = false) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    if (isDark) {
      setUploadingDark(true)
    } else {
      setUploading(true)
    }

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isDark) {
          setUploadPreviewDark(reader.result as string)
        } else {
          setUploadPreview(reader.result as string)
        }
      }
      reader.readAsDataURL(file)

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
      if (isDark) {
        setFormData((prev) => ({
          ...prev,
          image_url_dark: data.path,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          image_url: data.path,
        }))
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload image')
      if (isDark) {
        setUploadPreviewDark(null)
      } else {
        setUploadPreview(null)
      }
    } finally {
      if (isDark) {
        setUploadingDark(false)
      } else {
        setUploading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const response = await fetch(`/api/components/${componentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(`Component "${formData.name}" updated successfully!`)
        setTimeout(() => {
          router.push("/admin/manage")
        }, 2000)
      } else {
        setErrorMessage(data.error || "Failed to update component")
      }
    } catch (error) {
      console.error("Failed to update component:", error)
      setErrorMessage("Failed to update component. Please try again.")
    } finally {
      setSubmitting(false)
    }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/manage")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manage
          </Button>
          <h1 className="text-3xl font-bold">Edit Component</h1>
          <p className="text-muted-foreground mt-2">
            Update component details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Component Details</CardTitle>
            <CardDescription>
              Update the details for this component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <span className="text-sm">Free</span>
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
                    <span className="text-sm">Paid</span>
                  </label>
                </div>
              </div>

              {/* Light Mode Image */}
              <div className="space-y-2">
                <Label htmlFor="image_url">Light Mode Image *</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, false)
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          {uploading ? "Uploading..." : "Upload Image"}
                        </span>
                      </Button>
                    </Label>
                    {uploadPreview && (
                      <div className="relative h-16 w-16 rounded border">
                        <Image
                          src={normalizeImageUrl(uploadPreview)}
                          alt="Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => {
                      let url = e.target.value.trim()
                      try {
                        if (url.includes('%')) url = decodeURIComponent(url)
                      } catch (err) {}
                      setFormData({ ...formData, image_url: url })
                    }}
                    required
                  />
                </div>
              </div>

              {/* Dark Mode Image */}
              <div className="space-y-2">
                <Label htmlFor="image_url_dark">Dark Mode Image (Optional)</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file, true)
                      }}
                      className="hidden"
                      id="image-upload-dark"
                    />
                    <Label htmlFor="image-upload-dark" className="cursor-pointer">
                      <Button type="button" variant="outline" disabled={uploadingDark} asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadingDark ? "Uploading..." : "Upload Dark Image"}
                        </span>
                      </Button>
                    </Label>
                    {uploadPreviewDark && (
                      <div className="relative h-16 w-16 rounded border">
                        <Image
                          src={normalizeImageUrl(uploadPreviewDark)}
                          alt="Dark Preview"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <Input
                    id="image_url_dark"
                    value={formData.image_url_dark}
                    onChange={(e) => {
                      let url = e.target.value.trim()
                      try {
                        if (url.includes('%')) url = decodeURIComponent(url)
                      } catch (err) {}
                      setFormData({ ...formData, image_url_dark: url })
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clipboard_string">Light Mode Clipboard String *</Label>
                <Textarea
                  id="clipboard_string"
                  value={formData.clipboard_string}
                  onChange={(e) =>
                    setFormData({ ...formData, clipboard_string: e.target.value })
                  }
                  required
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clipboard_string_dark">Dark Mode Clipboard String (Optional)</Label>
                <Textarea
                  id="clipboard_string_dark"
                  value={formData.clipboard_string_dark}
                  onChange={(e) =>
                    setFormData({ ...formData, clipboard_string_dark: e.target.value })
                  }
                  rows={6}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? "Updating..." : "Update Component"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/manage")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={!!successMessage} onOpenChange={() => setSuccessMessage("")}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                Success
              </DialogTitle>
              <DialogDescription>
                {successMessage}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Error Dialog */}
        <Dialog open={!!errorMessage} onOpenChange={() => setErrorMessage("")}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Error
              </DialogTitle>
              <DialogDescription>
                {errorMessage}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

