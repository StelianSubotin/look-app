import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      url, 
      title, 
      description, 
      category, 
      platform = 'web',
      styleTags = [],
      accessLevel = 'free',
      viewportWidth = 1920,
      viewportHeight = 1080
    } = body

    if (!url || !title) {
      return NextResponse.json(
        { error: 'URL and title are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseClient()

    // Check if URL already exists
    const { data: existing } = await supabase
      .from('screenshots')
      .select('id')
      .eq('url', url)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Screenshot for this URL already exists' },
        { status: 409 }
      )
    }

    // Check if ScreenshotOne API key is configured
    if (!process.env.SCREENSHOTONE_API_KEY) {
      return NextResponse.json(
        { error: 'ScreenshotOne API key not configured' },
        { status: 500 }
      )
    }

    // Call ScreenshotOne API
    const screenshotOneUrl = new URL('https://api.screenshotone.com/take')
    screenshotOneUrl.searchParams.set('access_key', process.env.SCREENSHOTONE_API_KEY)
    screenshotOneUrl.searchParams.set('url', url)
    screenshotOneUrl.searchParams.set('viewport_width', viewportWidth.toString())
    screenshotOneUrl.searchParams.set('viewport_height', viewportHeight.toString())
    screenshotOneUrl.searchParams.set('device_scale_factor', '2') // Retina quality
    screenshotOneUrl.searchParams.set('format', 'webp') // Better compression
    screenshotOneUrl.searchParams.set('image_quality', '90')
    screenshotOneUrl.searchParams.set('full_page', 'false') // Above the fold only
    screenshotOneUrl.searchParams.set('delay', '3') // Wait 3 seconds for page to load

    console.log('Calling ScreenshotOne API:', url)

    // Fetch screenshot from ScreenshotOne
    const screenshotResponse = await fetch(screenshotOneUrl.toString(), {
      method: 'GET',
    })

    if (!screenshotResponse.ok) {
      const errorText = await screenshotResponse.text()
      console.error('ScreenshotOne API error:', errorText)
      return NextResponse.json(
        { error: `Screenshot capture failed: ${screenshotResponse.status}` },
        { status: 500 }
      )
    }

    // Get image as buffer
    const imageBuffer = await screenshotResponse.arrayBuffer()
    const buffer = Buffer.from(imageBuffer)

    // Generate filename
    const timestamp = Date.now()
    const sanitizedUrl = url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
    const filename = `${timestamp}-${sanitizedUrl}.webp`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('figma-components') // Reusing existing bucket or create 'screenshots' bucket
      .upload(`screenshots/${filename}`, buffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('figma-components')
      .getPublicUrl(`screenshots/${filename}`)

    // Save to database
    const { data: screenshotData, error: dbError } = await supabase
      .from('screenshots')
      .insert([{
        url,
        title,
        description: description || null,
        category: category || null,
        platform,
        style_tags: styleTags,
        image_url: publicUrl,
        viewport_width: viewportWidth,
        viewport_height: viewportHeight,
        access_level: accessLevel,
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      screenshot: screenshotData
    }, { status: 201 })

  } catch (error) {
    console.error('Screenshot capture error:', error)
    return NextResponse.json(
      { error: 'Failed to capture screenshot' },
      { status: 500 }
    )
  }
}

