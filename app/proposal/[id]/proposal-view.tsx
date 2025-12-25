"use client"

import { useEffect, useState, useCallback } from "react"
import { ProposalTemplate } from "@/components/proposal-template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Download, Home, Eye, Clock, Share2, 
  CheckCircle, Copy, ExternalLink 
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Deliverable {
  title: string
  description: string
  timeline: string
}

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
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
  status?: string
  accepted_at?: string | null
  view_count?: number
}

interface ProposalViewProps {
  proposal: ProposalData
  isPro: boolean
}

export function ProposalView({ proposal: initialProposal, isPro }: ProposalViewProps) {
  const [proposal, setProposal] = useState(initialProposal)
  const [comments, setComments] = useState<Comment[]>([])
  const [isAccepting, setIsAccepting] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [acceptorName, setAcceptorName] = useState('')
  const [copied, setCopied] = useState(false)
  const [viewStartTime] = useState(Date.now())

  // Track view on mount
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch(`/api/proposals/${proposal.id}/view`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sectionsViewed: [] })
        })
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }
    trackView()
  }, [proposal.id])

  // Track time spent on unmount
  useEffect(() => {
    return () => {
      const timeSpent = Math.round((Date.now() - viewStartTime) / 1000)
      if (timeSpent > 5) { // Only track if more than 5 seconds
        navigator.sendBeacon(
          `/api/proposals/${proposal.id}/view`,
          JSON.stringify({ timeSpent })
        )
      }
    }
  }, [proposal.id, viewStartTime])

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/proposals/${proposal.id}/comments`)
        if (res.ok) {
          const data = await res.json()
          setComments(data.comments || [])
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }
    fetchComments()
  }, [proposal.id])

  const handleAccept = useCallback(async () => {
    if (!acceptorName.trim()) return
    
    setIsAccepting(true)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acceptorName })
      })
      
      if (res.ok) {
        const data = await res.json()
        setProposal(prev => ({
          ...prev,
          status: 'accepted',
          accepted_at: data.accepted_at
        }))
        setShowAcceptDialog(false)
      }
    } catch (error) {
      console.error('Failed to accept proposal:', error)
    } finally {
      setIsAccepting(false)
    }
  }, [proposal.id, acceptorName])

  const handleComment = useCallback(async (content: string) => {
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          author: proposal.client_name || 'Client',
          email: proposal.client_email
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        setComments(prev => [...prev, data.comment])
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }, [proposal.id, proposal.client_name, proposal.client_email])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Transform comments to match template interface
  const formattedComments = comments.map(c => ({
    id: c.id,
    author: c.author_name,
    content: c.content,
    created_at: c.created_at
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 print:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Lookscout</span>
          </Link>
          
          {/* Status Badge */}
          <div className="flex items-center gap-4">
            {proposal.status === 'accepted' && (
              <div className="hidden sm:flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Accepted
              </div>
            )}
            
            {proposal.view_count !== undefined && proposal.view_count > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-gray-500 text-sm">
                <Eye className="h-4 w-4" />
                {proposal.view_count} views
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            
            {!isPro && (
              <Link href="/">
                <Button variant="outline" size="sm" className="hidden sm:flex">
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
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Proposal Content */}
      <ProposalTemplate 
        proposal={{
          ...proposal,
          comments: formattedComments
        }} 
        showWatermark={!isPro}
        onAccept={() => setShowAcceptDialog(true)}
        onComment={handleComment}
        isAccepting={isAccepting}
      />

      {/* Accept Dialog */}
      <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Accept Proposal
            </DialogTitle>
            <DialogDescription>
              By accepting this proposal, you agree to the terms and conditions outlined above.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Name</label>
              <Input
                placeholder="Enter your full name"
                value={acceptorName}
                onChange={(e) => setAcceptorName(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">
              This will serve as your digital signature confirming acceptance of the proposal.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!acceptorName.trim() || isAccepting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAccepting ? 'Processing...' : 'Confirm Acceptance'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Share Proposal
            </DialogTitle>
            <DialogDescription>
              Share this proposal link with your client or team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="font-mono text-sm"
              />
              <Button onClick={handleCopyLink} variant="outline" className="shrink-0">
                {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => {
                  window.open(`mailto:?subject=Proposal: ${proposal.project_title}&body=View the proposal here: ${window.location.href}`, '_blank')
                }}
              >
                Email Link
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => window.open(window.location.href, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
