import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/components'
  const type = requestUrl.searchParams.get('type') // 'signup' or 'recovery'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors from Supabase
  if (error) {
    console.error('Auth error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  if (code) {
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      // Redirect to login with error
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
      )
    }

    // If we got a session, user is now logged in
    if (data.session) {
      // Handle email confirmation - redirect to login with success message
      if (type === 'signup') {
        return NextResponse.redirect(new URL('/login?verified=true', request.url))
      }

      // URL to redirect to after sign in process completes
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // If no code and no error, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}

