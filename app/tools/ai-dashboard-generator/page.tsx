"use client"

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Figma, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ChatInterface } from './components/chat-interface'
import { PreviewPanel } from './components/preview-panel'
import { DashboardConfig } from '@/lib/dashboard-schema'
import { buildFigmaExport, copyToClipboard } from '@/lib/figma-export'

export default function AIGeneratorPage() {
  const router = useRouter()
  const [currentDashboard, setCurrentDashboard] = useState<DashboardConfig | null>(null)
  const [figmaExported, setFigmaExported] = useState(false)
  const [customStyles, setCustomStyles] = useState<{
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }>({})

  const handleDashboardGenerated = (config: DashboardConfig) => {
    setCurrentDashboard(config)
  }

  const handleExportToFigma = async () => {
    if (!currentDashboard) return
    
    try {
      // Export with current custom styles
      const figmaData = buildFigmaExport(currentDashboard, customStyles)
      const jsonString = JSON.stringify(figmaData, null, 2)
      const success = await copyToClipboard(jsonString)
      
      if (success) {
        setFigmaExported(true)
        setTimeout(() => setFigmaExported(false), 3000)
        alert(
          '✅ Copied to clipboard!\n\n' +
          'Next steps:\n' +
          '1. Open Figma\n' +
          '2. Go to Plugins → LookScout Dashboard Importer\n' +
          '3. Paste the copied data\n' +
          '4. Click "Import"\n\n' +
          'Your dashboard will be created with matching components and custom colors!'
        )
      }
    } catch (error) {
      console.error('Export to Figma failed:', error)
      alert('Failed to export. Please try again.')
    }
  }

  const handleStylesChange = (styles: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }) => {
    setCustomStyles(styles)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/tools')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Button>
              <div>
                <h1 className="text-2xl font-bold">AI Dashboard Generator</h1>
                <p className="text-sm text-muted-foreground">
                  Describe your dashboard and watch it come to life
                </p>
              </div>
            </div>
            
            {currentDashboard && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {currentDashboard.components?.length || 0}
                  </span>{' '}
                  components generated
                </div>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleExportToFigma}
                  className="gap-2 bg-violet-600 hover:bg-violet-700"
                >
                  {figmaExported ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Figma className="h-4 w-4" />
                      Export to Figma
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split Layout: Chat | Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Chat */}
        <div className="w-[400px] border-r flex flex-col">
          <ChatInterface onDashboardGenerated={handleDashboardGenerated} />
        </div>

        {/* Right Side - Preview */}
        <div className="flex-1 flex flex-col">
          <PreviewPanel 
            dashboard={currentDashboard}
            customStyles={customStyles}
            onStylesChange={handleStylesChange}
          />
        </div>
      </div>

      {/* Info Footer */}
      <div className="border-t bg-muted/30 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>💡 Tip: Be specific about metrics, data types, and layouts</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by GPT-4 + Tremor</span>
          </div>
        </div>
      </div>

    </div>
  )
}

