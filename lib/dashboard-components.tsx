"use client"

import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Table as TableIcon,
  LayoutGrid,
  Bell
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts"

// Sample data for charts
const lineChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

const barChartData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 150 },
  { name: 'Wed', value: 180 },
  { name: 'Thu', value: 140 },
  { name: 'Fri', value: 200 },
]

const pieChartData = [
  { name: 'Desktop', value: 400, color: '#3b82f6' },
  { name: 'Mobile', value: 300, color: '#10b981' },
  { name: 'Tablet', value: 200, color: '#f59e0b' },
]

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', amount: '$250.00', status: 'Completed' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: '$150.00', status: 'Pending' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', amount: '$350.00', status: 'Completed' },
]

// Component Registry
export interface DashboardComponentConfig {
  id: string
  type: string
  props: Record<string, any>
}

export interface ComponentDefinition {
  type: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  category: 'stats' | 'charts' | 'data' | 'layout'
  defaultProps: Record<string, any>
  editableProps: {
    key: string
    label: string
    type: 'text' | 'number' | 'select' | 'color'
    options?: string[]
  }[]
}

export const componentRegistry: ComponentDefinition[] = [
  // Stats Components
  {
    type: 'stat-card',
    name: 'Stat Card',
    icon: Activity,
    category: 'stats',
    defaultProps: {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      changeType: 'positive',
      icon: 'dollar'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
      { key: 'change', label: 'Change', type: 'text' },
      { key: 'changeType', label: 'Change Type', type: 'select', options: ['positive', 'negative', 'neutral'] },
      { key: 'icon', label: 'Icon', type: 'select', options: ['dollar', 'users', 'cart', 'activity'] }
    ]
  },
  {
    type: 'stat-card-mini',
    name: 'Mini Stat',
    icon: LayoutGrid,
    category: 'stats',
    defaultProps: {
      label: 'Active Users',
      value: '2,350',
      color: 'blue'
    },
    editableProps: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'value', label: 'Value', type: 'text' },
      { key: 'color', label: 'Color', type: 'select', options: ['blue', 'green', 'red', 'purple', 'orange'] }
    ]
  },
  // Chart Components
  {
    type: 'line-chart',
    name: 'Line Chart',
    icon: LineChartIcon,
    category: 'charts',
    defaultProps: {
      title: 'Revenue Over Time',
      color: '#3b82f6'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'color', label: 'Line Color', type: 'color' }
    ]
  },
  {
    type: 'bar-chart',
    name: 'Bar Chart',
    icon: BarChart3,
    category: 'charts',
    defaultProps: {
      title: 'Weekly Activity',
      color: '#10b981'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'color', label: 'Bar Color', type: 'color' }
    ]
  },
  {
    type: 'area-chart',
    name: 'Area Chart',
    icon: Activity,
    category: 'charts',
    defaultProps: {
      title: 'Traffic Overview',
      color: '#8b5cf6'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'color', label: 'Area Color', type: 'color' }
    ]
  },
  {
    type: 'pie-chart',
    name: 'Pie Chart',
    icon: PieChartIcon,
    category: 'charts',
    defaultProps: {
      title: 'Traffic by Device'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' }
    ]
  },
  // Data Components
  {
    type: 'data-table',
    name: 'Data Table',
    icon: TableIcon,
    category: 'data',
    defaultProps: {
      title: 'Recent Transactions'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' }
    ]
  },
  {
    type: 'alert-card',
    name: 'Alert Card',
    icon: Bell,
    category: 'data',
    defaultProps: {
      title: 'System Alert',
      message: 'Your trial expires in 3 days. Upgrade now!',
      type: 'warning'
    },
    editableProps: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'message', label: 'Message', type: 'text' },
      { key: 'type', label: 'Type', type: 'select', options: ['info', 'warning', 'error', 'success'] }
    ]
  }
]

// Icon map
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dollar: DollarSign,
  users: Users,
  cart: ShoppingCart,
  activity: Activity
}

// Render Components
export function renderDashboardComponent(config: DashboardComponentConfig) {
  const { type, props, id } = config

  switch (type) {
    case 'stat-card':
      const IconComponent = iconMap[props.icon] || Activity
      return (
        <Card key={id} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.value}</div>
            <p className={`text-xs ${
              props.changeType === 'positive' ? 'text-green-600' : 
              props.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {props.changeType === 'positive' && <TrendingUp className="inline h-3 w-3 mr-1" />}
              {props.changeType === 'negative' && <TrendingDown className="inline h-3 w-3 mr-1" />}
              {props.change} from last month
            </p>
          </CardContent>
        </Card>
      )

    case 'stat-card-mini':
      const colorClasses: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-green-100 text-green-700',
        red: 'bg-red-100 text-red-700',
        purple: 'bg-purple-100 text-purple-700',
        orange: 'bg-orange-100 text-orange-700'
      }
      return (
        <Card key={id} className="h-full">
          <CardContent className="pt-6">
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${colorClasses[props.color] || colorClasses.blue}`}>
              {props.label}
            </div>
            <div className="text-3xl font-bold">{props.value}</div>
          </CardContent>
        </Card>
      )

    case 'line-chart':
      return (
        <Card key={id} className="h-full">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={props.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )

    case 'bar-chart':
      return (
        <Card key={id} className="h-full">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill={props.color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )

    case 'area-chart':
      return (
        <Card key={id} className="h-full">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke={props.color} fill={props.color} fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )

    case 'pie-chart':
      return (
        <Card key={id} className="h-full">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {pieChartData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )

    case 'data-table':
      return (
        <Card key={id} className="h-full">
          <CardHeader>
            <CardTitle>{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Name</th>
                    <th className="text-left py-2 font-medium">Email</th>
                    <th className="text-left py-2 font-medium">Amount</th>
                    <th className="text-left py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="py-2">{row.name}</td>
                      <td className="py-2 text-muted-foreground">{row.email}</td>
                      <td className="py-2 font-medium">{row.amount}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )

    case 'alert-card':
      const alertColors: Record<string, string> = {
        info: 'border-blue-500 bg-blue-50',
        warning: 'border-yellow-500 bg-yellow-50',
        error: 'border-red-500 bg-red-50',
        success: 'border-green-500 bg-green-50'
      }
      return (
        <Card key={id} className={`h-full border-l-4 ${alertColors[props.type] || alertColors.info}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{props.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{props.message}</p>
          </CardContent>
        </Card>
      )

    default:
      return (
        <Card key={id} className="h-full flex items-center justify-center">
          <CardContent>
            <p className="text-muted-foreground">Unknown component: {type}</p>
          </CardContent>
        </Card>
      )
  }
}

// Dashboard Templates
export const dashboardTemplates = [
  {
    id: 'sales',
    name: 'Sales Dashboard',
    description: 'Track revenue, orders, and customer metrics',
    components: [
      { id: '1', type: 'stat-card', props: { title: 'Total Revenue', value: '$45,231', change: '+20.1%', changeType: 'positive', icon: 'dollar' } },
      { id: '2', type: 'stat-card', props: { title: 'Orders', value: '2,350', change: '+15%', changeType: 'positive', icon: 'cart' } },
      { id: '3', type: 'stat-card', props: { title: 'Customers', value: '1,203', change: '+8%', changeType: 'positive', icon: 'users' } },
      { id: '4', type: 'stat-card', props: { title: 'Conversion', value: '3.2%', change: '-2%', changeType: 'negative', icon: 'activity' } },
      { id: '5', type: 'line-chart', props: { title: 'Revenue Over Time', color: '#3b82f6' } },
      { id: '6', type: 'bar-chart', props: { title: 'Sales by Day', color: '#10b981' } },
      { id: '7', type: 'data-table', props: { title: 'Recent Transactions' } },
      { id: '8', type: 'pie-chart', props: { title: 'Sales by Channel' } },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Monitor traffic, engagement, and performance',
    components: [
      { id: '1', type: 'stat-card-mini', props: { label: 'Page Views', value: '124,592', color: 'blue' } },
      { id: '2', type: 'stat-card-mini', props: { label: 'Unique Visitors', value: '45,201', color: 'green' } },
      { id: '3', type: 'stat-card-mini', props: { label: 'Bounce Rate', value: '32.5%', color: 'red' } },
      { id: '4', type: 'stat-card-mini', props: { label: 'Avg. Session', value: '4m 32s', color: 'purple' } },
      { id: '5', type: 'area-chart', props: { title: 'Traffic Overview', color: '#8b5cf6' } },
      { id: '6', type: 'pie-chart', props: { title: 'Traffic by Device' } },
      { id: '7', type: 'bar-chart', props: { title: 'Top Pages', color: '#3b82f6' } },
    ]
  },
  {
    id: 'blank',
    name: 'Blank Dashboard',
    description: 'Start from scratch',
    components: []
  }
]

// Generate React code from config
export function generateReactCode(components: DashboardComponentConfig[]): string {
  const imports = new Set<string>()
  imports.add(`import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"`)
  
  const hasCharts = components.some(c => ['line-chart', 'bar-chart', 'area-chart', 'pie-chart'].includes(c.type))
  if (hasCharts) {
    imports.add(`import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"`)
  }

  const hasIcons = components.some(c => c.type === 'stat-card')
  if (hasIcons) {
    imports.add(`import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react"`)
  }

  let code = `"use client"

${Array.from(imports).join('\n')}

// Sample data - replace with your actual data
const chartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

const pieData = [
  { name: 'Desktop', value: 400, color: '#3b82f6' },
  { name: 'Mobile', value: 300, color: '#10b981' },
  { name: 'Tablet', value: 200, color: '#f59e0b' },
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
`

  // Generate component code
  components.forEach((comp, index) => {
    code += generateComponentCode(comp, index)
  })

  code += `      </div>
    </div>
  )
}`

  return code
}

function generateComponentCode(config: DashboardComponentConfig, index: number): string {
  const { type, props } = config
  const indent = '        '

  switch (type) {
    case 'stat-card':
      return `${indent}<Card>
${indent}  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
${indent}    <CardTitle className="text-sm font-medium">${props.title}</CardTitle>
${indent}    <${props.icon === 'dollar' ? 'DollarSign' : props.icon === 'users' ? 'Users' : props.icon === 'cart' ? 'ShoppingCart' : 'Activity'} className="h-4 w-4 text-muted-foreground" />
${indent}  </CardHeader>
${indent}  <CardContent>
${indent}    <div className="text-2xl font-bold">${props.value}</div>
${indent}    <p className="text-xs ${props.changeType === 'positive' ? 'text-green-600' : props.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'}">
${indent}      ${props.changeType === 'positive' ? '<TrendingUp className="inline h-3 w-3 mr-1" />' : props.changeType === 'negative' ? '<TrendingDown className="inline h-3 w-3 mr-1" />' : ''}
${indent}      ${props.change} from last month
${indent}    </p>
${indent}  </CardContent>
${indent}</Card>
`
    case 'line-chart':
      return `${indent}<Card className="col-span-2">
${indent}  <CardHeader>
${indent}    <CardTitle>${props.title}</CardTitle>
${indent}  </CardHeader>
${indent}  <CardContent>
${indent}    <ResponsiveContainer width="100%" height={300}>
${indent}      <LineChart data={chartData}>
${indent}        <CartesianGrid strokeDasharray="3 3" />
${indent}        <XAxis dataKey="name" />
${indent}        <YAxis />
${indent}        <Tooltip />
${indent}        <Line type="monotone" dataKey="value" stroke="${props.color}" strokeWidth={2} />
${indent}      </LineChart>
${indent}    </ResponsiveContainer>
${indent}  </CardContent>
${indent}</Card>
`
    default:
      return `${indent}{/* ${type} component */}\n`
  }
}

