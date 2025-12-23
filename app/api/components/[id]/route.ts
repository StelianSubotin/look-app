import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET single component
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('figma_components')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch component' },
      { status: 500 }
    )
  }
}

// PUT update component
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, image_url, clipboard_string, clipboard_string_dark, image_url_dark } = body

    const { data, error } = await supabase
      .from('figma_components')
      .update({
        name,
        description: description || null,
        image_url,
        clipboard_string,
        clipboard_string_dark: clipboard_string_dark || null,
        image_url_dark: image_url_dark || null,
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update component' },
      { status: 500 }
    )
  }
}

// DELETE component
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('figma_components')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    )
  }
}

