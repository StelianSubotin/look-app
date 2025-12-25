import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface AccessibilityIssue {
  type: 'contrast' | 'touch-target' | 'color-only' | 'text-size' | 'focus' | 'other'
  severity: 'critical' | 'serious' | 'moderate' | 'minor'
  title: string
  description: string
  wcagCriteria?: string
  location?: string
  suggestion?: string
}

interface AnalysisResult {
  overallScore: number
  issues: AccessibilityIssue[]
  summary: string
  positives: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key (try both common naming conventions)
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY

    if (!openaiKey) {
      console.error('OpenAI API key missing. Available env vars:', Object.keys(process.env).filter(k => k.includes('OPENAI') || k.includes('API')))
      return NextResponse.json({ 
        error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your Vercel environment variables and redeploy." 
      }, { status: 500 })
    }

    console.log('OpenAI key found, length:', openaiKey.length)

    const body = await request.json()
    const { imageBase64, imageUrl } = body

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Prepare the image for OpenAI
    const imageContent = imageUrl 
      ? { type: "image_url", image_url: { url: imageUrl } }
      : { type: "image_url", image_url: { url: `data:image/png;base64,${imageBase64}` } }

    const systemPrompt = `You are an expert accessibility auditor specializing in WCAG 2.1 guidelines. Analyze the provided UI screenshot and identify accessibility issues.

For each issue found, provide:
1. Type: contrast, touch-target, color-only, text-size, focus, or other
2. Severity: critical, serious, moderate, or minor
3. Title: Brief description
4. Description: Detailed explanation
5. WCAG Criteria: The specific WCAG guideline (e.g., "1.4.3 Contrast (Minimum)")
6. Location: Where in the interface (e.g., "Header navigation", "CTA button")
7. Suggestion: How to fix it

Also provide:
- An overall accessibility score (0-100)
- A summary of the main findings
- Positive aspects of the design

Focus on these WCAG criteria:
- 1.4.3 Contrast (Minimum) - 4.5:1 for normal text, 3:1 for large text
- 1.4.6 Contrast (Enhanced) - 7:1 for normal text, 4.5:1 for large text
- 1.4.11 Non-text Contrast - 3:1 for UI components
- 2.5.5 Target Size - 44x44px minimum for touch targets
- 1.4.1 Use of Color - Information not conveyed by color alone
- 1.4.4 Resize Text - Text should be readable at 200% zoom
- 2.4.7 Focus Visible - Focus indicators should be visible

Be specific and actionable in your feedback. If you can't determine something from the screenshot, note it as uncertain.`

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
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Analyze this UI for accessibility issues. Return your analysis as JSON with this structure: { "overallScore": number, "issues": [{ "type": string, "severity": string, "title": string, "description": string, "wcagCriteria": string, "location": string, "suggestion": string }], "summary": string, "positives": string[] }' },
              imageContent
            ]
          }
        ],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', errorData)
      return NextResponse.json({ 
        error: `OpenAI API error: ${response.status}` 
      }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 })
    }

    // Parse the JSON response
    let analysis: AnalysisResult
    try {
      analysis = JSON.parse(content)
    } catch {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing accessibility:', error)
    return NextResponse.json({ 
      error: "Failed to analyze image" 
    }, { status: 500 })
  }
}

