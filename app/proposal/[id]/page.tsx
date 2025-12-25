import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ProposalView } from "./proposal-view"

export const dynamic = 'force-dynamic'

export default async function ProposalViewPage({ 
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

  // Fetch proposal by share_link or vanity_slug
  let { data: proposal, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('share_link', params.id)
    .single()

  // If not found by share_link, try vanity_slug
  if (error || !proposal) {
    const { data: vanityProposal, error: vanityError } = await supabase
      .from('proposals')
      .select('*')
      .eq('vanity_slug', params.id)
      .single()
    
    if (vanityError || !vanityProposal) {
      console.error('Proposal fetch error:', error || vanityError)
      notFound()
    }
    
    proposal = vanityProposal
  }

  // Check if proposal owner is a Pro user
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', proposal.user_id)
    .single()

  const isPro = profile?.subscription_tier === 'pro'

  // Update viewed_at timestamp (don't await, fire and forget)
  if (!proposal.viewed_at) {
    supabase
      .from('proposals')
      .update({ viewed_at: new Date().toISOString() })
      .eq('id', proposal.id)
      .then(() => {})
  }

  return <ProposalView proposal={proposal} isPro={isPro} />
}
