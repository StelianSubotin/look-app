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
    description: 'Beautiful area chart with gradient, summary list below, and color-coded legend.',
    category: 'chart',
    tags: ['area', 'chart', 'metrics', 'followers', 'time-series', 'trends'],
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

const valueFormatter = (number: number) => Intl.NumberFormat('us').format(number).toString();
const statusColor: Record<string, string> = { Organic: 'bg-blue-500', Sponsored: 'bg-violet-500' };

export function AreaChart1() {
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
}`
  },

  // ============================================
  // AREA CHART 13 - Monitoring with Tabs
  // ============================================
  {
    id: 'area-chart-13',
    name: 'Monitoring Chart with Tabs',
    description: 'Advanced monitoring dashboard with tabbed views for API requests and incident response.',
    category: 'chart',
    tags: ['area', 'chart', 'monitoring', 'tabs', 'api', 'requests', 'errors', 'devops'],
    component: `'use client';
import { AreaChart, Card, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

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
];

export function AreaChart13() {
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
}`
  },

  // ============================================
  // TABLE ACTION 4 - Workspace Table with Checkboxes
  // ============================================
  {
    id: 'table-action-4',
    name: 'Data Table with Checkboxes',
    description: 'Advanced data table with row selection, sorting, hover states, and selection indicator.',
    category: 'table',
    tags: ['table', 'data', 'checkbox', 'selection', 'sorting', 'workspace', 'admin', 'list'],
    component: `'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function IndeterminateCheckbox({ indeterminate, className, ...rest }: any) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (typeof indeterminate === 'boolean' && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);
  return <input type="checkbox" ref={ref} className={classNames('size-4 rounded border-tremor-border text-tremor-brand', className)} {...rest} />;
}

const workspaces = [
  { workspace: 'sales_by_day_api', owner: 'John Doe', status: 'live', costs: '$3,509.00', region: 'US-West 1', capacity: '99%', lastEdited: '23/09/2023 13:00' },
  { workspace: 'marketing_campaign', owner: 'Jane Smith', status: 'live', costs: '$5,720.00', region: 'US-East 2', capacity: '80%', lastEdited: '22/09/2023 10:45' },
  { workspace: 'development_env', owner: 'Mike Johnson', status: 'live', costs: '$4,200.00', region: 'EU-West 1', capacity: '60%', lastEdited: '21/09/2023 14:30' },
  { workspace: 'analytics_dashboard', owner: 'Sarah Wilson', status: 'live', costs: '$6,500.00', region: 'US-West 1', capacity: '90%', lastEdited: '26/09/2023 11:30' },
  { workspace: 'test_environment', owner: 'David Clark', status: 'inactive', costs: '$800.00', region: 'EU-Central 1', capacity: '40%', lastEdited: '25/09/2023 16:20' },
];

export function TableAction4() {
  const [rowSelection, setRowSelection] = useState({});
  
  const columns = useMemo(() => [
    { id: 'select', header: ({ table }: any) => <IndeterminateCheckbox checked={table.getIsAllRowsSelected()} indeterminate={table.getIsSomeRowsSelected()} onChange={table.getToggleAllRowsSelectedHandler()} />, cell: ({ row }: any) => <IndeterminateCheckbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />, enableSorting: false, meta: { align: 'text-left' } },
    { header: 'Workspace', accessorKey: 'workspace', meta: { align: 'text-left' } },
    { header: 'Owner', accessorKey: 'owner', meta: { align: 'text-left' } },
    { header: 'Status', accessorKey: 'status', meta: { align: 'text-left' } },
    { header: 'Region', accessorKey: 'region', meta: { align: 'text-left' } },
    { header: 'Capacity', accessorKey: 'capacity', meta: { align: 'text-left' } },
    { header: 'Costs', accessorKey: 'costs', meta: { align: 'text-right' } },
    { header: 'Last edited', accessorKey: 'lastEdited', meta: { align: 'text-right' } },
  ], []);

  const table = useReactTable({ data: workspaces, columns, enableRowSelection: true, onRowSelectionChange: setRowSelection, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), state: { rowSelection } });

  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b border-tremor-border dark:border-dark-tremor-border">
            {headerGroup.headers.map((header) => (
              <TableHeaderCell key={header.id} className={(header.column.columnDef.meta as any)?.align}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHeaderCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} onClick={() => row.toggleSelected(!row.getIsSelected())} className="select-none hover:bg-tremor-background-muted dark:hover:bg-dark-tremor-background-muted cursor-pointer">
            {row.getVisibleCells().map((cell, index) => (
              <TableCell key={cell.id} className={classNames(row.getIsSelected() ? 'bg-tremor-background-muted dark:bg-dark-tremor-background-muted' : '', (cell.column.columnDef.meta as any)?.align, 'relative')}>
                {index === 0 && row.getIsSelected() && <div className="absolute inset-y-0 left-0 w-0.5 bg-tremor-brand dark:bg-dark-tremor-brand" />}
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
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

export function getTemplatesByCategory(category: string): DashboardTemplate[] {
  return dashboardTemplates.filter(t => t.category === category)
}

export function searchTemplates(query: string): DashboardTemplate[] {
  const lowerQuery = query.toLowerCase()
  return dashboardTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getTemplateList(): string {
  return dashboardTemplates.map(t => 
    `- ${t.id}: ${t.name} - ${t.description} [Tags: ${t.tags.join(', ')}]`
  ).join('\n')
}
