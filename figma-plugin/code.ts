// Lookscout Dashboard Importer - Figma Plugin
// This plugin imports dashboards created in Lookscout into native Figma frames

interface DashboardComponent {
  id: string
  type: string
  props: Record<string, any>
}

interface DashboardData {
  name: string
  components: DashboardComponent[]
  theme: {
    primaryColor: string
  }
}

// Color utilities
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 }
}

// Create a stat card component
async function createStatCard(
  props: Record<string, any>,
  x: number,
  y: number,
  primaryColor: RGB
): Promise<FrameNode> {
  const card = figma.createFrame()
  card.name = `Stat Card - ${props.title}`
  card.resize(280, 140)
  card.x = x
  card.y = y
  card.cornerRadius = 12
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
  card.strokeWeight = 1
  card.layoutMode = 'VERTICAL'
  card.paddingLeft = 24
  card.paddingRight = 24
  card.paddingTop = 20
  card.paddingBottom = 20
  card.itemSpacing = 8

  // Load font
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })

  // Title
  const title = figma.createText()
  title.characters = props.title || 'Metric'
  title.fontSize = 14
  title.fontName = { family: 'Inter', style: 'Medium' }
  title.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }]
  card.appendChild(title)

  // Value
  const value = figma.createText()
  value.characters = props.value || '$0'
  value.fontSize = 30
  value.fontName = { family: 'Inter', style: 'Bold' }
  value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
  card.appendChild(value)

  // Change indicator
  const change = figma.createText()
  change.characters = `${props.change || '+0%'} from last month`
  change.fontSize = 12
  change.fontName = { family: 'Inter', style: 'Regular' }
  const isPositive = props.changeType === 'positive'
  change.fills = [
    {
      type: 'SOLID',
      color: isPositive
        ? { r: 0.08, g: 0.7, b: 0.35 }
        : { r: 0.9, g: 0.2, b: 0.2 },
    },
  ]
  card.appendChild(change)

  return card
}

// Create a mini stat card
async function createMiniStatCard(
  props: Record<string, any>,
  x: number,
  y: number
): Promise<FrameNode> {
  const card = figma.createFrame()
  card.name = `Mini Stat - ${props.label}`
  card.resize(280, 100)
  card.x = x
  card.y = y
  card.cornerRadius = 12
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
  card.strokeWeight = 1
  card.layoutMode = 'VERTICAL'
  card.paddingLeft = 24
  card.paddingRight = 24
  card.paddingTop = 20
  card.paddingBottom = 20
  card.itemSpacing = 8

  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })

  // Badge
  const badge = figma.createFrame()
  badge.name = 'Badge'
  badge.layoutMode = 'HORIZONTAL'
  badge.paddingLeft = 8
  badge.paddingRight = 8
  badge.paddingTop = 4
  badge.paddingBottom = 4
  badge.cornerRadius = 4
  
  const colorMap: Record<string, RGB> = {
    blue: { r: 0.23, g: 0.51, b: 0.96 },
    green: { r: 0.08, g: 0.7, b: 0.35 },
    red: { r: 0.9, g: 0.2, b: 0.2 },
    purple: { r: 0.55, g: 0.36, b: 0.96 },
    orange: { r: 0.96, g: 0.62, b: 0.35 },
  }
  const badgeColor = colorMap[props.color] || colorMap.blue
  badge.fills = [{ type: 'SOLID', color: badgeColor, opacity: 0.1 }]
  
  const badgeText = figma.createText()
  badgeText.characters = props.label || 'Label'
  badgeText.fontSize = 12
  badgeText.fontName = { family: 'Inter', style: 'Medium' }
  badgeText.fills = [{ type: 'SOLID', color: badgeColor }]
  badge.appendChild(badgeText)
  card.appendChild(badge)

  // Value
  const value = figma.createText()
  value.characters = props.value || '0'
  value.fontSize = 32
  value.fontName = { family: 'Inter', style: 'Bold' }
  value.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
  card.appendChild(value)

  return card
}

// Create a chart placeholder
async function createChartPlaceholder(
  type: string,
  props: Record<string, any>,
  x: number,
  y: number,
  primaryColor: RGB
): Promise<FrameNode> {
  const card = figma.createFrame()
  card.name = `Chart - ${props.title}`
  card.resize(580, 300)
  card.x = x
  card.y = y
  card.cornerRadius = 12
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
  card.strokeWeight = 1
  card.layoutMode = 'VERTICAL'
  card.paddingLeft = 24
  card.paddingRight = 24
  card.paddingTop = 20
  card.paddingBottom = 20
  card.itemSpacing = 16

  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })

  // Title
  const title = figma.createText()
  title.characters = props.title || 'Chart'
  title.fontSize = 16
  title.fontName = { family: 'Inter', style: 'Medium' }
  title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
  card.appendChild(title)

  // Chart area placeholder
  const chartArea = figma.createFrame()
  chartArea.name = 'Chart Area'
  chartArea.resize(532, 200)
  chartArea.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }]
  chartArea.cornerRadius = 8

  // Add chart visualization based on type
  if (type === 'line-chart' || type === 'area-chart') {
    // Create line chart visualization
    const line = figma.createVector()
    line.vectorPaths = [
      {
        windingRule: 'NONZERO',
        data: 'M 20 150 Q 100 100 180 120 T 340 80 T 500 100',
      },
    ]
    line.strokes = [{ type: 'SOLID', color: primaryColor }]
    line.strokeWeight = 3
    line.x = 0
    line.y = 0
    chartArea.appendChild(line)
  } else if (type === 'bar-chart') {
    // Create bar chart visualization
    const bars = [60, 90, 120, 80, 140]
    bars.forEach((height, i) => {
      const bar = figma.createRectangle()
      bar.resize(60, height)
      bar.x = 30 + i * 100
      bar.y = 180 - height
      bar.cornerRadius = 4
      bar.fills = [{ type: 'SOLID', color: primaryColor }]
      chartArea.appendChild(bar)
    })
  } else if (type === 'pie-chart') {
    // Create simple pie chart visualization
    const pie = figma.createEllipse()
    pie.resize(150, 150)
    pie.x = 191
    pie.y = 25
    pie.fills = [{ type: 'SOLID', color: primaryColor }]
    chartArea.appendChild(pie)
  }

  card.appendChild(chartArea)

  return card
}

// Create a data table placeholder
async function createDataTable(
  props: Record<string, any>,
  x: number,
  y: number
): Promise<FrameNode> {
  const card = figma.createFrame()
  card.name = `Table - ${props.title}`
  card.resize(580, 280)
  card.x = x
  card.y = y
  card.cornerRadius = 12
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
  card.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }]
  card.strokeWeight = 1
  card.layoutMode = 'VERTICAL'
  card.paddingLeft = 24
  card.paddingRight = 24
  card.paddingTop = 20
  card.paddingBottom = 20
  card.itemSpacing = 16

  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

  // Title
  const title = figma.createText()
  title.characters = props.title || 'Data Table'
  title.fontSize = 16
  title.fontName = { family: 'Inter', style: 'Medium' }
  title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
  card.appendChild(title)

  // Table header
  const header = figma.createFrame()
  header.name = 'Table Header'
  header.resize(532, 40)
  header.layoutMode = 'HORIZONTAL'
  header.itemSpacing = 0
  header.fills = []

  const headers = ['Name', 'Email', 'Amount', 'Status']
  for (const h of headers) {
    const cell = figma.createText()
    cell.characters = h
    cell.fontSize = 12
    cell.fontName = { family: 'Inter', style: 'Medium' }
    cell.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }]
    cell.resize(133, 20)
    header.appendChild(cell)
  }
  card.appendChild(header)

  // Table rows
  const rows = [
    { name: 'John Doe', email: 'john@example.com', amount: '$250.00', status: 'Completed' },
    { name: 'Jane Smith', email: 'jane@example.com', amount: '$150.00', status: 'Pending' },
    { name: 'Bob Wilson', email: 'bob@example.com', amount: '$350.00', status: 'Completed' },
  ]

  for (const row of rows) {
    const rowFrame = figma.createFrame()
    rowFrame.name = 'Table Row'
    rowFrame.resize(532, 36)
    rowFrame.layoutMode = 'HORIZONTAL'
    rowFrame.itemSpacing = 0
    rowFrame.fills = []

    const values = [row.name, row.email, row.amount, row.status]
    for (const v of values) {
      const cell = figma.createText()
      cell.characters = v
      cell.fontSize = 13
      cell.fontName = { family: 'Inter', style: 'Regular' }
      cell.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]
      cell.resize(133, 20)
      rowFrame.appendChild(cell)
    }
    card.appendChild(rowFrame)
  }

  return card
}

// Create alert card
async function createAlertCard(
  props: Record<string, any>,
  x: number,
  y: number
): Promise<FrameNode> {
  const card = figma.createFrame()
  card.name = `Alert - ${props.title}`
  card.resize(280, 100)
  card.x = x
  card.y = y
  card.cornerRadius = 12
  
  const alertColors: Record<string, RGB> = {
    info: { r: 0.23, g: 0.51, b: 0.96 },
    warning: { r: 0.96, g: 0.62, b: 0.35 },
    error: { r: 0.9, g: 0.2, b: 0.2 },
    success: { r: 0.08, g: 0.7, b: 0.35 },
  }
  const alertColor = alertColors[props.type] || alertColors.info
  
  card.fills = [{ type: 'SOLID', color: alertColor, opacity: 0.05 }]
  card.strokes = [{ type: 'SOLID', color: alertColor }]
  card.strokeWeight = 1
  card.strokeAlign = 'INSIDE'
  card.layoutMode = 'VERTICAL'
  card.paddingLeft = 20
  card.paddingRight = 20
  card.paddingTop = 16
  card.paddingBottom = 16
  card.itemSpacing = 8

  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

  // Title
  const title = figma.createText()
  title.characters = props.title || 'Alert'
  title.fontSize = 14
  title.fontName = { family: 'Inter', style: 'Medium' }
  title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
  card.appendChild(title)

  // Message
  const message = figma.createText()
  message.characters = props.message || 'Alert message'
  message.fontSize = 13
  message.fontName = { family: 'Inter', style: 'Regular' }
  message.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }]
  card.appendChild(message)

  return card
}

// Main function to create dashboard
async function createDashboard(data: DashboardData) {
  const primaryColor = hexToRgb(data.theme?.primaryColor || '#3b82f6')

  // Create main frame
  const dashboard = figma.createFrame()
  dashboard.name = data.name || 'Lookscout Dashboard'
  dashboard.resize(1280, 900)
  dashboard.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }]
  dashboard.layoutMode = 'VERTICAL'
  dashboard.paddingLeft = 40
  dashboard.paddingRight = 40
  dashboard.paddingTop = 40
  dashboard.paddingBottom = 40
  dashboard.itemSpacing = 24

  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })

  // Dashboard header
  const headerFrame = figma.createFrame()
  headerFrame.name = 'Header'
  headerFrame.resize(1200, 60)
  headerFrame.fills = []
  headerFrame.layoutMode = 'VERTICAL'
  headerFrame.itemSpacing = 4

  const heading = figma.createText()
  heading.characters = 'Dashboard'
  heading.fontSize = 32
  heading.fontName = { family: 'Inter', style: 'Bold' }
  heading.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
  headerFrame.appendChild(heading)

  const subheading = figma.createText()
  subheading.characters = "Welcome back! Here's what's happening today."
  subheading.fontSize = 14
  subheading.fontName = { family: 'Inter', style: 'Regular' }
  subheading.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }]
  headerFrame.appendChild(subheading)

  dashboard.appendChild(headerFrame)

  // Create grid container
  const grid = figma.createFrame()
  grid.name = 'Components Grid'
  grid.fills = []
  grid.layoutMode = 'HORIZONTAL'
  grid.layoutWrap = 'WRAP'
  grid.itemSpacing = 20
  grid.counterAxisSpacing = 20
  grid.resize(1200, 700)

  // Create components
  let currentX = 0
  let currentY = 0
  const smallWidth = 280
  const largeWidth = 580
  const rowHeight = 160

  for (const component of data.components) {
    let node: FrameNode | null = null
    const isLarge = ['line-chart', 'bar-chart', 'area-chart', 'pie-chart', 'data-table'].includes(component.type)

    switch (component.type) {
      case 'stat-card':
        node = await createStatCard(component.props, currentX, currentY, primaryColor)
        break
      case 'stat-card-mini':
        node = await createMiniStatCard(component.props, currentX, currentY)
        break
      case 'line-chart':
      case 'bar-chart':
      case 'area-chart':
      case 'pie-chart':
        node = await createChartPlaceholder(component.type, component.props, currentX, currentY, primaryColor)
        break
      case 'data-table':
        node = await createDataTable(component.props, currentX, currentY)
        break
      case 'alert-card':
        node = await createAlertCard(component.props, currentX, currentY)
        break
    }

    if (node) {
      grid.appendChild(node)
    }
  }

  dashboard.appendChild(grid)

  // Position in viewport
  figma.currentPage.appendChild(dashboard)
  figma.viewport.scrollAndZoomIntoView([dashboard])

  return dashboard
}

// Show UI
figma.showUI(__html__, { width: 400, height: 500 })

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-dashboard') {
    try {
      const data: DashboardData = JSON.parse(msg.data)
      await createDashboard(data)
      figma.ui.postMessage({ type: 'success', message: 'Dashboard imported successfully!' })
      figma.notify('Dashboard imported! 🎉')
    } catch (error) {
      figma.ui.postMessage({ type: 'error', message: `Error: ${error}` })
      figma.notify('Failed to import dashboard', { error: true })
    }
  }

  if (msg.type === 'fetch-dashboard') {
    // This would fetch from the API
    figma.ui.postMessage({ type: 'fetch-started' })
  }

  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}

