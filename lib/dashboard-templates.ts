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

  // ============================================
  // AREA CHART 13 - Monitoring with Tabs
  // ============================================
  {
    id: 'area-chart-13',
    name: 'Monitoring Chart with Tabs',
    description: 'Advanced monitoring dashboard with tabbed views for API requests and incident response. Includes summary stats and responsive charts.',
    category: 'chart',
    tags: ['area', 'chart', 'monitoring', 'tabs', 'api', 'requests', 'errors', 'incidents', 'devops', 'analytics'],
    component: `'use client';

import {
  AreaChart,
  Card,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@tremor/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const data = [
  { date: 'Aug 01', 'Successful requests': 1040, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 02', 'Successful requests': 1200, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 03', 'Successful requests': 1130, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 04', 'Successful requests': 1050, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 05', 'Successful requests': 920, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 06', 'Successful requests': 870, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 07', 'Successful requests': 790, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 08', 'Successful requests': 910, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 09', 'Successful requests': 951, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 10', 'Successful requests': 1232, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 11', 'Successful requests': 1230, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 12', 'Successful requests': 1289, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 13', 'Successful requests': 1002, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 14', 'Successful requests': 1034, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 15', 'Successful requests': 1140, Errors: 0, 'Mean time to detect': 0, 'Mean time to resolve': 0 },
  { date: 'Aug 23', 'Successful requests': 610, Errors: 81, 'Mean time to detect': 1060, 'Mean time to resolve': 2180 },
  { date: 'Aug 24', 'Successful requests': 610, Errors: 87, 'Mean time to detect': 1460, 'Mean time to resolve': 3140 },
  { date: 'Aug 25', 'Successful requests': 610, Errors: 92, 'Mean time to detect': 2460, 'Mean time to resolve': 4120 },
  { date: 'Aug 26', 'Successful requests': 501, Errors: 120, 'Mean time to detect': 2920, 'Mean time to resolve': 5120 },
  { date: 'Aug 27', 'Successful requests': 480, Errors: 120, 'Mean time to detect': 3120, 'Mean time to resolve': 4910 },
  { date: 'Aug 28', 'Successful requests': 471, Errors: 120, 'Mean time to detect': 3150, 'Mean time to resolve': 4210 },
  { date: 'Aug 29', 'Successful requests': 610, Errors: 89, 'Mean time to detect': 2350, 'Mean time to resolve': 4620 },
  { date: 'Aug 30', 'Successful requests': 513, Errors: 199, 'Mean time to detect': 2350, 'Mean time to resolve': 4130 },
  { date: 'Aug 31', 'Successful requests': 500, Errors: 56, 'Mean time to detect': 2431, 'Mean time to resolve': 4130 },
];

const timeFormatter = (seconds: number) => {
  const minutes = Math.floor((seconds % 3600) / 60);
  return minutes + 'm';
};

const numberFormatter = (number: number) =>
  Intl.NumberFormat('us').format(number).toString();

const tabs = [
  {
    name: 'API requests',
    data: data,
    valueFormatter: numberFormatter,
    categories: ['Successful requests', 'Errors'],
    colors: ['blue', 'red'],
    summary: [
      { name: 'Successful requests', total: '23,450', color: 'bg-blue-500' },
      { name: 'Errors', total: '1,397', color: 'bg-red-500' },
    ],
  },
  {
    name: 'Incident response',
    data: data,
    valueFormatter: timeFormatter,
    categories: ['Mean time to resolve', 'Mean time to detect'],
    colors: ['blue', 'red'],
    summary: [
      { name: 'Mean time to resolve', total: '47min 44s', color: 'bg-blue-500' },
      { name: 'Mean time to detect', total: '31min 8s', color: 'bg-red-500' },
    ],
  },
];

export function AreaChart13() {
  return (
    <Card className="p-0">
      <div className="rounded-t-lg p-6">
        <h3 className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
          Monitoring
        </h3>
        <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
          API performance and incident response metrics
        </p>
      </div>
      <TabGroup>
        <TabList className="px-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className="font-medium hover:border-tremor-content-subtle dark:hover:border-dark-tremor-content-subtle dark:hover:text-dark-tremor-content"
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((tab) => (
            <TabPanel key={tab.name} className="mt-0 p-6">
              <div className="md:flex md:items-start md:justify-between">
                <ul
                  role="list"
                  className="flex flex-wrap items-center gap-x-10 gap-y-4"
                >
                  {tab.summary.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-center space-x-2">
                        <span
                          className={classNames(
                            item.color,
                            'size-3 shrink-0 rounded-sm',
                          )}
                          aria-hidden={true}
                        />
                        <p className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                          {item.total}
                        </p>
                      </div>
                      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                        {item.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <AreaChart
                data={data}
                index="date"
                categories={tab.categories}
                colors={tab.colors as ('blue' | 'red')[]}
                showLegend={false}
                showGradient={false}
                yAxisWidth={45}
                valueFormatter={tab.valueFormatter}
                className="mt-10 hidden h-72 sm:block"
              />
              <AreaChart
                data={data}
                index="date"
                categories={tab.categories}
                colors={tab.colors as ('blue' | 'red')[]}
                showLegend={false}
                showGradient={false}
                showYAxis={false}
                startEndOnly={true}
                valueFormatter={tab.valueFormatter}
                className="mt-6 h-72 sm:hidden"
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
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
    `- ${t.id}: ${t.name} - ${t.description} [Tags: ${t.tags.join(', ')}]`
  ).join('\n')
}
