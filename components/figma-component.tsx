"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Check, Copy, Moon, Sun, Crown } from "lucide-react"
import { normalizeImageUrl } from "@/lib/image-url"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FigmaComponentProps {
  component: {
    id: string
    name: string
    description?: string
    imageUrl: string
    clipboardString: string
    clipboardStringDark?: string
    imageUrlDark?: string
    accessLevel?: "free" | "paid"
  }
  userPlan?: "free" | "paid"
}

export function FigmaComponent({ component, userPlan = "free" }: FigmaComponentProps) {
  const [copied, setCopied] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeError, setUpgradeError] = useState("")
  
  // Determine if dark mode is available
  const hasDarkMode = !!component.clipboardStringDark
  
  // Check if component requires paid access (paid component for free user)
  const requiresPaidAccess = component.accessLevel === "paid" && userPlan !== "paid"
  
  // Get current clipboard string based on mode
  const currentClipboardString = isDarkMode && hasDarkMode 
    ? component.clipboardStringDark! 
    : component.clipboardString
    
  // Get current image URL based on mode
  const currentImageUrl = isDarkMode && component.imageUrlDark 
    ? component.imageUrlDark 
    : component.imageUrl

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

  const handleCopy = async () => {
    // If requires paid access, show pricing modal instead
    if (requiresPaidAccess) {
      setShowPricingModal(true)
      return
    }
    
    try {
      const clipboardString = currentClipboardString.trim()
      
      console.log('Copying to clipboard:', {
        length: clipboardString.length,
        preview: clipboardString.substring(0, 100),
        isHTML: clipboardString.trim().startsWith('<') || clipboardString.includes('<html'),
      })
      
      // Figma uses HTML format! Write as both text/html and text/plain
      // This is how tools like figcomponent.com do it
      try {
        const clipboardItem = new ClipboardItem({
          // Figma expects HTML format
          'text/html': new Blob([clipboardString], { type: 'text/html' }),
          // Also include plain text as fallback
          'text/plain': new Blob([clipboardString], { type: 'text/plain' }),
        })
        await navigator.clipboard.write([clipboardItem])
        console.log('✅ Successfully wrote using ClipboardItem with HTML format')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        
        // Verify what was written
        try {
          const clipboardItems = await navigator.clipboard.read()
          for (const item of clipboardItems) {
            console.log('Clipboard now contains types:', item.types)
            if (item.types.includes('text/html')) {
              console.log('✅ HTML format is present - Figma should accept this!')
            }
          }
        } catch (verifyErr) {
          console.log('Could not verify clipboard (permissions):', verifyErr)
        }
        
        return
      } catch (clipboardItemErr) {
        console.log("ClipboardItem method failed:", clipboardItemErr)
      }

      // Method 2: Fallback to plain text (less likely to work with Figma)
      await navigator.clipboard.writeText(clipboardString)
      console.log('⚠️ Wrote using writeText (plain text only - may not work with Figma)')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("All copy methods failed:", err)
      alert(
        `Failed to copy automatically.\n\n` +
        `Error: ${err}\n\n` +
        `Please try:\n` +
        `1. Check browser console for details\n` +
        `2. Manually copy the clipboard string from the admin panel\n` +
        `3. Make sure you have clipboard permissions`
      )
    }
  }

  return (
    <>
      <Card className="overflow-hidden" data-component-id={component.id}>
        <div className="relative aspect-video bg-muted">
          <Image
            src={normalizeImageUrl(currentImageUrl)}
            alt={component.name}
            fill
            className="object-cover"
            onError={(e) => {
              // If image fails to load, show placeholder
              console.error('Image load error:', currentImageUrl)
              e.currentTarget.src = '/figma-components/placeholder.svg'
            }}
          />
          {/* PRO badge - show for paid components */}
          {component.accessLevel === "paid" && (
            <div className="absolute top-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-1 z-20">
              <span className="text-xs font-semibold text-primary-foreground">PRO</span>
            </div>
          )}
          {/* Dark mode toggle - show for all components with dark mode */}
          {hasDarkMode && (
            <div className="absolute top-2 right-2 flex items-center gap-2 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1.5 z-20">
              <Sun className={`h-3.5 w-3.5 ${!isDarkMode ? 'text-foreground' : 'text-muted-foreground'}`} />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                id={`theme-${component.id}`}
              />
              <Moon className={`h-3.5 w-3.5 ${isDarkMode ? 'text-foreground' : 'text-muted-foreground'}`} />
            </div>
          )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{component.name}</CardTitle>
        {component.description && (
          <CardDescription>{component.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={handleCopy}
          className="w-full"
          variant={copied ? "default" : "outline"}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy in Figma
            </>
          )}
        </Button>
      </CardContent>
    </Card>

    {/* Pricing Modal */}
    <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            This component is available for Pro users. Upgrade to unlock all Pro components.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Pricing Table */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Free Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Free</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Access to free components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Copy to Figma</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Light & Dark mode</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary border-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Pro
                </CardTitle>
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
                    <span className="text-sm">Access to all Pro components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Unlimited downloads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

