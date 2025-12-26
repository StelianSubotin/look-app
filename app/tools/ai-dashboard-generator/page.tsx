"use client"

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@tremor/react'
import { ArrowLeft, LayoutGrid, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Template Components
import { AreaChart, List, ListItem, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// TEMPLATE: KPI Cards with Change Indicators
// ============================================
function KpiCard8() {
  const data = [
    { name: 'Monthly active users', stat: '340', previousStat: '400', change: '15%', changeType: 'negative' },
    { name: 'Monthly sessions', stat: '672', previousStat: '350', change: '91.4%', changeType: 'positive' },
    { name: 'Monthly page views', stat: '3,290', previousStat: '3,012', change: '9.2%', changeType: 'positive' },
  ];

  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.name}>
          <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
            {item.name}
          </dt>
          <dd className="mt-1 flex items-baseline space-x-2.5">
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {item.stat}
            </p>
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
              from {item.previousStat}
            </p>
          </dd>
          <dd className="mt-4 flex items-center space-x-2">
            <p className="flex items-center space-x-0.5">
              {item.changeType === 'positive' ? (
                <RiArrowUpSFill className="size-5 shrink-0 text-emerald-700 dark:text-emerald-500" aria-hidden={true} />
              ) : (
                <RiArrowDownSFill className="size-5 shrink-0 text-red-700 dark:text-red-500" aria-hidden={true} />
              )}
              <span className={classNames(
                item.changeType === 'positive' ? 'text-emerald-700 dark:text-emerald-500' : 'text-red-700 dark:text-red-500',
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
  );
}

// ============================================
// TEMPLATE: Area Chart with Summary List
// ============================================
function AreaChart1() {
  const data = [
    { date: 'Jan 23', Organic: 232, Sponsored: 0 },
    { date: 'Feb 23', Organic: 241, Sponsored: 0 },
    { date: 'Mar 23', Organic: 291, Sponsored: 0 },
    { date: 'Apr 23', Organic: 101, Sponsored: 0 },
    { date: 'May 23', Organic: 318, Sponsored: 0 },
    { date: 'Jun 23', Organic: 205, Sponsored: 0 },
    { date: 'Jul 23', Organic: 372, Sponsored: 0 },
    { date: 'Aug 23', Organic: 341, Sponsored: 0 },
    { date: 'Sep 23', Organic: 387, Sponsored: 120 },
    { date: 'Oct 23', Organic: 220, Sponsored: 0 },
    { date: 'Nov 23', Organic: 372, Sponsored: 0 },
    { date: 'Dec 23', Organic: 321, Sponsored: 0 },
  ];

  const summary = [
    { name: 'Organic', value: 3273 },
    { name: 'Sponsored', value: 120 },
  ];

  const valueFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();
  const statusColor: Record<string, string> = { Organic: 'bg-blue-500', Sponsored: 'bg-violet-500' };

  return (
    <Card className="max-w-lg">
      <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Follower metrics</h3>
      <AreaChart data={data} index="date" categories={['Organic', 'Sponsored']} colors={['blue', 'violet']} valueFormatter={valueFormatter} showLegend={false} showYAxis={false} showGradient={false} startEndOnly={true} className="mt-6 h-32" />
      <List className="mt-2">
        {summary.map((item) => (
          <ListItem key={item.name}>
            <div className="flex items-center space-x-2">
              <span className={classNames(statusColor[item.name], 'h-0.5 w-3')} aria-hidden={true} />
              <span>{item.name}</span>
            </div>
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">{valueFormatter(item.value)}</span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

// ============================================
// TEMPLATE: Monitoring Chart with Tabs
// ============================================
function AreaChart13() {
  const data = [
    { date: 'Aug 01', 'Successful requests': 1040, Errors: 0 },
    { date: 'Aug 05', 'Successful requests': 920, Errors: 0 },
    { date: 'Aug 10', 'Successful requests': 1232, Errors: 0 },
    { date: 'Aug 15', 'Successful requests': 1140, Errors: 0 },
    { date: 'Aug 20', 'Successful requests': 1230, Errors: 0 },
    { date: 'Aug 23', 'Successful requests': 610, Errors: 81 },
    { date: 'Aug 25', 'Successful requests': 610, Errors: 92 },
    { date: 'Aug 28', 'Successful requests': 471, Errors: 120 },
    { date: 'Aug 31', 'Successful requests': 500, Errors: 56 },
  ];

  const numberFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();

  const tabs = [
    { name: 'API requests', categories: ['Successful requests', 'Errors'], colors: ['blue', 'red'], summary: [{ name: 'Successful requests', total: '23,450', color: 'bg-blue-500' }, { name: 'Errors', total: '1,397', color: 'bg-red-500' }] },
    { name: 'Performance', categories: ['Successful requests'], colors: ['emerald'], summary: [{ name: 'Avg response time', total: '145ms', color: 'bg-emerald-500' }] },
  ];

  return (
    <Card className="p-0">
      <div className="rounded-t-lg p-6">
        <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Monitoring</h3>
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">API performance metrics</p>
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
                      <p className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">{item.total}</p>
                    </div>
                    <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">{item.name}</p>
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
// MAIN PAGE
// ============================================
const templates = [
  { id: 'kpi-card-8', name: 'KPI Cards', description: 'Metrics with change indicators', component: KpiCard8, icon: '📊' },
  { id: 'area-chart-1', name: 'Area Chart', description: 'With summary list', component: AreaChart1, icon: '📈' },
  { id: 'area-chart-13', name: 'Monitoring', description: 'Tabbed chart view', component: AreaChart13, icon: '🖥️' },
];

export default function AIGeneratorPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/tools')}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard Template Library</h1>
              <p className="text-muted-foreground">
                Polished, production-ready components from Tremor
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Template Selection */}
        {!selectedTemplate ? (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Choose a Template to Preview</h2>
              <p className="text-muted-foreground">Click on any template to see it in action</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className="group cursor-pointer rounded-xl border-2 border-transparent bg-white dark:bg-gray-900 p-6 shadow-sm hover:border-violet-500 hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-4">{template.icon}</div>
                  <h3 className="text-lg font-semibold group-hover:text-violet-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    Click to preview
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <Button
              variant="outline"
              onClick={() => setSelectedTemplate(null)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Button>

            {/* Template name */}
            <div>
              <h2 className="text-xl font-semibold">
                {templates.find(t => t.id === selectedTemplate)?.name}
              </h2>
              <p className="text-muted-foreground">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
            </div>

            {/* Template Preview */}
            <div className="rounded-xl border bg-white dark:bg-gray-900 p-8">
              {(() => {
                const Template = templates.find(t => t.id === selectedTemplate)?.component;
                return Template ? <Template /> : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
