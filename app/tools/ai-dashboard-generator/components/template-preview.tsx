'use client';

import { useState } from 'react';
import { Card } from '@tremor/react';
import { Button } from '@/components/ui/button';

// Import all template components directly
import { AreaChart, List, ListItem } from '@tremor/react';
import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// TEMPLATE 1: Area Chart with Summary List
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
    <Card className="sm:mx-auto sm:max-w-lg">
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
// TEMPLATE 2: KPI Cards with Change Indicators
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
// TEMPLATE PREVIEW COMPONENT
// ============================================
const templates = [
  { id: 'kpi-card-8', name: 'KPI Cards with Change Indicators', component: KpiCard8 },
  { id: 'area-chart-1', name: 'Area Chart with Summary List', component: AreaChart1 },
];

export function TemplatePreview() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);

  const SelectedComponent = templates.find(t => t.id === selectedTemplate)?.component || templates[0].component;

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant={selectedTemplate === template.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTemplate(template.id)}
          >
            {template.name}
          </Button>
        ))}
      </div>

      {/* Template Preview */}
      <div className="rounded-lg border bg-white dark:bg-gray-950 p-6">
        <SelectedComponent />
      </div>
    </div>
  );
}
