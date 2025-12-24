import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - Get user's favorites
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get favorites with component details
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        component:figma_components (
          id,
          name,
          description,
          image_url,
          clipboard_string,
          clipboard_string_dark,
          image_url_dark,
          access_level,
          category,
          platform
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching favorites:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match the expected format
    const favorites = data.map(fav => ({
      favoriteId: fav.id,
      createdAt: fav.created_at,
      ...fav.component
    }))

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error in GET /api/favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST - Add to favorites
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { userId, componentId } = await request.json()

    if (!userId || !componentId) {
      return NextResponse.json(
        { error: 'User ID and Component ID required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, component_id: componentId }])
      .select()
      .single()

    if (error) {
      // Check if it's a duplicate error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Component already in favorites' },
          { status: 409 }
        )
      }
      console.error('Error adding favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/favorites:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from favorites
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const componentId = searchParams.get('componentId')

    if (!userId || !componentId) {
      return NextResponse.json(
        { error: 'User ID and Component ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('component_id', componentId)

    if (error) {
      console.error('Error removing favorite:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/favorites:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}

