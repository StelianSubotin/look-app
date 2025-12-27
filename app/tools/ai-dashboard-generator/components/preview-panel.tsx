"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Download, Code, Eye, Copy, Check, Figma } from 'lucide-react'
import { DashboardRenderer } from './dashboard-renderer'
import { DashboardConfig } from '@/lib/dashboard-schema'
import { buildFigmaExport, copyToClipboard } from '@/lib/figma-export'

interface PreviewPanelProps {
  dashboard: DashboardConfig | null
  customStyles?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }
  onStylesChange?: (styles: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }) => void
}

export function PreviewPanel({ dashboard, customStyles, onStylesChange }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const [figmaExported, setFigmaExported] = useState(false)

  const handleCopyCode = async () => {
    if (!dashboard) return
    
    const code = generateReactCode(dashboard)
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportJSON = () => {
    if (!dashboard) return
    
    const dataStr = JSON.stringify(dashboard, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dashboard-config.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportToFigma = async () => {
    if (!dashboard) return
    
    try {
      // Build Figma export data with current custom styles
      const figmaData = buildFigmaExport(dashboard, customStyles)
      const jsonString = JSON.stringify(figmaData, null, 2)
      
      // Copy to clipboard
      const success = await copyToClipboard(jsonString)
      
      if (success) {
        setFigmaExported(true)
        setTimeout(() => setFigmaExported(false), 3000)
        
        // Show instructions
        alert(
          '✅ Copied to clipboard!\n\n' +
          'Next steps:\n' +
          '1. Open Figma\n' +
          '2. Go to Plugins → LookScout Dashboard Importer\n' +
          '3. Paste the copied data\n' +
          '4. Click "Import"\n\n' +
          'Your dashboard will be created with matching components!'
        )
      }
    } catch (error) {
      console.error('Export to Figma failed:', error)
      alert('Failed to export. Please try again.')
    }
  }

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Header with Actions */}
      <div className="border-b p-4 bg-background flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Live Preview</h3>
          <p className="text-xs text-muted-foreground">
            {dashboard ? 'Live dashboard preview' : 'Waiting for generation'}
          </p>
        </div>
        
        {dashboard && (
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList>
                <TabsTrigger value="preview" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="gap-2">
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportJSON}
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>

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

      {/* Preview/Code Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'preview' ? (
          <div className="p-6">
            <DashboardRenderer 
              config={dashboard} 
              customStyles={customStyles}
              onStylesChange={onStylesChange}
            />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <pre className="p-6 text-sm overflow-x-auto">
              <code className="language-tsx">
                {dashboard ? generateReactCode(dashboard) : '// No code yet'}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

function generateReactCode(config: DashboardConfig): string {
  const imports = `import {
  Card,
  Title,
  Text,
  Metric,
  AreaChart,
  BarChart,
  LineChart,
  DonutChart,
  Grid,
  Flex,
  BadgeDelta,
} from '@tremor/react'

`

  const componentCode = generateComponentCode(config.components, 2)

  return `${imports}export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* ${config.title} */}
      ${config.description ? `{/* ${config.description} */}\n      ` : ''}
      <Grid numItemsSm={1} numItemsMd={2} numItemsLg={${config.layout.columns || 3}} className="gap-6">
${componentCode}
      </Grid>
    </div>
  )
}
`
}

function generateComponentCode(components: any[], indent: number): string {
  const indentStr = '  '.repeat(indent)
  
  return components.map(comp => {
    const propsStr = Object.entries(comp.props || {})
      .filter(([key]) => key !== 'children')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`
        }
        if (Array.isArray(value)) {
          return `${key}={${JSON.stringify(value)}}`
        }
        return `${key}={${JSON.stringify(value)}}`
      })
      .join(' ')

    const hasChildren = comp.children && Array.isArray(comp.children)
    
    if (hasChildren) {
      return `${indentStr}<${comp.type}${propsStr ? ' ' + propsStr : ''}>
${generateComponentCode(comp.children, indent + 1)}
${indentStr}</${comp.type}>`
    } else if (comp.children && typeof comp.children === 'string') {
      return `${indentStr}<${comp.type}${propsStr ? ' ' + propsStr : ''}>${comp.children}</${comp.type}>`
    } else {
      return `${indentStr}<${comp.type}${propsStr ? ' ' + propsStr : ''} />`
    }
  }).join('\n')
}

