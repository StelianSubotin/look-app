// LookScout Dashboard Importer - Figma Plugin v2.0
// This plugin imports dashboards with matching Figma components

// Load fonts
async function loadFonts() {
  try {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
    await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
  } catch (error) {
    console.log('Font loading error (using default):', error)
  }
}

// Find component by ID
async function findComponentById(nodeId) {
  try {
    const cleanId = nodeId.replace('-', ':')
    const node = await figma.getNodeByIdAsync(cleanId)
    
    if (node && node.type === 'COMPONENT') {
      return node
    }
    
    const allComponents = figma.root.findAll(node => node.type === 'COMPONENT')
    for (const comp of allComponents) {
      if (comp.id === cleanId || comp.id === nodeId) {
        return comp
      }
    }
    
    return null
  } catch (error) {
    console.error('Error finding component:', error)
    return null
  }
}

// Helper: Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 }
}

// Create KPI card instance with improved text matching
async function createKpiCardInstance(component, data, x, y) {
  const instance = component.createInstance()
  instance.x = x
  instance.y = y
  
  try {
    await loadFonts()
    
    const textNodes = instance.findAll(node => node.type === 'TEXT')
    
    console.log(`Found ${textNodes.length} text nodes in component`)
    textNodes.forEach((node, i) => {
      console.log(`  ${i + 1}. Name: "${node.name}", Content: "${node.characters.substring(0, 30)}"`)
    })
    
    const matched = new Set()
    
    // First pass: Match by name
    for (const textNode of textNodes) {
      if (matched.has(textNode)) continue
      
      const name = textNode.name.toLowerCase()
      const currentText = textNode.characters.toLowerCase()
      
      // Metric name/title
      if (name.includes('metric') || name.includes('name') || name.includes('title') || 
          name.includes('label') || currentText.includes('active') || currentText.includes('session')) {
        textNode.characters = data.name || 'Metric'
        matched.add(textNode)
        continue
      }
      
      // Stat value - usually largest number
      if (name.includes('stat') || name.includes('value') || name.includes('number') ||
          /^\d+[km]?$/.test(textNode.characters.trim())) {
        textNode.characters = data.stat || '0'
        matched.add(textNode)
        continue
      }
      
      // Previous stat - contains "from"
      if (name.includes('previous') || name.includes('from') || 
          (currentText.includes('from') && currentText.match(/\d+/))) {
        textNode.characters = `from ${data.previousStat || '0'}`
        matched.add(textNode)
        continue
      }
      
      // Change percentage
      if (name.includes('change') || name.includes('percent') || name.includes('delta') ||
          textNode.characters.includes('%') || textNode.characters.includes('↑') || textNode.characters.includes('↓')) {
        textNode.characters = data.change || '0%'
        matched.add(textNode)
        continue
      }
    }
    
    // Second pass: Match by position if not matched
    const unmatched = textNodes.filter(n => !matched.has(n)).sort((a, b) => a.y - b.y)
    
    if (unmatched.length >= 4) {
      unmatched[0].characters = data.name || 'Metric'
      unmatched[1].characters = data.stat || '0'
      unmatched[2].characters = `from ${data.previousStat || '0'}`
      unmatched[3].characters = data.change || '0%'
    }
    
    // Apply style overrides if provided
    if (data.styles) {
      if (data.styles.backgroundColor) {
        const fills = instance.fills
        if (fills && fills.length > 0 && fills[0].type === 'SOLID') {
          fills[0].color = hexToRgb(data.styles.backgroundColor)
        }
      }
      
      if (data.styles.textColor) {
        const color = hexToRgb(data.styles.textColor)
        textNodes.forEach(node => {
          if (node.fills && node.fills.length > 0 && node.fills[0].type === 'SOLID') {
            node.fills[0].color = color
          }
        })
      }
    }
    
  } catch (error) {
    console.log('Text update error:', error)
    figma.notify(`Warning: Could not update all text. Error: ${error}`, { timeout: 2000 })
  }
  
  return instance
}

// Fallback: Create basic KPI card
async function createFallbackKpiCard(data, x, y) {
  await loadFonts()
  
  const card = figma.createFrame()
  card.name = `KPI Card - ${data.name}`
  card.resize(320, 160)
  card.x = x
  card.y = y
  card.cornerRadius = 8
  card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
  card.strokes = [{ type: 'SOLID', color: { r: 0.898, g: 0.906, b: 0.922 } }]
  card.strokeWeight = 1
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.1 },
    offset: { x: 0, y: 1 },
    radius: 3,
    visible: true,
    blendMode: 'NORMAL'
  }]
  card.layoutMode = 'VERTICAL'
  card.paddingLeft = 24
  card.paddingRight = 24
  card.paddingTop = 20
  card.paddingBottom = 20
  card.itemSpacing = 12
  
  const nameText = figma.createText()
  nameText.characters = data.name || 'Metric'
  nameText.fontSize = 14
  nameText.fontName = { family: 'Inter', style: 'Medium' }
  nameText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.447, b: 0.502 } }]
  card.appendChild(nameText)
  
  const valueRow = figma.createFrame()
  valueRow.name = 'Value Row'
  valueRow.layoutMode = 'HORIZONTAL'
  valueRow.itemSpacing = 10
  valueRow.fills = []
  
  const statText = figma.createText()
  statText.characters = data.stat || '0'
  statText.fontSize = 30
  statText.fontName = { family: 'Inter', style: 'Bold' }
  statText.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.094, b: 0.157 } }]
  valueRow.appendChild(statText)
  
  const fromText = figma.createText()
  fromText.characters = `from ${data.previousStat || '0'}`
  fromText.fontSize = 14
  fromText.fontName = { family: 'Inter', style: 'Regular' }
  fromText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.447, b: 0.502 } }]
  valueRow.appendChild(fromText)
  
  card.appendChild(valueRow)
  
  const changeRow = figma.createFrame()
  changeRow.name = 'Change Row'
  changeRow.layoutMode = 'HORIZONTAL'
  changeRow.itemSpacing = 8
  changeRow.fills = []
  
  const isPositive = data.changeType === 'positive'
  
  const changeText = figma.createText()
  changeText.characters = `${data.change || '0%'}`
  changeText.fontSize = 14
  changeText.fontName = { family: 'Inter', style: 'Medium' }
  changeText.fills = [{
    type: 'SOLID',
    color: isPositive
      ? { r: 0.047, g: 0.435, b: 0.188 }
      : { r: 0.565, g: 0.110, b: 0.110 }
  }]
  changeRow.appendChild(changeText)
  
  const periodText = figma.createText()
  periodText.characters = 'from previous month'
  periodText.fontSize = 14
  periodText.fontName = { family: 'Inter', style: 'Regular' }
  periodText.fills = [{ type: 'SOLID', color: { r: 0.42, g: 0.447, b: 0.502 } }]
  changeRow.appendChild(periodText)
  
  card.appendChild(changeRow)
  
  return card
}

// Main import function
async function importDashboard(data) {
  await loadFonts()
  
  const dashboard = figma.createFrame()
  dashboard.name = data.title || 'LookScout Dashboard'
  dashboard.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }]
  dashboard.layoutMode = 'VERTICAL'
  dashboard.paddingLeft = 40
  dashboard.paddingRight = 40
  dashboard.paddingTop = 40
  dashboard.paddingBottom = 40
  dashboard.itemSpacing = 24
  
  const titleText = figma.createText()
  titleText.characters = data.title || 'Dashboard'
  titleText.fontSize = 32
  titleText.fontName = { family: 'Inter', style: 'Bold' }
  titleText.fills = [{ type: 'SOLID', color: { r: 0.067, g: 0.094, b: 0.157 } }]
  dashboard.appendChild(titleText)
  
  const container = figma.createFrame()
  container.name = 'Components'
  container.fills = []
  container.layoutMode = 'HORIZONTAL'
  container.layoutWrap = 'WRAP'
  container.itemSpacing = 24
  container.counterAxisSpacing = 24
  
  for (const comp of data.components) {
    let node = null
    
    if (comp.type === 'kpi-card') {
      const figmaComponent = await findComponentById(comp.figmaComponentId)
      
      if (figmaComponent) {
        node = await createKpiCardInstance(
          figmaComponent,
          comp.data,
          comp.position.x,
          comp.position.y
        )
      } else {
        console.log(`Component ${comp.figmaComponentId} not found, using fallback`)
        node = await createFallbackKpiCard(
          comp.data,
          comp.position.x,
          comp.position.y
        )
      }
    }
    
    if (node) {
      container.appendChild(node)
    }
  }
  
  dashboard.appendChild(container)
  
  dashboard.resize(
    Math.max(800, container.width + 80),
    titleText.height + container.height + 104
  )
  
  figma.currentPage.appendChild(dashboard)
  figma.viewport.scrollAndZoomIntoView([dashboard])
  figma.currentPage.selection = [dashboard]
  
  return dashboard
}

// Show UI
figma.showUI(__html__, { width: 500, height: 600 })

// Handle messages
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'import-dashboard') {
    try {
      const data = JSON.parse(msg.data)
      
      if (!data.components || data.components.length === 0) {
        throw new Error('No components to import')
      }
      
      await importDashboard(data)
      
      figma.ui.postMessage({ type: 'success', message: 'Dashboard imported successfully!' })
      figma.notify('✨ Dashboard imported successfully!', { timeout: 3000 })
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      figma.ui.postMessage({ type: 'error', message: `Error: ${errorMsg}` })
      figma.notify(`❌ Import failed: ${errorMsg}`, { error: true })
    }
  }
  
  if (msg.type === 'cancel') {
    figma.closePlugin()
  }
}
