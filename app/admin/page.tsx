"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
          setIsAuthenticated(true)
        } else {
          router.push("/components")
        }
      } else {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogin = () => {
    const adminPassword = "admin123"
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
    } else {
      alert("Incorrect password")
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
      <div className="min-h-screen bg-background">
        <Navbar />
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your Figma components library
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/admin/create")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Component</CardTitle>
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardDescription>
                Add a new Figma component to your library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Create New Component
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/admin/manage")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Components</CardTitle>
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardDescription>
                View, edit, and delete existing components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Manage Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
