import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { getSystemPrompt } from '@/lib/tremor-catalog'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Use Vercel AI SDK to stream response from OpenAI
    const result = await streamText({
      model: openai('gpt-4o'), // or gpt-4-turbo
      system: getSystemPrompt(),
      messages,
      temperature: 0.7,
      maxTokens: 2000,
    })

    return result.toDataStreamResponse()
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

