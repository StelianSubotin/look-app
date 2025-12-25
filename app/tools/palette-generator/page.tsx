"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock, Unlock, Copy, Check, Download, RefreshCw, Share2, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  generateRandomColor,
  isLightColor,
  hexToHSL,
  hslToHex,
  exportAsCSS,
  exportAsArray,
  exportAsURL,
} from "@/lib/palette-generator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface ColorState {
  color: string
  locked: boolean
}

function PaletteGeneratorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [colors, setColors] = useState<ColorState[]>([
    { color: "#FC9F5B", locked: false },
    { color: "#FBD1A2", locked: false },
    { color: "#ECE4B7", locked: false },
    { color: "#7DCFB6", locked: false },
    { color: "#33CA7F", locked: false },
  ])
  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<'css' | 'array' | 'url'>('css')
  const [exportContent, setExportContent] = useState('')

  // Load colors from URL on mount
  useEffect(() => {
    const urlColors = searchParams.get('colors')
    if (urlColors) {
      const colorArray = urlColors.split('-').map(c => `#${c}`)
      if (colorArray.length === 5 && colorArray.every(c => /^#[0-9A-F]{6}$/i.test(c))) {
        setColors(colorArray.map(color => ({ color, locked: false })))
      }
    }
  }, [searchParams])

  const generatePalette = useCallback(() => {
    setColors(prev =>
      prev.map(c => (c.locked ? c : { ...c, color: generateRandomColor() }))
    )
  }, [])

  const toggleLock = (index: number) => {
    setColors(prev =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    )
  }

  const copyColor = async (color: string, index: number) => {
    try {
      await navigator.clipboard.writeText(color)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1500)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const adjustColor = (index: number, property: 'h' | 's' | 'l', value: number) => {
    setColors(prev =>
      prev.map((c, i) => {
        if (i !== index) return c
        const hsl = hexToHSL(c.color)
        if (property === 'h') hsl.h = value
        if (property === 's') hsl.s = value
        if (property === 'l') hsl.l = value
        return { ...c, color: hslToHex(hsl.h, hsl.s, hsl.l) }
      })
    )
  }

  const handleExport = (format: 'css' | 'array' | 'url') => {
    const colorValues = colors.map(c => c.color)
    let content = ''
    
    switch (format) {
      case 'css':
        content = exportAsCSS(colorValues)
        break
      case 'array':
        content = exportAsArray(colorValues)
        break
      case 'url':
        content = exportAsURL(colorValues)
        break
    }
    
    setExportFormat(format)
    setExportContent(content)
    setShowExportDialog(true)
  }

  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportContent)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Spacebar to generate
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        generatePalette()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [generatePalette])

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold">Palette Generator</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generatePalette}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('css')}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('url')}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Color Columns */}
      <div className="flex h-full pt-16">
        {colors.map((colorState, index) => {
          const isLight = isLightColor(colorState.color)
          const hsl = hexToHSL(colorState.color)
          
          return (
            <div
              key={index}
              className="flex-1 relative group transition-all duration-300 hover:flex-[1.1]"
              style={{ backgroundColor: colorState.color }}
            >
              {/* Color Info - Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Hex Code */}
                <button
                  onClick={() => copyColor(colorState.color, index)}
                  className={`text-4xl font-bold mb-4 transition-all ${
                    isLight ? 'text-black' : 'text-white'
                  } hover:scale-110 active:scale-95`}
                  style={{ fontFamily: 'monospace' }}
                >
                  {copiedIndex === index ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-8 w-8" />
                      Copied!
                    </span>
                  ) : (
                    colorState.color
                  )}
                </button>

                {/* HSL Values */}
                <div
                  className={`text-sm ${
                    isLight ? 'text-black/70' : 'text-white/70'
                  }`}
                  style={{ fontFamily: 'monospace' }}
                >
                  HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)
                </div>
              </div>

              {/* Lock Button - Top */}
              <button
                onClick={() => toggleLock(index)}
                className={`absolute top-4 left-1/2 -translate-x-1/2 p-3 rounded-lg transition-all ${
                  isLight
                    ? 'bg-black/10 hover:bg-black/20'
                    : 'bg-white/10 hover:bg-white/20'
                } opacity-0 group-hover:opacity-100`}
              >
                {colorState.locked ? (
                  <Lock
                    className={`h-5 w-5 ${isLight ? 'text-black' : 'text-white'}`}
                  />
                ) : (
                  <Unlock
                    className={`h-5 w-5 ${isLight ? 'text-black' : 'text-white'}`}
                  />
                )}
              </button>

              {/* Copy Button - Bottom */}
              <button
                onClick={() => copyColor(colorState.color, index)}
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 p-3 rounded-lg transition-all ${
                  isLight
                    ? 'bg-black/10 hover:bg-black/20'
                    : 'bg-white/10 hover:bg-white/20'
                } opacity-0 group-hover:opacity-100`}
              >
                <Copy
                  className={`h-5 w-5 ${isLight ? 'text-black' : 'text-white'}`}
                />
              </button>

              {/* Sliders - Right Side (on hover) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-4">
                  {/* Hue */}
                  <div className="flex flex-col items-center gap-2">
                    <label
                      className={`text-xs font-medium ${
                        isLight ? 'text-black' : 'text-white'
                      }`}
                    >
                      H
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={hsl.h}
                      onChange={(e) => adjustColor(index, 'h', parseInt(e.target.value))}
                      className="w-24 rotate-[-90deg] origin-center"
                      style={{
                        accentColor: colorState.color,
                      }}
                    />
                  </div>
                  
                  {/* Saturation */}
                  <div className="flex flex-col items-center gap-2">
                    <label
                      className={`text-xs font-medium ${
                        isLight ? 'text-black' : 'text-white'
                      }`}
                    >
                      S
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.s}
                      onChange={(e) => adjustColor(index, 's', parseInt(e.target.value))}
                      className="w-24 rotate-[-90deg] origin-center"
                      style={{
                        accentColor: colorState.color,
                      }}
                    />
                  </div>
                  
                  {/* Lightness */}
                  <div className="flex flex-col items-center gap-2">
                    <label
                      className={`text-xs font-medium ${
                        isLight ? 'text-black' : 'text-white'
                      }`}
                    >
                      L
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={hsl.l}
                      onChange={(e) => adjustColor(index, 'l', parseInt(e.target.value))}
                      className="w-24 rotate-[-90deg] origin-center"
                      style={{
                        accentColor: colorState.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium border shadow-lg">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-bold">Space</kbd> to generate
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Palette</DialogTitle>
            <DialogDescription>
              Choose your export format
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={exportFormat === 'css' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const content = exportAsCSS(colors.map(c => c.color))
                  setExportFormat('css')
                  setExportContent(content)
                }}
              >
                CSS
              </Button>
              <Button
                variant={exportFormat === 'array' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const content = exportAsArray(colors.map(c => c.color))
                  setExportFormat('array')
                  setExportContent(content)
                }}
              >
                Array
              </Button>
              <Button
                variant={exportFormat === 'url' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const content = exportAsURL(colors.map(c => c.color))
                  setExportFormat('url')
                  setExportContent(content)
                }}
              >
                URL
              </Button>
            </div>

            <div className="relative">
              <Textarea
                value={exportContent}
                readOnly
                className="font-mono text-sm min-h-[200px]"
              />
              <Button
                size="sm"
                className="absolute top-2 right-2"
                onClick={copyExport}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function PaletteGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading palette generator...</p>
      </div>
    }>
      <PaletteGeneratorContent />
    </Suspense>
  )
}

