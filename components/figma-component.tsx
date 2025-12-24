"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Check, Copy, Moon, Sun, Crown, Eye, X, Sparkles } from "lucide-react"
import { normalizeImageUrl } from "@/lib/image-url"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
    category?: string
    platform?: "web" | "dashboard" | "mobile"
  }
  userPlan?: "free" | "paid"
}

export function FigmaComponent({ component, userPlan = "free" }: FigmaComponentProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeError, setUpgradeError] = useState("")
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly")
  
  // Determine if dark mode is available - requires BOTH image and clipboard
  const hasDarkMode = !!(component.clipboardStringDark && component.imageUrlDark)
  
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
    
    // First, check if user is logged in
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // User is not logged in - redirect to signup
      setUpgradeLoading(false)
      setShowPricingModal(false)
      router.push('/signup?redirect=/&upgrade=pro')
      return
    }
    
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
        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          setUpgradeLoading(false)
          setShowPricingModal(false)
          router.push('/signup?redirect=/&upgrade=pro')
          return
        }
        
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
      <Card className="overflow-hidden border-border/50 cursor-pointer hover:border-primary/50 transition-colors" data-component-id={component.id}>
        <div className="relative aspect-video bg-muted cursor-pointer" onClick={() => setShowPreviewModal(true)}>
          <Image
            src={normalizeImageUrl(currentImageUrl)}
            alt={component.name}
            fill
            className="object-cover"
            loading="lazy"
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // If image fails to load, show placeholder
              console.error('Image load error:', currentImageUrl)
              e.currentTarget.src = '/figma-components/placeholder.svg'
            }}
          />
          {/* PRO badge - show for paid components */}
          {component.accessLevel === "paid" && (
            <div className="absolute top-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-1 z-20 cursor-default pointer-events-none">
              <span className="text-xs font-semibold text-primary-foreground">PRO</span>
            </div>
          )}
          {/* Dark mode toggle - show for all components with dark mode */}
          {hasDarkMode && (
            <div 
              className="absolute top-2 right-2 flex items-center gap-2 rounded-md bg-background/80 backdrop-blur-sm px-2 py-1.5 z-20 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
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
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{component.name}</h3>
            {component.category && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {component.category}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3" />
              <span>{component.category || "Component"}</span>
            </div>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                onClick={() => setShowPreviewModal(true)}
                size="sm"
                variant="outline"
                className="h-8 cursor-pointer"
              >
                <Eye className="mr-1 h-3 w-3" />
                Preview
              </Button>
              <Button
                onClick={handleCopy}
                size="sm"
                variant={copied ? "default" : "outline"}
                className="h-8 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    {/* Pricing Modal */}
    <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
      <DialogContent className="sm:max-w-[640px] max-h-[85vh] p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2 max-h-[85vh]">
          {/* Left Side - Image */}
          <div className="hidden md:block relative bg-gradient-to-br from-blue-50 to-purple-50">
            <Image
              src="https://maxst.icons8.com/vue-static/illustrations/paywall/paywall.webp"
              alt="Subscription"
              fill
              className="object-contain p-6"
              priority
            />
          </div>

          {/* Right Side - Pricing Details */}
          <div className="p-6 overflow-y-auto max-h-[85vh]">
            <DialogHeader className="space-y-2 pb-4">
              <DialogTitle className="text-2xl font-bold">Subscription</DialogTitle>
              <DialogDescription className="text-sm">
                Unlock all premium components and features
              </DialogDescription>
            </DialogHeader>

            {/* Features List */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">100+ Premium Components</p>
                  <p className="text-xs text-muted-foreground">Access to all Pro components</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Light & Dark Mode</p>
                  <p className="text-xs text-muted-foreground">All components in both themes</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Unlimited Downloads</p>
                  <p className="text-xs text-muted-foreground">Copy as many components as you need</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">No Watermark</p>
                  <p className="text-xs text-muted-foreground">Clean components ready for production</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Priority Support</p>
                  <p className="text-xs text-muted-foreground">Get help when you need it</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Commercial Use</p>
                  <p className="text-xs text-muted-foreground">Use in client projects</p>
                </div>
              </li>
            </ul>

            {/* Billing Period Tabs */}
            <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly (-20%)</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Price Display */}
            <div className="mb-4">
              {billingPeriod === "monthly" ? (
                <>
                  <p className="text-3xl font-bold mb-1">${(9).toFixed(0)}/month</p>
                  <p className="text-sm text-muted-foreground">billed monthly</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold mb-1">${(9 * 0.8).toFixed(0)}/month</p>
                  <p className="text-sm text-muted-foreground">billed yearly (${(9 * 0.8 * 12).toFixed(0)}/year)</p>
                </>
              )}
            </div>

            {/* Error Message */}
            {upgradeError && (
              <div className="rounded-md bg-destructive/15 border border-destructive/50 p-2 mb-4">
                <p className="text-xs text-destructive">{upgradeError}</p>
              </div>
            )}

            {/* Subscribe Button */}
            <Button 
              onClick={handleUpgrade} 
              className="w-full h-11 text-sm font-semibold" 
              disabled={upgradeLoading}
            >
              {upgradeLoading ? (
                "Loading..."
              ) : (
                <>
                  Subscribe for ${billingPeriod === "monthly" ? "9/month" : `${(9 * 0.8 * 12).toFixed(0)}/year`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-[806px] w-[calc(100vw-2rem)] sm:max-w-[63vw] max-h-[90vh] p-0 gap-0 overflow-hidden [&>button]:hidden">
          <div className="relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm p-2 hover:bg-background transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>

            {/* PRO Badge - only show if paid component */}
            {component.accessLevel === "paid" && (
              <div className="absolute top-4 left-4 z-50 rounded-md bg-primary/90 backdrop-blur-sm px-3 py-1.5">
                <span className="text-xs font-semibold text-primary-foreground">PRO</span>
              </div>
            )}

            {/* Preview Image */}
            <div className="relative w-full aspect-video bg-muted max-h-[60vh]">
              <Image
                src={normalizeImageUrl(currentImageUrl)}
                alt={component.name}
                fill
                className="object-contain"
                priority
                quality={90}
                sizes="(max-width: 768px) calc(100vw - 2rem), 63vw"
                onError={(e) => {
                  console.error('Image load error:', currentImageUrl)
                  e.currentTarget.src = '/figma-components/placeholder.svg'
                }}
              />
            </div>

            {/* Dark Mode Toggle in Preview - if available */}
            {hasDarkMode && (
              <div className="absolute top-4 right-16 z-50 flex items-center gap-2 rounded-md bg-background/80 backdrop-blur-sm px-3 py-1.5">
                <Sun className={`h-4 w-4 ${!isDarkMode ? 'text-foreground' : 'text-muted-foreground'}`} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                  id={`preview-theme-${component.id}`}
                />
                <Moon className={`h-4 w-4 ${isDarkMode ? 'text-foreground' : 'text-muted-foreground'}`} />
              </div>
            )}

            {/* Footer with Component Info and Copy Button */}
            <div className="p-6 bg-background border-t border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{component.name}</h3>
                  {component.description && (
                    <p className="text-sm text-muted-foreground">{component.description}</p>
                  )}
                  {component.category && (
                    <span className="inline-block mt-2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {component.category}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleCopy}
                  size="lg"
                  variant={copied ? "default" : "outline"}
                  className="cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Component
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

