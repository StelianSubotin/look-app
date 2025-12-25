import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Get the current user
    const cookieStore = await cookies()
    const supabaseAuth = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    const { data: { user } } = await supabaseAuth.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const proposalId = params.id

    // Verify ownership
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('user_id')
      .eq('id', proposalId)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    if (proposal.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get analytics data
    const { data: views, error: viewsError } = await supabase
      .from('proposal_views')
      .select('*')
      .eq('proposal_id', proposalId)
      .order('viewed_at', { ascending: false })

    if (viewsError) {
      console.error('Error fetching analytics:', viewsError)
    }

    // Calculate stats
    const totalViews = views?.length || 0
    const uniqueViewers = new Set(views?.map(v => v.viewer_ip)).size
    const avgTimeSpent = views && views.length > 0
      ? Math.round(views.reduce((acc, v) => acc + (v.time_spent_seconds || 0), 0) / views.length)
      : 0

    // Views over time (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split('T')[0]
    })

    const viewsByDay = last7Days.map(day => ({
      date: day,
      views: views?.filter(v => v.viewed_at.startsWith(day)).length || 0
    }))

    return NextResponse.json({
      totalViews,
      uniqueViewers,
      avgTimeSpent,
      viewsByDay,
      recentViews: views?.slice(0, 10) || []
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

