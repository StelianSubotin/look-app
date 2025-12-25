import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { ProposalTemplate } from "@/components/proposal-template"
import { Button } from "@/components/ui/button"
import { Download, Home } from "lucide-react"
import Link from "next/link"

interface Deliverable {
  title: string
  description: string
  timeline: string
}

interface ProposalData {
  id: string
  user_id: string
  client_name: string
  client_company: string | null
  client_email: string | null
  client_logo_url: string | null
  project_title: string
  project_description: string | null
  project_goals: string[] | null
  deliverables: Deliverable[]
  timeline_start: string | null
  timeline_end: string | null
  total_price: number | null
  payment_terms: string | null
  about_us: string | null
  terms_conditions: string | null
  created_at: string
  updated_at: string
}

export default async function ProposalViewPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch proposal by share link
  const { data: proposal, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('share_link', params.id)
    .single()

  if (error || !proposal) {
    notFound()
  }

  // Check if proposal owner is a Pro user
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', proposal.user_id)
    .single()

  const isPro = profile?.subscription_tier === 'pro'

  // Update viewed_at timestamp
  if (!proposal.viewed_at) {
    await supabase
      .from('proposals')
      .update({ viewed_at: new Date().toISOString() })
      .eq('id', proposal.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
            <Home className="h-4 w-4" />
            Lookscout
          </Link>
          <div className="flex items-center gap-3">
            {!isPro && (
              <Link href="/">
                <Button variant="outline" size="sm">
                  Remove Watermark
                </Button>
              </Link>
            )}
            <Button 
              size="sm" 
              className="gap-2"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <div className="py-8">
        <ProposalTemplate proposal={proposal as ProposalData} showWatermark={!isPro} />
      </div>
    </div>
  )
}

