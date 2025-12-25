import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

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
    const body = await request.json().catch(() => ({}))

    // Log the view
    const { error: viewError } = await supabase
      .from('proposal_views')
      .insert({
        proposal_id: proposalId,
        viewer_ip: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
        referrer: request.headers.get('referer') || null,
        time_spent_seconds: body.timeSpent || 0,
        sections_viewed: body.sectionsViewed || [],
      })

    if (viewError) {
      console.error('Error logging view:', viewError)
    }

    // Increment view count - first get current count, then update
    const { data: currentProposal } = await supabase
      .from('proposals')
      .select('view_count')
      .eq('id', proposalId)
      .single()

    const currentCount = currentProposal?.view_count || 0

    await supabase
      .from('proposals')
      .update({ 
        view_count: currentCount + 1,
        last_viewed_at: new Date().toISOString()
      })
      .eq('id', proposalId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}

