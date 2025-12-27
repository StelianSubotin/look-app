import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getSystemPrompt } from '@/lib/tremor-catalog'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY in your environment variables'
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Use fetch directly to get a proper Response object for OpenAIStream
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        stream: true,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    // Check if response is ok
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', errorText)
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API error',
          details: errorText
        }), 
        { 
          status: openaiResponse.status,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Convert the response to a stream that AI SDK can handle
    const stream = OpenAIStream(openaiResponse)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('AI Dashboard API Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate dashboard',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
