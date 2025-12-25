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

    // Update proposal status to accepted
    const { data, error } = await supabase
      .from('proposals')
      .update({ 
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', proposalId)
      .neq('status', 'accepted') // Only if not already accepted
      .select()
      .single()

    if (error) {
      console.error('Error accepting proposal:', error)
      return NextResponse.json({ error: "Failed to accept proposal" }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      accepted_at: data.accepted_at,
      message: "Proposal accepted successfully!"
    })
  } catch (error) {
    console.error('Error accepting proposal:', error)
    return NextResponse.json({ error: "Failed to accept proposal" }, { status: 500 })
  }
}

