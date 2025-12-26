"use client"

import { useState, useRef, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@tremor/react'
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  ];

  const chartData = data || defaultData;
  const chartCategories = categories || ['Revenue', 'Expenses'];
  const chartColors = colors || ['blue', 'red'];

  const valueFormatter = (number: number) => 
    `$${Intl.NumberFormat('us').format(number)}`;

  return (
    <Card className="max-w-2xl">
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
        className="mt-6 h-48" 
      />
    </Card>
  );
}

// ============================================
// TEMPLATE: Monitoring Chart with Tabs
// ============================================
function MonitoringChart({ title, subtitle }: { title?: string, subtitle?: string }) {
  const data = [
    { date: 'Aug 01', 'Successful': 1040, 'Errors': 0 },
    { date: 'Aug 05', 'Successful': 920, 'Errors': 0 },
    { date: 'Aug 10', 'Successful': 1232, 'Errors': 0 },
    { date: 'Aug 15', 'Successful': 1140, 'Errors': 0 },
    { date: 'Aug 20', 'Successful': 1230, 'Errors': 0 },
    { date: 'Aug 23', 'Successful': 610, 'Errors': 81 },
    { date: 'Aug 25', 'Successful': 610, 'Errors': 92 },
    { date: 'Aug 28', 'Successful': 471, 'Errors': 120 },
    { date: 'Aug 31', 'Successful': 500, 'Errors': 56 },
  ];

  const numberFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

  const tabs = [
    { name: 'Overview', categories: ['Successful', 'Errors'], colors: ['blue', 'red'], summary: [{ name: 'Successful', total: '23,450', color: 'bg-blue-500' }, { name: 'Errors', total: '1,397', color: 'bg-red-500' }] },
    { name: 'Performance', categories: ['Successful'], colors: ['emerald'], summary: [{ name: 'Avg response', total: '145ms', color: 'bg-emerald-500' }] },
  ];

  return (
    <Card className="p-0">
      <div className="rounded-t-lg p-6">
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
              <AreaChart data={data} index="date" categories={tab.categories} colors={tab.colors as any} showLegend={false} showGradient={false} yAxisWidth={45} valueFormatter={numberFormatter} className="mt-10 h-72" />
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
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Describe your dashboard and I&apos;ll build it</p>
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      
      // Parse the AI response
      if (data.config) {
        setDashboardConfig(data.config)
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || '✨ Dashboard generated! Check the preview panel →'
        }])
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || 'I can help you build dashboards. Try asking for something like "Create a sales dashboard" or "Build me analytics for a hotel"'
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/tools')}
            className="gap-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Dashboard Generator</h1>
              <p className="text-sm text-muted-foreground">
                Describe what you need and I&apos;ll build it
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          
          {/* Chat Panel */}
          <div className="flex flex-col bg-white dark:bg-gray-900 rounded-xl border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold">Chat</h2>
              <p className="text-xs text-muted-foreground">Tell me what dashboard you need</p>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-sm">Try asking:</p>
                  <div className="mt-3 space-y-2">
                    {[
                      "Create a sales dashboard",
                      "Build analytics for a hotel",
                      "Show me e-commerce metrics"
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInput(suggestion)}
                        className="block w-full text-left px-4 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        &quot;{suggestion}&quot;
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
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
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your dashboard..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-800 dark:border-gray-700"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          
          {/* Preview Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="font-semibold">Preview</h2>
              <p className="text-xs text-muted-foreground">Live dashboard preview</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <DashboardPreview config={dashboardConfig} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
