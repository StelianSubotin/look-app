"use client"

import { format } from "date-fns"
import { CheckCircle2, Calendar, DollarSign, Mail, Building2 } from "lucide-react"
import Image from "next/image"

interface Deliverable {
  title: string
  description: string
  timeline: string
}

interface ProposalData {
  id: string
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
}

interface ProposalTemplateProps {
  proposal: ProposalData
  showWatermark: boolean
}

export function ProposalTemplate({ proposal, showWatermark }: ProposalTemplateProps) {
  return (
    <div className="relative max-w-4xl mx-auto bg-white text-gray-900 min-h-screen">
      {/* Watermark for free users */}
      {showWatermark && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div 
            className="text-gray-200 text-8xl font-bold transform rotate-[-45deg] opacity-10 select-none"
            style={{ fontSize: '120px' }}
          >
            LOOKSCOUT
          </div>
        </div>
      )}

      <div className="p-12 space-y-12">
        {/* Header */}
        <div className="border-b pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">{proposal.project_title}</h1>
              <p className="text-xl text-gray-600">
                Proposal for {proposal.client_name}
                {proposal.client_company && ` · ${proposal.client_company}`}
              </p>
            </div>
            {proposal.client_logo_url && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <Image
                  src={proposal.client_logo_url}
                  alt={proposal.client_name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {proposal.client_email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {proposal.client_email}
              </div>
            )}
            {proposal.client_company && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {proposal.client_company}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(proposal.created_at), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>

        {/* Project Overview */}
        {proposal.project_description && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Project Overview</h2>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {proposal.project_description}
            </p>
          </div>
        )}

        {/* Project Goals */}
        {proposal.project_goals && proposal.project_goals.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Project Goals</h2>
            <div className="space-y-3">
              {proposal.project_goals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-lg text-gray-700">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables */}
        {proposal.deliverables && proposal.deliverables.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Deliverables</h2>
            <div className="space-y-6">
              {proposal.deliverables.map((deliverable, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6 py-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl font-semibold">{deliverable.title}</h3>
                    {deliverable.timeline && (
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                        {deliverable.timeline}
                      </span>
                    )}
                  </div>
                  {deliverable.description && (
                    <p className="text-gray-700">{deliverable.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {(proposal.timeline_start || proposal.timeline_end) && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Timeline</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Start Date</p>
                  <p className="text-xl font-semibold">
                    {proposal.timeline_start 
                      ? format(new Date(proposal.timeline_start), 'MMMM d, yyyy')
                      : 'TBD'}
                  </p>
                </div>
                <div className="h-px flex-1 mx-8 bg-blue-300"></div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="text-xl font-semibold">
                    {proposal.timeline_end 
                      ? format(new Date(proposal.timeline_end), 'MMMM d, yyyy')
                      : 'TBD'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Investment */}
        {proposal.total_price && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Investment</h2>
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg p-8">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-8 w-8" />
                <div>
                  <p className="text-sm opacity-90">Total Investment</p>
                  <p className="text-5xl font-bold">
                    ${proposal.total_price.toLocaleString()}
                  </p>
                </div>
              </div>
              {proposal.payment_terms && (
                <p className="mt-4 text-blue-100">
                  Payment Terms: {proposal.payment_terms}
                </p>
              )}
            </div>
          </div>
        )}

        {/* About Us */}
        {proposal.about_us && (
          <div>
            <h2 className="text-3xl font-bold mb-4">About Us</h2>
            <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {proposal.about_us}
            </p>
          </div>
        )}

        {/* Terms & Conditions */}
        {proposal.terms_conditions && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Terms & Conditions</h2>
            <div className="bg-gray-50 border rounded-lg p-6">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {proposal.terms_conditions}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-8 text-center text-gray-600">
          <p className="mb-2">This proposal is valid for 30 days from the date above.</p>
          <p className="text-sm">
            Generated with{' '}
            <a href="https://look-app-eight.vercel.app" className="text-blue-600 hover:underline">
              Lookscout
            </a>
          </p>
        </div>

        {/* Upgrade CTA for watermarked proposals */}
        {showWatermark && (
          <div className="border-t pt-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Remove Watermark</h3>
              <p className="mb-4 opacity-90">
                Upgrade to Pro to create professional, watermark-free proposals
              </p>
              <a
                href="https://look-app-eight.vercel.app"
                className="inline-block bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Upgrade to Pro
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

