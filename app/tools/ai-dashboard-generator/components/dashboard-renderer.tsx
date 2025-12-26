"use client"

import { 
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
  Divider,
  BadgeDelta,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TextInput,
  Select,
  SelectItem,
  DateRangePicker,
  List,
  ListItem
} from '@tremor/react'
import type { DashboardComponent, DashboardConfig } from '@/lib/dashboard-schema'

interface DashboardRendererProps {
  config: DashboardConfig | null
  className?: string
}

// Default chart data for when AI doesn't provide data
const defaultChartData = [
  { date: 'Jan', value: 100 },
  { date: 'Feb', value: 120 },
  { date: 'Mar', value: 115 },
  { date: 'Apr', value: 140 },
  { date: 'May', value: 155 },
  { date: 'Jun', value: 170 },
]

const defaultDonutData = [
  { name: 'Category A', value: 40 },
  { name: 'Category B', value: 30 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 10 },
]

export function DashboardRenderer({ config, className = '' }: DashboardRendererProps) {
  if (!config) {
    return (
      <div className="flex items-center justify-center h-full p-12 text-center">
        <div>
          <div className="text-6xl mb-4">🎨</div>
          <Title>No Dashboard Yet</Title>
          <Text className="mt-2">
            Describe the dashboard you want to create in the chat
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Header */}
      {config.title && (
        <div className="space-y-2">
          <Title>{config.title}</Title>
          {config.description && <Text>{config.description}</Text>}
        </div>
      )}

      {/* Render Components */}
      <div>
        {renderLayout(config.layout, config.components)}
      </div>
    </div>
  )
}

function renderLayout(layout: DashboardConfig['layout'], components: DashboardComponent[]) {
  if (layout.type === 'grid') {
    return (
      <Grid 
        numItemsSm={1} 
        numItemsMd={2} 
        numItemsLg={layout.columns || 3}
        className="gap-6"
      >
        {components.map(component => (
          <div key={component.id}>
            {renderComponent(component)}
          </div>
        ))}
      </Grid>
    )
  }

  if (layout.type === 'flex') {
    return (
      <Flex className="gap-6">
        {components.map(component => (
          <div key={component.id}>
            {renderComponent(component)}
          </div>
        ))}
      </Flex>
    )
  }

  // Default stack layout
  return (
    <div className="space-y-6">
      {components.map(component => (
        <div key={component.id}>
          {renderComponent(component)}
        </div>
      ))}
    </div>
  )
}

function renderComponent(component: DashboardComponent): React.ReactNode {
  const { type, props = {}, children } = component

  // Recursively render children
  const renderedChildren = Array.isArray(children)
    ? children.map(child => (
        <div key={child.id}>
          {renderComponent(child)}
        </div>
      ))
    : children

  switch (type) {
    // LAYOUT
    case 'Card':
      return (
        <Card {...props}>
          {renderedChildren}
        </Card>
      )

    case 'Grid':
      return (
        <Grid {...props}>
          {renderedChildren}
        </Grid>
      )

    case 'Flex':
      return (
        <Flex {...props}>
          {renderedChildren}
        </Flex>
      )

    case 'Divider':
      return <Divider />

    // TEXT
    case 'Title':
      return <Title {...props}>{props.children || renderedChildren}</Title>

    case 'Text':
      return <Text {...props}>{props.children || renderedChildren}</Text>

    case 'Metric':
      return <Metric {...props}>{props.children || renderedChildren}</Metric>

    case 'BadgeDelta':
      return <BadgeDelta {...props}>{props.children || renderedChildren}</BadgeDelta>

    // CHARTS - with default props to satisfy TypeScript
    case 'AreaChart':
      return (
        <AreaChart 
          data={props.data || defaultChartData}
          index={props.index || 'date'}
          categories={props.categories || ['value']}
          colors={props.colors}
          showLegend={props.showLegend}
          showGridLines={props.showGridLines}
        />
      )

    case 'BarChart':
      return (
        <BarChart 
          data={props.data || defaultChartData}
          index={props.index || 'date'}
          categories={props.categories || ['value']}
          colors={props.colors}
          stack={props.stack}
          layout={props.layout}
        />
      )

    case 'LineChart':
      return (
        <LineChart 
          data={props.data || defaultChartData}
          index={props.index || 'date'}
          categories={props.categories || ['value']}
          colors={props.colors}
        />
      )

    case 'DonutChart':
      return (
        <DonutChart 
          data={props.data || defaultDonutData}
          category={props.category || 'value'}
          index={props.index || 'name'}
          colors={props.colors}
        />
      )

    // DATA
    case 'Table':
      return renderTable(props)

    case 'List':
      return renderList(props)

    // INPUT
    case 'TextInput':
      return <TextInput {...props} />

    case 'Select':
      return renderSelect(props)

    case 'DateRangePicker':
      return <DateRangePicker {...props} />

    default:
      console.warn(`Unknown component type: ${type}`)
      return (
        <Card>
          <Text>Unknown component: {type}</Text>
        </Card>
      )
  }
}

function renderTable(props: Record<string, unknown>) {
  const data = (props.data || []) as Record<string, unknown>[]
  const columns = (props.columns || []) as { header?: string; label?: string; accessor?: string; key?: string }[]

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col, idx: number) => (
            <TableHeaderCell key={idx}>
              {col.header || col.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, rowIdx: number) => (
          <TableRow key={rowIdx}>
            {columns.map((col, colIdx: number) => (
              <TableCell key={colIdx}>
                {String(row[col.accessor || col.key || ''] || '')}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function renderList(props: Record<string, unknown>) {
  const items = (props.items || []) as (string | { name?: string; label?: string })[]

  return (
    <List>
      {items.map((item, idx: number) => (
        <ListItem key={idx}>
          {typeof item === 'string' ? item : item.name || item.label || ''}
        </ListItem>
      ))}
    </List>
  )
}

function renderSelect(props: Record<string, unknown>) {
  const options = (props.options || []) as (string | { value?: string; label?: string })[]
  const { options: _, ...rest } = props

  return (
    <Select {...rest}>
      {options.map((option, idx: number) => (
        <SelectItem 
          key={idx} 
          value={typeof option === 'string' ? option : option.value || ''}
        >
          {typeof option === 'string' ? option : option.label || option.value || ''}
        </SelectItem>
      ))}
    </Select>
  )
}
