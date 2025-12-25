import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface DashboardComponent {
  id: string
  type: string
  props: Record<string, any>
}

interface DashboardConfig {
  name: string
  theme: {
    mode: 'light' | 'dark'
    primaryColor: string
    borderRadius: string
  }
  components: DashboardComponent[]
}

export async function POST(request: NextRequest) {
  try {
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY

    if (!openaiKey) {
      return NextResponse.json({ 
        error: "OpenAI API key not configured" 
      }, { status: 500 })
    }

    const body = await request.json()
    const { prompt } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const systemPrompt = `You are an expert dashboard designer. Generate dashboard configurations based on user requests.

Available component types:
1. stat-card - Shows a metric with title, value, change percentage, and icon
   Props: { title: string, value: string, change: string, changeType: "positive"|"negative"|"neutral", icon: "dollar"|"users"|"cart"|"activity" }

2. stat-card-mini - Compact stat with label, value, and color
   Props: { label: string, value: string, color: "blue"|"green"|"red"|"purple"|"orange" }

3. line-chart - Line graph for trends
   Props: { title: string, color: string (hex) }

4. bar-chart - Bar graph for comparisons
   Props: { title: string, color: string (hex) }

5. area-chart - Area graph for volume/trends
   Props: { title: string, color: string (hex) }

6. pie-chart - Pie chart for distributions
   Props: { title: string }

7. data-table - Table showing recent data
   Props: { title: string }

8. alert-card - Alert/notification card
   Props: { title: string, message: string, type: "info"|"warning"|"error"|"success" }

Color schemes for themes:
- Fintech/Finance: Blues (#3b82f6), greens (#10b981)
- Healthcare: Teals (#14b8a6), blues (#0ea5e9)
- E-commerce: Purples (#8b5cf6), pinks (#ec4899)
- SaaS/Analytics: Indigos (#6366f1), cyans (#06b6d4)
- Dark mode: Use darker primary colors

When generating:
1. Choose appropriate components for the use case
2. Set relevant titles, values, and metrics for the industry
3. Use consistent color schemes
4. Include a mix of stats, charts, and data components
5. Aim for 6-10 components for a balanced dashboard

Return ONLY valid JSON with this exact structure:
{
  "name": "Dashboard Name",
  "theme": {
    "mode": "light" or "dark",
    "primaryColor": "#hex",
    "borderRadius": "0.5rem" or "0.75rem" or "1rem"
  },
  "components": [
    {
      "id": "unique-id",
      "type": "component-type",
      "props": { ... }
    }
  ]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a dashboard for: ${prompt}` }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', errorText)
      return NextResponse.json({ 
        error: `OpenAI API error: ${response.status}` 
      }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 })
    }

    // Parse JSON - handle markdown code blocks
    let config: DashboardConfig
    try {
      let jsonContent = content.trim()
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.slice(7)
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.slice(3)
      }
      if (jsonContent.endsWith('```')) {
        jsonContent = jsonContent.slice(0, -3)
      }
      jsonContent = jsonContent.trim()
      
      config = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json({ 
        error: "Failed to generate dashboard. Please try again." 
      }, { status: 500 })
    }

    // Validate and ensure IDs are unique
    config.components = config.components.map((comp, index) => ({
      ...comp,
      id: comp.id || `ai-${Date.now()}-${index}`
    }))

    return NextResponse.json(config)
  } catch (error) {
    console.error('Error generating dashboard:', error)
    return NextResponse.json({ 
      error: "Failed to generate dashboard" 
    }, { status: 500 })
  }
}

