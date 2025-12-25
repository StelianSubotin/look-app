"use client"

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
  updated_at?: string
}

interface ProposalViewProps {
  proposal: ProposalData
  isPro: boolean
}

export function ProposalView({ proposal, isPro }: ProposalViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-40 print:hidden">
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
        <ProposalTemplate proposal={proposal} showWatermark={!isPro} />
      </div>
    </div>
  )
}

