import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { SharedBoardView } from "./shared-board-view"

export const dynamic = 'force-dynamic'

export default async function SharedBoardPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Fetch board by share link
  const { data: board, error } = await supabase
    .from('mood_boards')
    .select('*')
    .eq('share_link', params.id)
    .single()

  if (error || !board) {
    console.error('Board fetch error:', error)
    notFound()
  }

  return <SharedBoardView board={board} />
}

