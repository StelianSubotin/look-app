// Dashboard Template Library
// Store polished, production-ready dashboard templates from Tremor Blocks

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  category: 'kpi' | 'chart' | 'table' | 'layout' | 'full-dashboard'
  tags: string[]
  component: string // The actual React component code
}

// Template library - will be populated with Tremor Blocks
export const dashboardTemplates: DashboardTemplate[] = [
  // Templates will be added here as you provide them
  // Example structure:
  // {
  //   id: 'kpi-card-with-trend',
  //   name: 'KPI Card with Trend',
  //   description: 'Beautiful metric card with trend indicator',
  //   category: 'kpi',
  //   tags: ['metrics', 'kpi', 'trend', 'revenue', 'sales'],
  //   component: `...actual JSX code...`
  // }
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
