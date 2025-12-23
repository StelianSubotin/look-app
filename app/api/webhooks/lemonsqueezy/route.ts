import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-signature')

    // Verify webhook signature
    const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    
    if (LEMONSQUEEZY_WEBHOOK_SECRET) {
      const hmac = crypto.createHmac('sha256', LEMONSQUEEZY_WEBHOOK_SECRET)
      const digest = hmac.update(body).digest('hex')
      
      if (signature !== digest) {
        console.error('Invalid webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const event = JSON.parse(body)
    const { meta, data } = event

    console.log('LemonSqueezy webhook received:', meta.event_name, data.id)

    // Use service role key for admin operations (webhooks need this)
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Handle different event types
    switch (meta.event_name) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_payment_success':
        await handleSubscriptionUpdate(supabaseAdmin, data)
        break
      
      case 'subscription_cancelled':
      case 'subscription_expired':
      case 'subscription_payment_failed':
        await handleSubscriptionCancellation(supabaseAdmin, data)
        break
      
      default:
        console.log('Unhandled webhook event:', meta.event_name)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionUpdate(supabase: any, subscriptionData: any) {
  try {
    // Extract user ID from custom data or order
    // LemonSqueezy sends custom data in different places depending on event type
    let userId = subscriptionData.attributes.custom_data?.user_id
    
    // If not in custom_data, try to get from order
    if (!userId && subscriptionData.relationships?.order?.data?.id) {
      // We'd need to fetch the order to get custom data, but for now try email
      const email = subscriptionData.attributes.user_email
      if (email) {
        // Find user by email
        const { data: users } = await supabase.auth.admin.listUsers()
        const user = users?.users?.find((u: any) => u.email === email)
        userId = user?.id
      }
    }
    
    // Fallback: try to get from subscription attributes
    if (!userId) {
      userId = subscriptionData.attributes.custom_data?.user_id ||
               subscriptionData.attributes.first_order_item?.order?.user_email
    }
    
    if (!userId) {
      console.error('No user ID found in subscription data:', JSON.stringify(subscriptionData, null, 2))
      return
    }

    // Update user metadata with subscription info
    // Note: This requires service role key, not anon key
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        plan: 'paid',
        subscription_id: subscriptionData.id,
        subscription_status: subscriptionData.attributes.status,
        subscription_renews_at: subscriptionData.attributes.renews_at,
      },
    })

    if (error) {
      console.error('Error updating user subscription:', error)
      // If admin update fails, we might need to use service role key
      console.log('Make sure SUPABASE_SERVICE_ROLE_KEY is set for webhook handler')
    } else {
      console.log('✅ User subscription updated successfully:', userId)
    }
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionCancellation(supabase: any, subscriptionData: any) {
  try {
    const userId = subscriptionData.attributes.custom_data?.user_id || 
                   subscriptionData.attributes.first_order_item?.order?.user_email
    
    if (!userId) {
      console.error('No user ID found in subscription data')
      return
    }

    // Downgrade to free plan
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        plan: 'free',
        subscription_id: null,
        subscription_status: 'cancelled',
      },
    })

    if (error) {
      console.error('Error cancelling subscription:', error)
    } else {
      console.log('User subscription cancelled:', userId)
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

