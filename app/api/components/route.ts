import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all components (filtered by user plan)
export async function GET(request: NextRequest) {
  try {
    // Get user plan from request (we'll pass it from the frontend)
    const { searchParams } = new URL(request.url)
    const userPlan = searchParams.get('plan') || 'free' // Default to free if not provided

    let query = supabase
      .from('figma_components')
      .select('*')
      .order('created_at', { ascending: false })

    // Filter: show free components to everyone, paid components only to paid users
    if (userPlan !== 'paid') {
      query = query.eq('access_level', 'free')
    }
    // If user is paid, show all components (no filter)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch components' },
      { status: 500 }
    )
  }
}

// POST create new component
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image_url, clipboard_string, clipboard_string_dark, image_url_dark, access_level } = body

    if (!name || !image_url || !clipboard_string) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('figma_components')
      .insert([
        {
          name,
          description: description || null,
          image_url,
          clipboard_string,
          clipboard_string_dark: clipboard_string_dark || null,
          image_url_dark: image_url_dark || null,
          access_level: access_level || 'free',
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create component' },
      { status: 500 }
    )
  }
}

