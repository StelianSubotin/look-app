import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all components
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('figma_components')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
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
    const { name, description, image_url, clipboard_string, clipboard_string_dark, image_url_dark } = body

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

