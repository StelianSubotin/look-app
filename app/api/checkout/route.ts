import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan } = body // 'pro' or 'free'

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan is required' },
        { status: 400 }
      )
    }

    // LemonSqueezy API credentials
    const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY
    const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID
    const LEMONSQUEEZY_VARIANT_ID = process.env.LEMONSQUEEZY_VARIANT_ID_PRO // Pro plan variant ID

    if (!LEMONSQUEEZY_API_KEY || !LEMONSQUEEZY_STORE_ID || !LEMONSQUEEZY_VARIANT_ID) {
      console.error('Missing LemonSqueezy config:', {
        hasApiKey: !!LEMONSQUEEZY_API_KEY,
        hasStoreId: !!LEMONSQUEEZY_STORE_ID,
        hasVariantId: !!LEMONSQUEEZY_VARIANT_ID,
      })
      return NextResponse.json(
        { 
          error: 'LemonSqueezy not configured. Please check environment variables.',
          details: 'Missing: ' + [
            !LEMONSQUEEZY_API_KEY && 'LEMONSQUEEZY_API_KEY',
            !LEMONSQUEEZY_STORE_ID && 'LEMONSQUEEZY_STORE_ID',
            !LEMONSQUEEZY_VARIANT_ID && 'LEMONSQUEEZY_VARIANT_ID_PRO',
          ].filter(Boolean).join(', ')
        },
        { status: 500 }
      )
    }

    // Try using LemonSqueezy API first, fallback to direct URL if it fails
    // Method 1: Use LemonSqueezy API (more flexible)
    let response: Response
    try {
      response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: plan === 'pro' ? 900 : 0, // $9.00 in cents
            product_options: {
              name: plan === 'pro' ? 'Pro Plan' : 'Free Plan',
              description: plan === 'pro' 
                ? 'Unlimited downloads, priority support, and early access to new features'
                : 'Basic access to all components',
            },
            checkout_options: {
              embed: false,
              media: false,
            },
            checkout_data: {
              custom: {
                user_id: user.id,
                email: user.email,
                plan: plan,
              },
            },
            expires_at: null,
            preview: false,
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: String(LEMONSQUEEZY_STORE_ID), // Ensure it's a string
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: String(LEMONSQUEEZY_VARIANT_ID), // Ensure it's a string
              },
            },
          },
        },
      }),
      })
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      // Fallback to direct checkout URL if API fails
      const directCheckoutUrl = `https://${LEMONSQUEEZY_STORE_ID}.lemonsqueezy.com/checkout/buy/${LEMONSQUEEZY_VARIANT_ID}?checkout[custom][user_id]=${user.id}&checkout[custom][email]=${encodeURIComponent(user.email || '')}`
      return NextResponse.json({ 
        checkoutUrl: directCheckoutUrl,
        method: 'direct',
      })
    }

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { errors: [{ detail: errorText }] }
      }
      
      console.error('LemonSqueezy API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      })
      
      const errorMessage = errorData?.errors?.[0]?.detail || 
                          errorData?.errors?.[0]?.title || 
                          'Failed to create checkout session'
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorData,
        },
        { status: response.status || 500 }
      )
    }

    const data = await response.json()
    
    if (!data.data?.attributes?.url) {
      console.error('Invalid LemonSqueezy response:', data)
      return NextResponse.json(
        { error: 'Invalid response from LemonSqueezy. Check logs for details.' },
        { status: 500 }
      )
    }
    
    const checkoutUrl = data.data.attributes.url

    return NextResponse.json({ 
      checkoutUrl,
      checkoutId: data.data.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
}

