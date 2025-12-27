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
import { EditableKpiCard } from './editable-kpi-card'

interface DashboardRendererProps {
  config: DashboardConfig | null
  className?: string
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

export function DashboardRenderer({ 
  config, 
  className = '',
  customStyles,
  onStylesChange
}: DashboardRendererProps) {
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
        {renderLayout(config.layout, config.components, customStyles, onStylesChange)}
      </div>
    </div>
  )
}

function renderLayout(
  layout: DashboardConfig['layout'], 
  components: DashboardComponent[],
  customStyles?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  },
  onStylesChange?: (styles: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }) => void
) {
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
            {renderComponent(component, customStyles, onStylesChange)}
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
            {renderComponent(component, customStyles, onStylesChange)}
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
          {renderComponent(component, customStyles, onStylesChange)}
        </div>
      ))}
    </div>
  )
}

function renderComponent(
  component: DashboardComponent,
  customStyles?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  },
  onStylesChange?: (styles: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }) => void
): React.ReactNode {
  const { type, props = {}, children } = component

  // Recursively render children
  const renderedChildren = Array.isArray(children)
    ? children.map(child => (
        <div key={child.id}>
          {renderComponent(child, customStyles, onStylesChange)}
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

    // CHARTS
    case 'AreaChart':
      return <AreaChart 
        data={props.data || []} 
        categories={props.categories || []} 
        index={props.index || 'name'}
        {...props} 
      />

    case 'BarChart':
      return <BarChart 
        data={props.data || []} 
        categories={props.categories || []} 
        index={props.index || 'name'}
        {...props} 
      />

    case 'LineChart':
      return <LineChart 
        data={props.data || []} 
        categories={props.categories || []} 
        index={props.index || 'name'}
        {...props} 
      />

    case 'DonutChart':
      return <DonutChart 
        data={props.data || []} 
        category={props.category || 'value'} 
        index={props.index || 'name'}
        {...props} 
      />

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

    case 'kpi':
      return (
        <EditableKpiCard
          data={props.data || []}
          title={props.title}
          styles={customStyles}
          onStylesChange={onStylesChange}
        />
      )

    default:
      console.warn(`Unknown component type: ${type}`)
      return (
        <Card>
          <Text>Unknown component: {type}</Text>
        </Card>
      )
  }
}

function renderTable(props: any) {
  const { data = [], columns = [] } = props

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col: any, idx: number) => (
            <TableHeaderCell key={idx}>
              {col.header || col.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row: any, rowIdx: number) => (
          <TableRow key={rowIdx}>
            {columns.map((col: any, colIdx: number) => (
              <TableCell key={colIdx}>
                {row[col.accessor || col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function renderList(props: any) {
  const { items = [] } = props

  return (
    <List>
      {items.map((item: any, idx: number) => (
        <ListItem key={idx}>
          {item.name || item.label || item}
        </ListItem>
      ))}
    </List>
  )
}

function renderSelect(props: any) {
  const { options = [], ...rest } = props

  return (
    <Select {...rest}>
      {options.map((option: any, idx: number) => (
        <SelectItem key={idx} value={option.value || option}>
          {option.label || option}
        </SelectItem>
      ))}
    </Select>
  )
}

