import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const platform = searchParams.get('platform')
    const styleTags = searchParams.get('styleTags')

    const supabase = getSupabaseClient()

    let query = supabase
      .from('screenshots')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }

    if (styleTags) {
      const tagsArray = styleTags.split(',')
      query = query.contains('style_tags', tagsArray)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Failed to fetch screenshots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch screenshots' },
      { status: 500 }
    )
  }
}

