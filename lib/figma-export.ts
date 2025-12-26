// Figma Component Mapping
// Maps web components to Figma component node IDs

export const FIGMA_COMPONENT_IDS = {
  'kpi-card': '2:4576', // KPI Card with change indicators
  // Future components:
  // 'area-chart': 'TBD',
  // 'monitoring-chart': 'TBD',
}

export const FIGMA_FILE_KEY = 'rhjT8Zm4Q00qjC5igyeesu'

// Types
export interface FigmaKpiCardData {
  name: string
  stat: string
  previousStat: string
  change: string
  changeType: 'positive' | 'negative'
}

export interface FigmaExportComponent {
  type: 'kpi-card' | 'area-chart' | 'monitoring-chart'
  figmaComponentId: string
  data: any
  position: { x: number; y: number }
}

export interface FigmaExportData {
  fileKey: string
  components: FigmaExportComponent[]
  title?: string
  version: string
}

// Export builder
export function buildFigmaExport(dashboardConfig: any): FigmaExportData {
  const components: FigmaExportComponent[] = []
  let yPosition = 0
  
  // Process each component
  dashboardConfig.components.forEach((component: any, index: number) => {
    if (component.type === 'kpi') {
      // KPI cards - create one export per card
      const kpiData = component.props?.data || [
        { name: 'Metric 1', stat: '100', previousStat: '90', change: '11%', changeType: 'positive' },
        { name: 'Metric 2', stat: '200', previousStat: '180', change: '11%', changeType: 'positive' },
        { name: 'Metric 3', stat: '300', previousStat: '320', change: '6%', changeType: 'negative' },
      ]
      
      kpiData.forEach((kpi: FigmaKpiCardData, kpiIndex: number) => {
        components.push({
          type: 'kpi-card',
          figmaComponentId: FIGMA_COMPONENT_IDS['kpi-card'],
          data: kpi,
          position: {
            x: kpiIndex * 350, // Space cards horizontally
            y: yPosition
          }
        })
      })
      
      yPosition += 200 // Move down for next row
    }
    // Future: handle 'area-chart' and 'monitoring-chart'
  })
  
  return {
    fileKey: FIGMA_FILE_KEY,
    components,
    title: dashboardConfig.title,
    version: '1.0'
  }
}

// Copy to clipboard helper
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}
