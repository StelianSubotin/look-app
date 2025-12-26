// Tremor Component Catalog for AI Dashboard Generator

export interface TremorComponent {
  id: string
  name: string
  category: 'charts' | 'kpis' | 'layout' | 'input' | 'data' | 'visualization' | 'text'
  description: string
  bestFor: string[]
  props: {
    [key: string]: {
      type: string
      required: boolean
      default?: any
      description: string
    }
  }
  example: string
}

export const tremorComponents: TremorComponent[] = [
  // CHARTS
  {
    id: 'area-chart',
    name: 'AreaChart',
    category: 'charts',
    description: 'Display trends over time with filled area under the line. Perfect for showing cumulative data or trends.',
    bestFor: ['revenue trends', 'user growth', 'sales over time', 'traffic analytics'],
    props: {
      data: { type: 'array', required: true, description: 'Array of data objects' },
      categories: { type: 'string[]', required: true, description: 'Array of data keys to plot' },
      index: { type: 'string', required: true, description: 'Key for x-axis (usually date/time)' },
      colors: { type: 'string[]', required: false, default: ['blue'], description: 'Color palette' },
      showLegend: { type: 'boolean', required: false, default: true, description: 'Show legend' },
      showGridLines: { type: 'boolean', required: false, default: true, description: 'Show grid' }
    },
    example: 'Use for monthly revenue growth or daily active users'
  },
  {
    id: 'bar-chart',
    name: 'BarChart',
    category: 'charts',
    description: 'Compare values across categories with vertical or horizontal bars.',
    bestFor: ['category comparison', 'sales by region', 'performance metrics', 'rankings'],
    props: {
      data: { type: 'array', required: true, description: 'Array of data objects' },
      categories: { type: 'string[]', required: true, description: 'Array of data keys to plot' },
      index: { type: 'string', required: true, description: 'Key for categories' },
      colors: { type: 'string[]', required: false, default: ['blue'], description: 'Color palette' },
      stack: { type: 'boolean', required: false, default: false, description: 'Stack bars' },
      layout: { type: 'string', required: false, default: 'vertical', description: 'vertical or horizontal' }
    },
    example: 'Use for sales by product category or bookings by room type'
  },
  {
    id: 'line-chart',
    name: 'LineChart',
    category: 'charts',
    description: 'Display trends and changes over time with connected line points.',
    bestFor: ['time series', 'stock prices', 'temperature trends', 'performance over time'],
    props: {
      data: { type: 'array', required: true, description: 'Array of data objects' },
      categories: { type: 'string[]', required: true, description: 'Array of data keys to plot' },
      index: { type: 'string', required: true, description: 'Key for x-axis' },
      colors: { type: 'string[]', required: false, default: ['blue'], description: 'Color palette' },
      curveType: { type: 'string', required: false, default: 'linear', description: 'linear or natural' }
    },
    example: 'Use for daily revenue or hourly traffic patterns'
  },
  {
    id: 'donut-chart',
    name: 'DonutChart',
    category: 'charts',
    description: 'Show parts of a whole in a circular format with a hole in the center.',
    bestFor: ['market share', 'category breakdown', 'percentage distribution', 'composition'],
    props: {
      data: { type: 'array', required: true, description: 'Array of data objects' },
      category: { type: 'string', required: true, description: 'Key for labels' },
      value: { type: 'string', required: true, description: 'Key for values' },
      colors: { type: 'string[]', required: false, description: 'Color palette' },
      showLabel: { type: 'boolean', required: false, default: true, description: 'Show center label' }
    },
    example: 'Use for revenue by department or room occupancy by floor'
  },
  
  // KPIs
  {
    id: 'metric',
    name: 'Card with Metric',
    category: 'kpis',
    description: 'Display a key performance indicator with optional trend and comparison.',
    bestFor: ['KPIs', 'key metrics', 'statistics', 'performance numbers'],
    props: {
      title: { type: 'string', required: true, description: 'Metric label' },
      metric: { type: 'string', required: true, description: 'The main number/value' },
      progress: { type: 'number', required: false, description: 'Progress percentage (0-100)' },
      target: { type: 'string', required: false, description: 'Target or goal value' },
      delta: { type: 'string', required: false, description: 'Change percentage' },
      deltaType: { type: 'string', required: false, description: 'increase, decrease, or unchanged' }
    },
    example: 'Use for Total Revenue: $45,230 (↑12%)'
  },
  {
    id: 'badge-delta',
    name: 'BadgeDelta',
    category: 'kpis',
    description: 'Small badge showing increase/decrease with colored indicator.',
    bestFor: ['trend indicators', 'change metrics', 'performance deltas'],
    props: {
      deltaType: { type: 'string', required: true, description: 'increase, decrease, or unchanged' },
      children: { type: 'string', required: true, description: 'The percentage or value' }
    },
    example: 'Use to show +12.5% growth indicator'
  },
  
  // LAYOUT
  {
    id: 'card',
    name: 'Card',
    category: 'layout',
    description: 'Container for grouping related content with optional header and footer.',
    bestFor: ['content sections', 'widget containers', 'grouping elements'],
    props: {
      children: { type: 'ReactNode', required: true, description: 'Card content' },
      decoration: { type: 'string', required: false, description: 'top or left border decoration' },
      decorationColor: { type: 'string', required: false, description: 'Decoration color' }
    },
    example: 'Use to wrap charts, metrics, or content sections'
  },
  {
    id: 'grid',
    name: 'Grid',
    category: 'layout',
    description: 'Responsive grid layout for organizing multiple components.',
    bestFor: ['dashboard layouts', 'metric grids', 'card layouts'],
    props: {
      numItems: { type: 'number', required: false, default: 1, description: 'Default columns' },
      numItemsSm: { type: 'number', required: false, description: 'Columns on small screens' },
      numItemsMd: { type: 'number', required: false, description: 'Columns on medium screens' },
      numItemsLg: { type: 'number', required: false, description: 'Columns on large screens' },
      children: { type: 'ReactNode', required: true, description: 'Grid items' }
    },
    example: 'Use to create 3-column metric grid or 2-column chart layout'
  },
  {
    id: 'flex',
    name: 'Flex',
    category: 'layout',
    description: 'Flexible box layout for arranging items horizontally or vertically.',
    bestFor: ['inline layouts', 'toolbar arrangement', 'horizontal/vertical stacks'],
    props: {
      flexDirection: { type: 'string', required: false, default: 'row', description: 'row or column' },
      justifyContent: { type: 'string', required: false, description: 'start, center, end, between' },
      alignItems: { type: 'string', required: false, description: 'start, center, end, stretch' },
      children: { type: 'ReactNode', required: true, description: 'Flex items' }
    },
    example: 'Use for header with title and actions'
  },
  {
    id: 'divider',
    name: 'Divider',
    category: 'layout',
    description: 'Visual separator between sections.',
    bestFor: ['section separation', 'content breaks', 'visual spacing'],
    props: {},
    example: 'Use to separate dashboard sections'
  },
  
  // DATA
  {
    id: 'table',
    name: 'Table',
    category: 'data',
    description: 'Display structured data in rows and columns with sorting capability.',
    bestFor: ['tabular data', 'lists', 'detailed records', 'transaction history'],
    props: {
      data: { type: 'array', required: true, description: 'Array of row objects' },
      columns: { type: 'array', required: true, description: 'Column definitions with header and accessor' }
    },
    example: 'Use for recent bookings, transaction history, or user lists'
  },
  {
    id: 'list',
    name: 'List',
    category: 'data',
    description: 'Vertical list of items with optional icons and actions.',
    bestFor: ['activity feeds', 'recent items', 'ranked lists', 'menu items'],
    props: {
      items: { type: 'array', required: true, description: 'Array of list items' }
    },
    example: 'Use for recent activity or top performing items'
  },
  
  // INPUT
  {
    id: 'text-input',
    name: 'TextInput',
    category: 'input',
    description: 'Text input field for user entry.',
    bestFor: ['forms', 'search', 'data entry'],
    props: {
      placeholder: { type: 'string', required: false, description: 'Placeholder text' },
      value: { type: 'string', required: false, description: 'Input value' },
      onChange: { type: 'function', required: false, description: 'Change handler' }
    },
    example: 'Use for search or filter inputs'
  },
  {
    id: 'select',
    name: 'Select',
    category: 'input',
    description: 'Dropdown select for choosing from options.',
    bestFor: ['filters', 'category selection', 'option picking'],
    props: {
      value: { type: 'string', required: false, description: 'Selected value' },
      onValueChange: { type: 'function', required: false, description: 'Change handler' },
      children: { type: 'ReactNode', required: true, description: 'SelectItem components' }
    },
    example: 'Use for date range or category filters'
  },
  {
    id: 'date-range-picker',
    name: 'DateRangePicker',
    category: 'input',
    description: 'Select a date range with calendar interface.',
    bestFor: ['date filtering', 'time range selection', 'analytics periods'],
    props: {
      value: { type: 'object', required: false, description: 'Selected date range' },
      onValueChange: { type: 'function', required: false, description: 'Change handler' },
      enableSelect: { type: 'boolean', required: false, default: true, description: 'Enable selection' }
    },
    example: 'Use for dashboard date filtering'
  },
  
  // TEXT
  {
    id: 'title',
    name: 'Title',
    category: 'text',
    description: 'Large heading text for sections.',
    bestFor: ['page titles', 'section headers', 'main headings'],
    props: {
      children: { type: 'string', required: true, description: 'Title text' }
    },
    example: 'Use for "Dashboard Overview" or section titles'
  },
  {
    id: 'text',
    name: 'Text',
    category: 'text',
    description: 'Body text with consistent styling.',
    bestFor: ['descriptions', 'body content', 'labels'],
    props: {
      children: { type: 'string', required: true, description: 'Text content' }
    },
    example: 'Use for descriptions or supporting text'
  }
]

// System prompt for AI
export const getSystemPrompt = () => `You are an expert dashboard designer. You help users create beautiful, functional dashboards using Tremor components.

AVAILABLE TREMOR COMPONENTS:
${tremorComponents.map(c => `
- ${c.name} (${c.category}): ${c.description}
  Best for: ${c.bestFor.join(', ')}
  Example: ${c.example}
`).join('\n')}

DESIGN PRINCIPLES:
1. Start with key metrics at the top (use Card with Metric)
2. Follow with visualizations (AreaChart, BarChart, etc.)
3. Include detailed data tables at the bottom if needed
4. Use Grid for responsive layouts (typically 1-3 columns)
5. Use consistent colors from Tremor palette: blue, cyan, indigo, violet, purple, fuchsia, pink, rose, orange, amber, yellow, lime, green, emerald, teal, sky
6. Keep dashboards clean and focused - don't overcrowd

DASHBOARD TYPES:
- Analytics: Focus on metrics, trends, and comparisons
- Financial: Revenue, expenses, profit charts with KPIs
- Operations: Real-time monitoring, status, performance
- Hotel: Occupancy, revenue, bookings, room status
- SaaS: MRR, churn, user growth, engagement

RESPONSE FORMAT:
You MUST respond with valid JSON only, no other text. Use this exact structure:

{
  "title": "Dashboard Title",
  "description": "Brief description",
  "layout": {
    "type": "grid",
    "columns": 3
  },
  "components": [
    {
      "id": "unique-id",
      "type": "Card",
      "props": {
        "decoration": "top",
        "decorationColor": "blue"
      },
      "children": [
        {
          "id": "metric-1",
          "type": "Title",
          "props": { "children": "Total Revenue" }
        },
        {
          "id": "metric-2",
          "type": "Metric",
          "props": { "children": "$45,230" }
        }
      ]
    }
  ]
}

IMPORTANT RULES:
- Every component needs a unique "id"
- Use realistic sample data that matches the user's request
- For charts, include mock data arrays
- Nest components logically (Cards contain metrics/charts, Grids contain Cards)
- Always respond with valid JSON only
- No markdown, no explanations, just JSON`

export const getCategoryDescription = (category: string) => {
  const descriptions = {
    charts: 'Visual representations of data over time or by category',
    kpis: 'Key performance indicators and metric displays',
    layout: 'Containers and structural components for organizing content',
    input: 'Interactive controls for filtering and data entry',
    data: 'Components for displaying structured data',
    visualization: 'Progress bars and visual indicators',
    text: 'Typography and text elements'
  }
  return descriptions[category as keyof typeof descriptions] || ''
}

