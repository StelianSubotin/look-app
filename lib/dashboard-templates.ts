// Dashboard Template Library
// Polished, production-ready dashboard templates from Tremor Blocks

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  category: 'kpi' | 'chart' | 'table' | 'layout' | 'full-dashboard'
  tags: string[]
  component: string
}

// Template library - polished Tremor Blocks
export const dashboardTemplates: DashboardTemplate[] = [
  // ============================================
  // AREA CHART 1 - Follower Metrics Style
  // ============================================
  {
    id: 'area-chart-1',
    name: 'Area Chart with Summary List',
    description: 'Beautiful area chart with gradient, summary list below, and color-coded legend. Perfect for time-series metrics.',
    category: 'chart',
    tags: ['area', 'chart', 'metrics', 'followers', 'organic', 'time-series', 'trends'],
    component: `'use client';

import { AreaChart, Card, List, ListItem } from '@tremor/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

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

const valueFormatter = (number: number) =>
  Intl.NumberFormat('us').format(number).toString();

const statusColor: Record<string, string> = {
  Organic: 'bg-blue-500',
  Sponsored: 'bg-violet-500',
};

export function AreaChart1() {
  return (
    <Card className="sm:mx-auto sm:max-w-lg">
      <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Follower metrics
      </h3>
      <AreaChart
        data={data}
        index="date"
        categories={['Organic', 'Sponsored']}
        colors={['blue', 'violet']}
        valueFormatter={valueFormatter}
        showLegend={false}
        showYAxis={false}
        showGradient={false}
        startEndOnly={true}
        className="mt-6 h-32"
      />
      <List className="mt-2">
        {summary.map((item) => (
          <ListItem key={item.name}>
            <div className="flex items-center space-x-2">
              <span
                className={classNames(statusColor[item.name], 'h-0.5 w-3')}
                aria-hidden={true}
              />
              <span>{item.name}</span>
            </div>
            <span className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              {valueFormatter(item.value)}
            </span>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}`
  },
]

// Categories for organizing templates
export const templateCategories = [
  { id: 'kpi', name: 'KPI Cards', description: 'Metric displays and stat cards' },
  { id: 'chart', name: 'Charts', description: 'Area, bar, line, and donut charts' },
  { id: 'table', name: 'Tables', description: 'Data tables and lists' },
  { id: 'layout', name: 'Layouts', description: 'Dashboard shells and grids' },
  { id: 'full-dashboard', name: 'Full Dashboards', description: 'Complete dashboard templates' },
]

// Helper to get templates by category
export function getTemplatesByCategory(category: string): DashboardTemplate[] {
  return dashboardTemplates.filter(t => t.category === category)
}

// Helper to search templates by tags
export function searchTemplates(query: string): DashboardTemplate[] {
  const lowerQuery = query.toLowerCase()
  return dashboardTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

// Get all template IDs for AI prompt
export function getTemplateList(): string {
  return dashboardTemplates.map(t => 
    \`- \${t.id}: \${t.name} - \${t.description} [Tags: \${t.tags.join(', ')}]\`
  ).join('\\n')
}
