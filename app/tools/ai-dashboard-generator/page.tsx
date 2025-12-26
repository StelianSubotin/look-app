"use client"

import { useState, useRef, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@tremor/react'
import { ArrowLeft, Send, Sparkles, Loader2, Maximize2, X, Figma, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { buildFigmaExport, copyToClipboard } from '@/lib/figma-export'

// Template Components
import { AreaChart, List, ListItem, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// TEMPLATE: KPI Cards
// ============================================
interface KpiData {
  name: string;
  stat: string;
  previousStat: string;
  change: string;
  changeType: 'positive' | 'negative';
}

function KpiCards({ data, title }: { data?: KpiData[], title?: string }) {
  const defaultData: KpiData[] = [
    { name: 'Monthly active users', stat: '340', previousStat: '400', change: '15%', changeType: 'negative' },
    { name: 'Monthly sessions', stat: '672', previousStat: '350', change: '91.4%', changeType: 'positive' },
    { name: 'Monthly page views', stat: '3,290', previousStat: '3,012', change: '9.2%', changeType: 'positive' },
  ];
  
  const metrics = data || defaultData;

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-tremor-content-strong">{title}</h3>}
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => (
          <Card key={item.name}>
            <dt className="text-tremor-default font-medium text-tremor-content">
              {item.name}
            </dt>
            <dd className="mt-1 flex items-baseline space-x-2.5">
              <p className="text-tremor-metric font-semibold text-tremor-content-strong">
                {item.stat}
              </p>
              <p className="text-tremor-default text-tremor-content">
                from {item.previousStat}
              </p>
            </dd>
            <dd className="mt-4 flex items-center space-x-2">
              <p className="flex items-center space-x-0.5">
                {item.changeType === 'positive' ? (
                  <RiArrowUpSFill className="size-5 shrink-0 text-emerald-700" aria-hidden={true} />
                ) : (
                  <RiArrowDownSFill className="size-5 shrink-0 text-red-700" aria-hidden={true} />
                )}
                <span className={classNames(
                  item.changeType === 'positive' ? 'text-emerald-700' : 'text-red-700',
                  'text-tremor-default font-medium'
                )}>
                  {item.change}
                </span>
              </p>
              <p className="text-tremor-default text-tremor-content">from previous month</p>
            </dd>
          </Card>
        ))}
      </dl>
    </div>
  );
}

// ============================================
// TEMPLATE: Area Chart with Summary
// ============================================
interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

function AreaChartWithSummary({ 
  data, 
  title, 
  categories,
  colors 
}: { 
  data?: ChartDataPoint[], 
  title?: string,
  categories?: string[],
  colors?: string[]
}) {
  const defaultData = [
    { date: 'Jan', Revenue: 2320, Expenses: 1800 },
    { date: 'Feb', Revenue: 2410, Expenses: 1900 },
    { date: 'Mar', Revenue: 2910, Expenses: 2100 },
    { date: 'Apr', Revenue: 3010, Expenses: 2000 },
    { date: 'May', Revenue: 3180, Expenses: 2200 },
    { date: 'Jun', Revenue: 3050, Expenses: 2100 },
    { date: 'Jul', Revenue: 3500, Expenses: 2300 },
    { date: 'Aug', Revenue: 3800, Expenses: 2400 },
  ];

  const chartData = data || defaultData;
  const chartCategories = categories || ['Revenue', 'Expenses'];
  const chartColors = colors || ['blue', 'red'];

  const valueFormatter = (number: number) => 
    `$${Intl.NumberFormat('us').format(number)}`;

  return (
    <Card>
      <h3 className="font-medium text-tremor-content-strong">{title || 'Performance Overview'}</h3>
      <AreaChart 
        data={chartData} 
        index="date" 
        categories={chartCategories} 
        colors={chartColors as any}
        valueFormatter={valueFormatter} 
        showLegend={true} 
        showYAxis={true} 
        showGradient={true} 
        className="mt-6 h-72" 
      />
    </Card>
  );
}

// ============================================
// TEMPLATE: Monitoring Chart with Tabs
// ============================================
function MonitoringChart({ title, subtitle }: { title?: string, subtitle?: string }) {
  const data = [
    { date: 'Aug 01', 'Successful': 1040, 'Errors': 20 },
    { date: 'Aug 05', 'Successful': 920, 'Errors': 15 },
    { date: 'Aug 10', 'Successful': 1232, 'Errors': 25 },
    { date: 'Aug 15', 'Successful': 1140, 'Errors': 30 },
    { date: 'Aug 20', 'Successful': 1230, 'Errors': 22 },
    { date: 'Aug 23', 'Successful': 610, 'Errors': 81 },
    { date: 'Aug 25', 'Successful': 610, 'Errors': 92 },
    { date: 'Aug 28', 'Successful': 471, 'Errors': 120 },
    { date: 'Aug 31', 'Successful': 680, 'Errors': 56 },
  ];

  const numberFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

  const tabs = [
    { name: 'Overview', categories: ['Successful', 'Errors'], colors: ['blue', 'red'], summary: [{ name: 'Successful', total: '23,450', color: 'bg-blue-500' }, { name: 'Errors', total: '1,397', color: 'bg-red-500' }] },
    { name: 'Performance', categories: ['Successful'], colors: ['emerald'], summary: [{ name: 'Avg response', total: '145ms', color: 'bg-emerald-500' }] },
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-6">
        <h3 className="font-medium text-tremor-content-strong">{title || 'System Monitoring'}</h3>
        <p className="text-tremor-default text-tremor-content">{subtitle || 'Real-time performance metrics'}</p>
      </div>
      <TabGroup>
        <TabList className="px-6">
          {tabs.map((tab) => (<Tab key={tab.name} className="font-medium">{tab.name}</Tab>))}
        </TabList>
        <TabPanels>
          {tabs.map((tab) => (
            <TabPanel key={tab.name} className="p-6">
              <ul className="flex flex-wrap items-center gap-x-10 gap-y-4">
                {tab.summary.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-center space-x-2">
                      <span className={classNames(item.color, 'size-3 shrink-0 rounded-sm')} />
                      <p className="font-semibold text-tremor-content-strong">{item.total}</p>
                    </div>
                    <p className="text-tremor-default text-tremor-content">{item.name}</p>
                  </li>
                ))}
              </ul>
              <AreaChart 
                data={data} 
                index="date" 
                categories={tab.categories} 
                colors={tab.colors as any} 
                showLegend={false} 
                showGradient={true} 
                yAxisWidth={45} 
                valueFormatter={numberFormatter} 
                className="mt-8 h-72" 
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </Card>
  );
}

// ============================================
// DASHBOARD RENDERER
// ============================================
interface DashboardConfig {
  title?: string;
  components: Array<{
    type: 'kpi' | 'area-chart' | 'monitoring';
    props?: Record<string, unknown>;
  }>;
}

function DashboardPreview({ config }: { config: DashboardConfig | null }) {
  if (!config) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Describe your dashboard</p>
          <p className="text-sm mt-1">and I&apos;ll build it for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {config.title && (
        <h2 className="text-2xl font-bold text-tremor-content-strong">{config.title}</h2>
      )}
      {config.components.map((component, index) => {
        switch (component.type) {
          case 'kpi':
            return <KpiCards key={index} {...(component.props as any)} />;
          case 'area-chart':
            return <AreaChartWithSummary key={index} {...(component.props as any)} />;
          case 'monitoring':
            return <MonitoringChart key={index} {...(component.props as any)} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// ============================================
// FULLSCREEN MODAL
// ============================================
function FullscreenModal({ 
  isOpen, 
  onClose, 
  config 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  config: DashboardConfig | null;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <span className="font-semibold">{config?.title || 'Dashboard Preview'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <DashboardPreview config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIGeneratorPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [figmaExported, setFigmaExported] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        })
      })

      if (!response.ok) throw new Error('Failed to generate')

      const data = await response.json()
      
      if (data.config) {
        setDashboardConfig(data.config)
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || '✨ Dashboard ready!'
        }])
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || 'Try asking for a dashboard like "Create a sales dashboard"'
        }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportToFigma = async () => {
    if (!dashboardConfig) return
    
    try {
      const figmaData = buildFigmaExport(dashboardConfig)
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
          'Your dashboard will be created with matching components!'
        )
      }
    } catch (error) {
      console.error('Export to Figma failed:', error)
      alert('Failed to export. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/tools')}
            className="gap-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Dashboard Generator</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Adjusted Proportions */}
      <div className="flex h-[calc(100vh-120px)]">
        
        {/* Chat Panel - Narrow sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-white dark:bg-gray-900 border-r">
          <div className="p-3 border-b bg-gray-50 dark:bg-gray-800">
            <h2 className="font-semibold text-sm">Chat</h2>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-muted-foreground py-4">
                <p className="text-xs mb-2">Try:</p>
                <div className="space-y-1.5">
                  {[
                    "Sales dashboard",
                    "Hotel analytics",
                    "E-commerce metrics"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="block w-full text-left px-3 py-2 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-violet-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe dashboard..."
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700"
                disabled={isLoading}
              />
              <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
        
        {/* Preview Panel - Takes remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 border-b bg-white dark:bg-gray-900 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-sm">Preview</h2>
            </div>
            {dashboardConfig && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFullscreen(true)}
                className="gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                Full Preview
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-5xl mx-auto">
              <DashboardPreview config={dashboardConfig} />
            </div>
          </div>
        </div>
        
      </div>

      {/* Fullscreen Modal */}
      <FullscreenModal 
        isOpen={isFullscreen} 
        onClose={() => setIsFullscreen(false)} 
        config={dashboardConfig} 
      />
    </div>
  )
}
