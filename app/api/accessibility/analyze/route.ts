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

    // Prepare the image for OpenAI Vision API
    let imageUrlForApi: string
    
    if (imageUrl) {
      imageUrlForApi = imageUrl
    } else if (imageBase64) {
      // Detect image type from base64 header or default to jpeg
      const mimeType = imageBase64.startsWith('/9j/') ? 'image/jpeg' : 'image/png'
      imageUrlForApi = `data:${mimeType};base64,${imageBase64}`
    } else {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const userPrompt = `Analyze this UI screenshot for accessibility issues based on WCAG 2.1 guidelines.

Check for:
- Color contrast issues (text vs background)
- Touch target sizes (should be 44x44px minimum)
- Color-only information (info should not rely on color alone)
- Text size and readability
- Focus indicators for keyboard navigation

Return your analysis as JSON with this exact structure:
{
  "overallScore": <number 0-100>,
  "issues": [
    {
      "type": "<contrast|touch-target|color-only|text-size|focus|other>",
      "severity": "<critical|serious|moderate|minor>",
      "title": "<brief title>",
      "description": "<detailed explanation>",
      "wcagCriteria": "<e.g. 1.4.3 Contrast>",
      "location": "<where in the UI>",
      "suggestion": "<how to fix>"
    }
  ],
  "summary": "<overall summary>",
  "positives": ["<good thing 1>", "<good thing 2>"]
}`

    const requestBody = {
      model: 'gpt-4o',
      messages: [
        { 
          role: 'user', 
          content: [
            { type: 'text', text: userPrompt },
            { 
              type: 'image_url', 
              image_url: { 
                url: imageUrlForApi,
                detail: 'high'
              } 
            }
          ]
        }
      ],
      max_tokens: 2000
    }

    console.log('Sending request to OpenAI, image URL length:', imageUrlForApi.length)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error response:', errorText)
      
      let errorMessage = `OpenAI API error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message
        }
      } catch {
        // Keep default error message
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      console.error('No content in OpenAI response:', data)
      return NextResponse.json({ error: "No response from AI" }, { status: 500 })
    }

    console.log('OpenAI response received, length:', content.length)

    // Parse the JSON response - handle markdown code blocks if present
    let analysis: AnalysisResult
    try {
      // Remove markdown code blocks if present
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
      
      analysis = JSON.parse(jsonContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      console.error('Parse error:', parseError)
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing accessibility:', error)
    return NextResponse.json({ 
      error: "Failed to analyze image" 
    }, { status: 500 })
  }
}

