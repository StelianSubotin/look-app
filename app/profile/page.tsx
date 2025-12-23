"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import { Check, Crown, Sparkles } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [plan, setPlan] = useState<"free" | "paid">("free")
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeError, setUpgradeError] = useState("")

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push("/login")
        return
      }
      setUser(user)
      // TODO: Fetch actual plan from database
      setPlan(user.user_metadata?.plan || "free")
      setLoading(false)
    })
  }, [router])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError("")
    setPasswordSuccess(false)

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      setPasswordLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        setPasswordError(error.message)
      } else {
        setPasswordSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordSuccess(false), 3000)
      }
    } catch (err) {
      setPasswordError("Failed to update password")
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    setUpgradeError("")
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: 'pro' }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to create checkout session'
        setUpgradeError(errorMessage)
        console.error('Checkout API error:', errorMessage)
        setUpgradeLoading(false)
        return
      }

      // Redirect to LemonSqueezy checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        setUpgradeError('No checkout URL received')
        setUpgradeLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setUpgradeError('Failed to start checkout. Please try again.')
      setUpgradeLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and subscription
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input value={user?.id || ""} disabled className="text-xs font-mono" />
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {passwordError && (
                  <div className="rounded-md bg-destructive/15 border border-destructive/50 p-3">
                    <p className="text-sm text-destructive">{passwordError}</p>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="rounded-md bg-green-500/15 border border-green-500/50 p-3">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Password updated successfully!
                    </p>
                  </div>
                )}
                <Button type="submit" disabled={passwordLoading} className="w-full">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Pricing Plans</CardTitle>
              <CardDescription>Choose the plan that works for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Free Plan */}
                <Card className={plan === "free" ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Free</CardTitle>
                      {plan === "free" && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">$0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Access to all components</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Copy to Figma</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Light & Dark mode</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Limited downloads</span>
                      </li>
                    </ul>
                    {plan === "free" ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        Downgrade
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Paid Plan */}
                <Card className={plan === "paid" ? "border-primary" : "border-2"}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        Pro
                      </CardTitle>
                      {plan === "paid" && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          Current Plan
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">$9</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Everything in Free</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Unlimited downloads</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Priority support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">Early access to new features</span>
                      </li>
                    </ul>
                    {plan === "paid" ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        {upgradeError && (
                          <div className="rounded-md bg-destructive/15 border border-destructive/50 p-2">
                            <p className="text-xs text-destructive">{upgradeError}</p>
                          </div>
                        )}
                        <Button 
                          onClick={handleUpgrade} 
                          className="w-full" 
                          disabled={upgradeLoading}
                        >
                          <Crown className="mr-2 h-4 w-4" />
                          {upgradeLoading ? "Loading..." : "Upgrade to Pro"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

