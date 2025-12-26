import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { getSystemPrompt } from '@/lib/tremor-catalog'

export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Use Vercel AI SDK to stream response from OpenAI
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: getSystemPrompt() },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const stream = OpenAIStream(response)
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
