import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/auth/callback?type=signup`,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Check if email was sent
    if (data.user && !data.session) {
      // User created but no session = email confirmation required
      return NextResponse.json({ 
        user: data.user,
        emailSent: true,
        message: "Please check your email to verify your account"
      })
    }

    return NextResponse.json({ user: data.user, emailSent: false })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    )
  }
}

