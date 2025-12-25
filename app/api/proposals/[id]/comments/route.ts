import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

// Get comments for a proposal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const proposalId = params.id

    const { data, error } = await supabase
      .from('proposal_comments')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('is_internal', false) // Only public comments
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
    }

    return NextResponse.json({ comments: data || [] })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// Add a comment to a proposal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const proposalId = params.id
    const body = await request.json()

    if (!body.content || !body.author) {
      return NextResponse.json({ error: "Content and author are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('proposal_comments')
      .insert({
        proposal_id: proposalId,
        author_name: body.author,
        author_email: body.email || null,
        content: body.content,
        is_internal: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding comment:', error)
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      comment: data,
      message: "Comment added successfully!"
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}

