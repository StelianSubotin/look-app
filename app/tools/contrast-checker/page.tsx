"use client"

import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeftRight, Copy, Check, Info, Upload, Sparkles, 
  AlertTriangle, AlertCircle, CheckCircle2, XCircle,
  Eye, Target, Palette, Type, MousePointer, Loader2
} from "lucide-react"
import {
  getContrastRatio,
  formatRatio,
  checkWCAGCompliance,
  getComplianceGrade,
  isValidHex,
  normalizeHex,
} from "@/lib/contrast-checker"
import Image from "next/image"

interface AccessibilityIssue {
  type: 'contrast' | 'touch-target' | 'color-only' | 'text-size' | 'focus' | 'other'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  title: string
  description: string
  wcagCriteria?: string
  location?: string
  suggestion?: string
}

interface AnalysisResult {
  overallScore: number
  issues: AccessibilityIssue[]
  summary: string
  positives: string[]
}

export default function ContrastCheckerPage() {
  // Manual checker state
  const [foreground, setForeground] = useState("#000000")
  const [background, setBackground] = useState("#FFFFFF")
  const [foregroundInput, setForegroundInput] = useState("#000000")
  const [backgroundInput, setBackgroundInput] = useState("#FFFFFF")
  const [copiedFg, setCopiedFg] = useState(false)
  const [copiedBg, setCopiedBg] = useState(false)

  // AI analyzer state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
      setImageUrl("")
      setAnalysisResult(null)
      setAnalysisError(null)
    }
    reader.readAsDataURL(file)
  }

  // Analyze image
  const analyzeImage = async () => {
    if (!uploadedImage && !imageUrl) return

    setIsAnalyzing(true)
    setAnalysisError(null)
    setAnalysisResult(null)

    try {
      const body: { imageBase64?: string; imageUrl?: string } = {}
      
      if (uploadedImage) {
        // Extract base64 data from data URL
        const base64 = uploadedImage.split(',')[1]
        body.imageBase64 = base64
      } else if (imageUrl) {
        body.imageUrl = imageUrl
      }

      const response = await fetch('/api/accessibility/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisError(error instanceof Error ? error.message : 'Failed to analyze image')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get icon for issue type
  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'contrast': return <Palette className="h-4 w-4" />
      case 'touch-target': return <Target className="h-4 w-4" />
      case 'color-only': return <Eye className="h-4 w-4" />
      case 'text-size': return <Type className="h-4 w-4" />
      case 'focus': return <MousePointer className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'serious': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'minor': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Contrast Checker</h1>
          <p className="text-lg text-muted-foreground">
            Check color contrast ratios and analyze interfaces for WCAG compliance
          </p>
        </div>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="manual" className="gap-2">
              <Palette className="h-4 w-4" />
              Manual Check
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Analyzer
            </TabsTrigger>
          </TabsList>

          {/* Manual Contrast Checker Tab */}
          <TabsContent value="manual">
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
          </TabsContent>

          {/* AI Analyzer Tab */}
          <TabsContent value="ai">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Image Upload */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      AI Accessibility Analyzer
                    </CardTitle>
                    <CardDescription>
                      Upload a screenshot of your interface for AI-powered WCAG analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload Area */}
                    <div 
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer hover:border-primary/50 hover:bg-muted/50 ${
                        uploadedImage ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                            <Image
                              src={uploadedImage}
                              alt="Uploaded interface"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click to upload a different image
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">Drop your screenshot here</p>
                            <p className="text-sm text-muted-foreground">
                              or click to browse
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Or URL */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or paste image URL
                        </span>
                      </div>
                    </div>

                    <Input
                      placeholder="https://example.com/screenshot.png"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value)
                        if (e.target.value) {
                          setUploadedImage(null)
                          setAnalysisResult(null)
                          setAnalysisError(null)
                        }
                      }}
                    />

                    {/* Analyze Button */}
                    <Button
                      className="w-full gap-2"
                      size="lg"
                      onClick={analyzeImage}
                      disabled={(!uploadedImage && !imageUrl) || isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Analyzing Interface...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze for Accessibility
                        </>
                      )}
                    </Button>

                    {/* Error Display */}
                    {analysisError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                        <div>
                          <p className="font-medium text-red-800">Analysis Failed</p>
                          <p className="text-sm text-red-600">{analysisError}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Info about AI analysis */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                      <div className="text-sm space-y-2">
                        <p className="font-medium">What the AI Checks</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• <strong>Color Contrast</strong>: Text and UI element visibility</li>
                          <li>• <strong>Touch Targets</strong>: Button and link sizes (44x44px min)</li>
                          <li>• <strong>Color Independence</strong>: Info not conveyed by color alone</li>
                          <li>• <strong>Text Size</strong>: Readability and scaling</li>
                          <li>• <strong>Focus Indicators</strong>: Keyboard navigation visibility</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Results */}
              <div className="space-y-6">
                {analysisResult ? (
                  <>
                    {/* Score Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Accessibility Score</CardTitle>
                        <CardDescription>Based on WCAG 2.1 guidelines</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-4">
                          <div className={`text-7xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                            {analysisResult.overallScore}
                          </div>
                          <p className="text-muted-foreground mt-2">out of 100</p>
                          
                          {/* Progress bar */}
                          <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                analysisResult.overallScore >= 90 ? 'bg-green-500' :
                                analysisResult.overallScore >= 70 ? 'bg-yellow-500' :
                                analysisResult.overallScore >= 50 ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${analysisResult.overallScore}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{analysisResult.summary}</p>
                        
                        {analysisResult.positives && analysisResult.positives.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="font-medium text-green-700 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              What&apos;s Working Well
                            </p>
                            <ul className="space-y-1">
                              {analysisResult.positives.map((positive, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                  {positive}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Issues */}
                    {analysisResult.issues && analysisResult.issues.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                            Issues Found ({analysisResult.issues.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {analysisResult.issues.map((issue, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  {getIssueIcon(issue.type)}
                                  <span className="font-medium">{issue.title}</span>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getSeverityColor(issue.severity)}`}>
                                  {issue.severity}
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">{issue.description}</p>
                              
                              {issue.location && (
                                <p className="text-xs text-muted-foreground">
                                  <strong>Location:</strong> {issue.location}
                                </p>
                              )}
                              
                              {issue.wcagCriteria && (
                                <p className="text-xs">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                    {issue.wcagCriteria}
                                  </span>
                                </p>
                              )}
                              
                              {issue.suggestion && (
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                  <p className="text-sm text-green-800">
                                    <strong>💡 Suggestion:</strong> {issue.suggestion}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="h-full min-h-[400px] flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                        <Eye className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Upload a screenshot of your interface to get a comprehensive WCAG accessibility report
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
