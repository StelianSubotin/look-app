"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Check, Copy, Moon, Sun, Lock } from "lucide-react"
import { normalizeImageUrl } from "@/lib/image-url"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
  
  // Determine if dark mode is available
  const hasDarkMode = !!component.clipboardStringDark
  
  // Check if component is locked (paid component for free user)
  const isLocked = component.accessLevel === "paid" && userPlan !== "paid"
  
  // Get current clipboard string based on mode
  const currentClipboardString = isDarkMode && hasDarkMode 
    ? component.clipboardStringDark! 
    : component.clipboardString
    
  // Get current image URL based on mode
  const currentImageUrl = isDarkMode && component.imageUrlDark 
    ? component.imageUrlDark 
    : component.imageUrl

  const handleCopy = async () => {
    // If locked, redirect to upgrade
    if (isLocked) {
      window.location.href = "/profile"
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
    <Card className={`overflow-hidden ${isLocked ? 'opacity-75' : ''}`} data-component-id={component.id}>
      <div className="relative aspect-video bg-muted">
        <Image
          src={normalizeImageUrl(currentImageUrl)}
          alt={component.name}
          fill
          className={`object-cover ${isLocked ? 'blur-sm' : ''}`}
          onError={(e) => {
            // If image fails to load, show placeholder
            console.error('Image load error:', currentImageUrl)
            e.currentTarget.src = '/figma-components/placeholder.svg'
          }}
        />
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10">
            <div className="text-center p-4">
              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-semibold mb-1">Pro Component</p>
              <p className="text-xs text-muted-foreground">Upgrade to unlock</p>
            </div>
          </div>
        )}
        {hasDarkMode && !isLocked && (
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
        {component.accessLevel === "paid" && !isLocked && (
          <div className="absolute top-2 left-2 rounded-md bg-primary/90 backdrop-blur-sm px-2 py-1 z-20">
            <span className="text-xs font-semibold text-primary-foreground">PRO</span>
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
          variant={copied ? "default" : isLocked ? "default" : "outline"}
          disabled={isLocked}
        >
          {isLocked ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </>
          ) : copied ? (
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
  )
}

