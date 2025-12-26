// TypeScript types for AI-generated dashboards

export interface DashboardComponent {
  id: string
  type: string
  props?: Record<string, any>
  children?: DashboardComponent[] | string
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'stack'
  columns?: number
  gap?: string
}

export interface DashboardConfig {
  title: string
  description?: string
  layout: DashboardLayout
  components: DashboardComponent[]
  createdAt?: string
  updatedAt?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  dashboard?: DashboardConfig
  timestamp: Date
}

export interface ExportFormat {
  format: 'react' | 'json' | 'typescript'
  code: string
}

