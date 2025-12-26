import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

const SYSTEM_PROMPT = `You are a dashboard designer AI. When users ask for dashboards, you respond with a JSON configuration that will be rendered.

Available components:
1. "kpi" - KPI cards showing metrics with change indicators
   Props: { title?: string, data?: [{ name, stat, previousStat, change, changeType: 'positive'|'negative' }] }

2. "area-chart" - Area chart with legend
   Props: { title?: string, categories?: string[], colors?: string[] }

3. "monitoring" - Tabbed monitoring chart
   Props: { title?: string, subtitle?: string }

ALWAYS respond with valid JSON in this exact format:
{
  "message": "Brief friendly message about what you built",
  "config": {
    "title": "Dashboard Title",
    "components": [
      { "type": "kpi", "props": { ... } },
      { "type": "area-chart", "props": { ... } }
    ]
  }
}

For KPI data, use realistic numbers relevant to the domain. Examples:
- Hotel: Occupancy Rate, Revenue per Room, Guest Satisfaction
- E-commerce: Orders, Revenue, Conversion Rate
- Sales: Deals Closed, Pipeline Value, Win Rate

If the user's request is unclear or not about dashboards, respond with:
{
  "message": "Your helpful response here",
  "config": null
}

Be creative with the data but keep it realistic. Always include 2-3 components for a good dashboard.`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const result = await response.json()
    
    if (result.error) {
      console.error('OpenAI Error:', result.error)
      return new Response(
        JSON.stringify({ 
          message: 'Sorry, I had trouble generating that. Please try again.',
          config: null 
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const content = result.choices?.[0]?.message?.content || ''
    
    // Try to parse as JSON
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return new Response(
          JSON.stringify(parsed),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }
    } catch (parseError) {
      console.error('Parse error:', parseError)
    }

    // Fallback: return the content as a message
    return new Response(
      JSON.stringify({ message: content, config: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AI Dashboard API Error:', error)
    return new Response(
      JSON.stringify({
        message: 'Something went wrong. Please try again.',
        config: null
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
