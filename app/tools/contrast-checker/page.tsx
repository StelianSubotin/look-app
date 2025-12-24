"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, Copy, Check, Info } from "lucide-react"
import {
  getContrastRatio,
  formatRatio,
  checkWCAGCompliance,
  getComplianceGrade,
  isValidHex,
  normalizeHex,
} from "@/lib/contrast-checker"

export default function ContrastCheckerPage() {
  const [foreground, setForeground] = useState("#000000")
  const [background, setBackground] = useState("#FFFFFF")
  const [foregroundInput, setForegroundInput] = useState("#000000")
  const [backgroundInput, setBackgroundInput] = useState("#FFFFFF")
  const [copiedFg, setCopiedFg] = useState(false)
  const [copiedBg, setCopiedBg] = useState(false)

  // Calculate contrast ratio
  const ratio = getContrastRatio(foreground, background)
  const compliance = checkWCAGCompliance(ratio)
  const grade = getComplianceGrade(ratio)

  // Update colors when valid hex is entered
  useEffect(() => {
    if (isValidHex(foregroundInput)) {
      setForeground(normalizeHex(foregroundInput))
    }
  }, [foregroundInput])

  useEffect(() => {
    if (isValidHex(backgroundInput)) {
      setBackground(normalizeHex(backgroundInput))
    }
  }, [backgroundInput])

  const swapColors = () => {
    const tempFg = foreground
    const tempFgInput = foregroundInput
    setForeground(background)
    setForegroundInput(backgroundInput)
    setBackground(tempFg)
    setBackgroundInput(tempFgInput)
  }

  const copyToClipboard = async (color: string, isForeground: boolean) => {
    try {
      await navigator.clipboard.writeText(color)
      if (isForeground) {
        setCopiedFg(true)
        setTimeout(() => setCopiedFg(false), 2000)
      } else {
        setCopiedBg(true)
        setTimeout(() => setCopiedBg(false), 2000)
      }
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Contrast Checker</h1>
          <p className="text-lg text-muted-foreground">
            Check color contrast ratios and WCAG compliance for accessible designs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Color Inputs & Preview */}
          <div className="space-y-6">
            {/* Color Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
                <CardDescription>Enter your foreground and background colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foreground Color */}
                <div className="space-y-3">
                  <Label htmlFor="foreground">Foreground (Text)</Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="foreground"
                        type="text"
                        value={foregroundInput}
                        onChange={(e) => setForegroundInput(e.target.value.toUpperCase())}
                        placeholder="#000000"
                        className="pr-10 font-mono"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => copyToClipboard(foreground, true)}
                      >
                        {copiedFg ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <input
                        type="color"
                        value={foreground}
                        onChange={(e) => {
                          setForeground(e.target.value)
                          setForegroundInput(e.target.value.toUpperCase())
                        }}
                        className="h-10 w-20 rounded border border-input cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapColors}
                    className="gap-2"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    Swap Colors
                  </Button>
                </div>

                {/* Background Color */}
                <div className="space-y-3">
                  <Label htmlFor="background">Background</Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        id="background"
                        type="text"
                        value={backgroundInput}
                        onChange={(e) => setBackgroundInput(e.target.value.toUpperCase())}
                        placeholder="#FFFFFF"
                        className="pr-10 font-mono"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => copyToClipboard(background, false)}
                      >
                        {copiedBg ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <input
                        type="color"
                        value={background}
                        onChange={(e) => {
                          setBackground(e.target.value)
                          setBackgroundInput(e.target.value.toUpperCase())
                        }}
                        className="h-10 w-20 rounded border border-input cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your colors look together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Normal Text */}
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: background, color: foreground }}
                >
                  <p className="text-base mb-2">
                    The quick brown fox jumps over the lazy dog
                  </p>
                  <p className="text-sm text-opacity-80" style={{ color: foreground }}>
                    Normal text (16px) - Body copy and paragraphs
                  </p>
                </div>

                {/* Large Text */}
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: background, color: foreground }}
                >
                  <p className="text-2xl font-bold mb-2">
                    Large Heading Text
                  </p>
                  <p className="text-sm text-opacity-80" style={{ color: foreground }}>
                    Large text (18.7px+ or 14px+ bold) - Headings and titles
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Contrast Ratio */}
            <Card>
              <CardHeader>
                <CardTitle>Contrast Ratio</CardTitle>
                <CardDescription>WCAG 2.0 calculated ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-6xl font-bold mb-4">
                    {formatRatio(ratio)}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      backgroundColor: grade === 'AAA' ? '#10b981' : grade === 'AA' ? '#3b82f6' : '#ef4444',
                      color: 'white'
                    }}
                  >
                    {grade === 'FAIL' ? 'FAILS WCAG' : `WCAG ${grade}`}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WCAG Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>WCAG Compliance</CardTitle>
                <CardDescription>Accessibility standards check</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AA Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Level AA</span>
                    <span className="text-sm text-muted-foreground">Minimum standard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border-2 ${compliance.AA.normal ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Normal Text</span>
                        {compliance.AA.normal ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-red-600 text-xs font-bold">✕</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">4.5:1 required</span>
                    </div>
                    <div className={`p-3 rounded-lg border-2 ${compliance.AA.large ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Large Text</span>
                        {compliance.AA.large ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-red-600 text-xs font-bold">✕</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">3:1 required</span>
                    </div>
                  </div>
                </div>

                {/* AAA Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Level AAA</span>
                    <span className="text-sm text-muted-foreground">Enhanced standard</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-lg border-2 ${compliance.AAA.normal ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Normal Text</span>
                        {compliance.AAA.normal ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-red-600 text-xs font-bold">✕</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">7:1 required</span>
                    </div>
                    <div className={`p-3 rounded-lg border-2 ${compliance.AAA.large ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Large Text</span>
                        {compliance.AAA.large ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-red-600 text-xs font-bold">✕</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">4.5:1 required</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-medium">About WCAG Standards</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• <strong>Level AA</strong>: Industry standard for web accessibility</li>
                      <li>• <strong>Level AAA</strong>: Enhanced accessibility for critical content</li>
                      <li>• <strong>Large text</strong>: 18.7px+ regular or 14px+ bold</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

