"use client"

import { useState, useCallback, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import * as htmlToImage from "html-to-image"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  componentRegistry,
  dashboardTemplates,
  renderDashboardComponent,
  generateReactCode,
  DashboardComponentConfig,
  ComponentDefinition,
} from "@/lib/dashboard-components"
import {
  Plus,
  Trash2,
  Copy,
  Download,
  Code,
  Sparkles,
  GripVertical,
  Layout,
  Settings,
  Palette,
  ChevronRight,
  Eye,
  Wand2,
  X,
  Check,
  Image as ImageIcon,
  FileImage,
  ChevronDown,
  Figma,
} from "lucide-react"

// Sortable component wrapper
function SortableComponent({
  component,
  isSelected,
  onSelect,
  onDelete,
}: {
  component: DashboardComponentConfig
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isLargeComponent = ['line-chart', 'bar-chart', 'area-chart', 'data-table'].includes(component.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isLargeComponent ? 'col-span-2' : ''} ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="bg-background/90 backdrop-blur rounded p-1 shadow-sm border">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <button
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <div className="bg-red-500 hover:bg-red-600 rounded p-1 shadow-sm">
          <Trash2 className="h-3 w-3 text-white" />
        </div>
      </button>
      {renderDashboardComponent(component)}
    </div>
  )
}

// Draggable component from sidebar
function DraggableComponentItem({ definition }: { definition: ComponentDefinition }) {
  const Icon = definition.icon

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors group">
      <div className="p-2 rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{definition.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{definition.category}</p>
      </div>
      <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

export default function DashboardBuilderPage() {
  const [components, setComponents] = useState<DashboardComponentConfig[]>([])
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showExport, setShowExport] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<'components' | 'templates' | 'settings'>('components')
  const [promptInput, setPromptInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Ref for the preview content to export
  const previewRef = useRef<HTMLDivElement>(null)

  // Theme settings
  const [theme, setTheme] = useState({
    primaryColor: '#3b82f6',
    radius: '0.5rem',
    spacing: 'normal'
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const selectedComponent = components.find((c) => c.id === selectedComponentId)
  const selectedDefinition = selectedComponent
    ? componentRegistry.find((d) => d.type === selectedComponent.type)
    : null

  // Add component
  const addComponent = useCallback((type: string) => {
    const definition = componentRegistry.find((d) => d.type === type)
    if (!definition) return

    const newComponent: DashboardComponentConfig = {
      id: `${type}-${Date.now()}`,
      type,
      props: { ...definition.defaultProps },
    }
    setComponents((prev) => [...prev, newComponent])
    setSelectedComponentId(newComponent.id)
  }, [])

  // Delete component
  const deleteComponent = useCallback((id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id))
    if (selectedComponentId === id) {
      setSelectedComponentId(null)
    }
  }, [selectedComponentId])

  // Update component props
  const updateComponentProps = useCallback(
    (id: string, key: string, value: any) => {
      setComponents((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, props: { ...c.props, [key]: value } } : c
        )
      )
    },
    []
  )

  // Load template
  const loadTemplate = useCallback((templateId: string) => {
    const template = dashboardTemplates.find((t) => t.id === templateId)
    if (!template) return
    setComponents(template.components.map((c, i) => ({ ...c, id: `${c.type}-${Date.now()}-${i}` })))
    setSelectedComponentId(null)
  }, [])

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Generate from prompt (mock AI)
  const generateFromPrompt = useCallback(async () => {
    if (!promptInput.trim()) return
    setIsGenerating(true)

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const prompt = promptInput.toLowerCase()
    const generated: DashboardComponentConfig[] = []

    // Simple rule-based generation
    if (prompt.includes('sales') || prompt.includes('revenue') || prompt.includes('ecommerce')) {
      generated.push(
        { id: `stat-${Date.now()}-1`, type: 'stat-card', props: { title: 'Total Revenue', value: '$45,231', change: '+20.1%', changeType: 'positive', icon: 'dollar' } },
        { id: `stat-${Date.now()}-2`, type: 'stat-card', props: { title: 'Orders', value: '2,350', change: '+15%', changeType: 'positive', icon: 'cart' } },
        { id: `chart-${Date.now()}-1`, type: 'line-chart', props: { title: 'Revenue Over Time', color: theme.primaryColor } },
        { id: `table-${Date.now()}-1`, type: 'data-table', props: { title: 'Recent Transactions' } }
      )
    } else if (prompt.includes('analytics') || prompt.includes('traffic') || prompt.includes('website')) {
      generated.push(
        { id: `stat-${Date.now()}-1`, type: 'stat-card-mini', props: { label: 'Page Views', value: '124,592', color: 'blue' } },
        { id: `stat-${Date.now()}-2`, type: 'stat-card-mini', props: { label: 'Visitors', value: '45,201', color: 'green' } },
        { id: `chart-${Date.now()}-1`, type: 'area-chart', props: { title: 'Traffic Overview', color: theme.primaryColor } },
        { id: `pie-${Date.now()}-1`, type: 'pie-chart', props: { title: 'Traffic by Device' } }
      )
    } else if (prompt.includes('user') || prompt.includes('customer')) {
      generated.push(
        { id: `stat-${Date.now()}-1`, type: 'stat-card', props: { title: 'Total Users', value: '12,543', change: '+8.2%', changeType: 'positive', icon: 'users' } },
        { id: `stat-${Date.now()}-2`, type: 'stat-card', props: { title: 'Active Today', value: '2,350', change: '+12%', changeType: 'positive', icon: 'activity' } },
        { id: `chart-${Date.now()}-1`, type: 'bar-chart', props: { title: 'User Growth', color: theme.primaryColor } },
        { id: `table-${Date.now()}-1`, type: 'data-table', props: { title: 'Recent Users' } }
      )
    } else {
      // Default dashboard
      generated.push(
        { id: `stat-${Date.now()}-1`, type: 'stat-card', props: { title: 'Metric 1', value: '1,234', change: '+5%', changeType: 'positive', icon: 'activity' } },
        { id: `stat-${Date.now()}-2`, type: 'stat-card', props: { title: 'Metric 2', value: '567', change: '+3%', changeType: 'positive', icon: 'users' } },
        { id: `chart-${Date.now()}-1`, type: 'line-chart', props: { title: 'Performance', color: theme.primaryColor } }
      )
    }

    setComponents(generated)
    setIsGenerating(false)
    setPromptInput('')
  }, [promptInput, theme.primaryColor])

  // Copy code
  const copyCode = useCallback(() => {
    const code = generateReactCode(components)
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [components])

  // Download code
  const downloadCode = useCallback(() => {
    const code = generateReactCode(components)
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dashboard.tsx'
    a.click()
    URL.revokeObjectURL(url)
  }, [components])

  // Export as PNG (for Figma)
  const exportAsPNG = useCallback(async () => {
    if (!previewRef.current) {
      // If preview is not open, open it first
      setShowPreview(true)
      // Wait for the preview to render
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    const element = previewRef.current
    if (!element) return

    setIsExporting(true)
    try {
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2, // High resolution for Figma
        backgroundColor: '#ffffff',
      })
      
      const link = document.createElement('a')
      link.download = 'dashboard.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting PNG:', error)
    } finally {
      setIsExporting(false)
    }
  }, [])

  // Export as SVG (for Figma - vector format)
  const exportAsSVG = useCallback(async () => {
    if (!previewRef.current) {
      setShowPreview(true)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    const element = previewRef.current
    if (!element) return

    setIsExporting(true)
    try {
      const dataUrl = await htmlToImage.toSvg(element, {
        backgroundColor: '#ffffff',
      })
      
      const link = document.createElement('a')
      link.download = 'dashboard.svg'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting SVG:', error)
    } finally {
      setIsExporting(false)
    }
  }, [])

  // Copy for Figma Plugin (JSON format)
  const copyForFigma = useCallback(() => {
    const figmaData = {
      name: 'Lookscout Dashboard',
      components: components,
      theme: theme,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    
    navigator.clipboard.writeText(JSON.stringify(figmaData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [components, theme])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Components & Templates */}
        <div className="w-72 border-r bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setSidebarTab('components')}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                  sidebarTab === 'components' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
              >
                <Layout className="h-4 w-4 inline mr-1.5" />
                Components
              </button>
              <button
                onClick={() => setSidebarTab('templates')}
                className={`flex-1 py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
                  sidebarTab === 'templates' ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                }`}
              >
                <Sparkles className="h-4 w-4 inline mr-1.5" />
                Templates
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {sidebarTab === 'components' && (
              <div className="space-y-6">
                {/* AI Prompt */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    AI Assistant
                  </Label>
                  <div className="mt-2 space-y-2">
                    <Input
                      placeholder="Describe your dashboard..."
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && generateFromPrompt()}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={generateFromPrompt}
                      disabled={isGenerating || !promptInput.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-3 w-3 mr-2" />
                          Generate Dashboard
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Stats Components */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Stats & Metrics
                  </Label>
                  <div className="mt-2 space-y-2">
                    {componentRegistry
                      .filter((c) => c.category === 'stats')
                      .map((def) => (
                        <div key={def.type} onClick={() => addComponent(def.type)}>
                          <DraggableComponentItem definition={def} />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Chart Components */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Charts
                  </Label>
                  <div className="mt-2 space-y-2">
                    {componentRegistry
                      .filter((c) => c.category === 'charts')
                      .map((def) => (
                        <div key={def.type} onClick={() => addComponent(def.type)}>
                          <DraggableComponentItem definition={def} />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Data Components */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Data Display
                  </Label>
                  <div className="mt-2 space-y-2">
                    {componentRegistry
                      .filter((c) => c.category === 'data')
                      .map((def) => (
                        <div key={def.type} onClick={() => addComponent(def.type)}>
                          <DraggableComponentItem definition={def} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {sidebarTab === 'templates' && (
              <div className="space-y-3">
                {dashboardTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => loadTemplate(template.id)}
                  >
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {template.name}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="h-14 border-b bg-muted/30 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Dashboard Builder</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {components.length} components
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreview(true)}
                disabled={components.length === 0}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowExport(!showExport)}>
                <Code className="h-4 w-4 mr-2" />
                {showExport ? 'Hide Code' : 'View Code'}
              </Button>
              <Button variant="outline" size="sm" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" disabled={components.length === 0 || isExporting}>
                    {isExporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={downloadCode}>
                    <Code className="h-4 w-4 mr-2" />
                    React Code (.tsx)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyForFigma}>
                    <Figma className="h-4 w-4 mr-2" />
                    Copy for Figma Plugin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsPNG}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    PNG Image (2x)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsSVG}>
                    <FileImage className="h-4 w-4 mr-2" />
                    SVG Vector
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Use Figma Plugin to import JSON
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
            {showExport ? (
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generated React Code</CardTitle>
                    <CardDescription>
                      Copy this code to use in your project. Requires shadcn/ui and recharts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm font-mono">
                      <code>{generateReactCode(components)}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            ) : components.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Layout className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                  <p className="text-muted-foreground mb-6">
                    Add components from the sidebar, use a template, or describe what you want to build.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => setSidebarTab('templates')}>
                      Browse Templates
                    </Button>
                    <Button onClick={() => loadTemplate('sales')}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Quick Start
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={components.map((c) => c.id)} strategy={rectSortingStrategy}>
                  <div className="grid gap-4 grid-cols-4">
                    {components.map((component) => (
                      <SortableComponent
                        key={component.id}
                        component={component}
                        isSelected={selectedComponentId === component.id}
                        onSelect={() => setSelectedComponentId(component.id)}
                        onDelete={() => deleteComponent(component.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div className="opacity-80">
                      {renderDashboardComponent(
                        components.find((c) => c.id === activeId)!
                      )}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-72 border-l bg-muted/30 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button className="flex-1 py-1.5 px-3 text-sm font-medium rounded-md bg-background shadow-sm">
                <Settings className="h-4 w-4 inline mr-1.5" />
                Properties
              </button>
              <button
                className="flex-1 py-1.5 px-3 text-sm font-medium rounded-md hover:bg-background/50 transition-colors"
                onClick={() => {}}
              >
                <Palette className="h-4 w-4 inline mr-1.5" />
                Theme
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedComponent && selectedDefinition ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">{selectedDefinition.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedDefinition.category} component
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedDefinition.editableProps.map((prop) => (
                    <div key={prop.key}>
                      <Label className="text-xs">{prop.label}</Label>
                      {prop.type === 'text' && (
                        <Input
                          className="mt-1"
                          value={selectedComponent.props[prop.key] || ''}
                          onChange={(e) =>
                            updateComponentProps(
                              selectedComponent.id,
                              prop.key,
                              e.target.value
                            )
                          }
                        />
                      )}
                      {prop.type === 'select' && (
                        <select
                          className="w-full mt-1 px-3 py-2 text-sm rounded-md border bg-background"
                          value={selectedComponent.props[prop.key] || ''}
                          onChange={(e) =>
                            updateComponentProps(
                              selectedComponent.id,
                              prop.key,
                              e.target.value
                            )
                          }
                        >
                          {prop.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                      {prop.type === 'color' && (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="color"
                            className="w-10 h-10 rounded cursor-pointer border-0"
                            value={selectedComponent.props[prop.key] || '#3b82f6'}
                            onChange={(e) =>
                              updateComponentProps(
                                selectedComponent.id,
                                prop.key,
                                e.target.value
                              )
                            }
                          />
                          <Input
                            className="flex-1"
                            value={selectedComponent.props[prop.key] || '#3b82f6'}
                            onChange={(e) =>
                              updateComponentProps(
                                selectedComponent.id,
                                prop.key,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => deleteComponent(selectedComponent.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Component
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Select a component to edit its properties
                </p>
              </div>
            )}

            {/* Theme Settings */}
            <div className="mt-6 pt-6 border-t">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Global Theme
              </Label>
              <div className="mt-3 space-y-3">
                <div>
                  <Label className="text-xs">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="color"
                      className="w-10 h-10 rounded cursor-pointer border-0"
                      value={theme.primaryColor}
                      onChange={(e) =>
                        setTheme((t) => ({ ...t, primaryColor: e.target.value }))
                      }
                    />
                    <Input
                      className="flex-1"
                      value={theme.primaryColor}
                      onChange={(e) =>
                        setTheme((t) => ({ ...t, primaryColor: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 flex flex-col overflow-hidden">
          {/* Preview Header - Fixed at top */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-background shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm font-medium">Dashboard Preview</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isExporting}>
                    {isExporting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={downloadCode}>
                    <Code className="h-4 w-4 mr-2" />
                    React Code
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyForFigma}>
                    <Figma className="h-4 w-4 mr-2" />
                    Copy for Figma Plugin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsPNG}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    PNG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportAsSVG}>
                    <FileImage className="h-4 w-4 mr-2" />
                    SVG Vector
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview Content - Scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-background">
            <div ref={previewRef} className="p-8 bg-white">
              <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                  <p className="text-gray-500 mt-1">
                    Welcome back! Here&apos;s what&apos;s happening today.
                  </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid gap-4 grid-cols-4">
                  {components.map((component) => {
                    const isLargeComponent = ['line-chart', 'bar-chart', 'area-chart', 'data-table'].includes(component.type)
                    return (
                      <div
                        key={component.id}
                        className={isLargeComponent ? 'col-span-2' : ''}
                      >
                        {renderDashboardComponent(component)}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

