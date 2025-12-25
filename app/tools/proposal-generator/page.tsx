"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Trash2, Upload, Link as LinkIcon, Download, Sparkles } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Deliverable {
  id: string
  title: string
  description: string
  timeline: string
}

export default function ProposalGeneratorPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  
  // Client Information
  const [clientName, setClientName] = useState("")
  const [clientCompany, setClientCompany] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientLogo, setClientLogo] = useState("")
  
  // Project Details
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectGoals, setProjectGoals] = useState("")
  
  // Deliverables
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: '1', title: '', description: '', timeline: '' }
  ])
  
  // Timeline & Pricing
  const [timelineStart, setTimelineStart] = useState("")
  const [timelineEnd, setTimelineEnd] = useState("")
  const [totalPrice, setTotalPrice] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("50% upfront, 50% upon completion")
  
  // Additional Info
  const [aboutUs, setAboutUs] = useState("")
  const [termsConditions, setTermsConditions] = useState("")

  const addDeliverable = () => {
    setDeliverables([...deliverables, { 
      id: Date.now().toString(), 
      title: '', 
      description: '', 
      timeline: '' 
    }])
  }

  const removeDeliverable = (id: string) => {
    setDeliverables(deliverables.filter(d => d.id !== id))
  }

  const updateDeliverable = (id: string, field: keyof Deliverable, value: string) => {
    setDeliverables(deliverables.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ))
  }

  const generateProposal = async () => {
    if (!projectTitle || !clientName) {
      alert("Please fill in at least Project Title and Client Name")
      return
    }

    setLoading(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login?redirect=/tools/proposal-generator')
        return
      }

      // Parse goals
      const goalsArray = projectGoals
        .split('\n')
        .map(g => g.trim())
        .filter(g => g.length > 0)

      // Create proposal
      const { data, error } = await supabase
        .from('proposals')
        .insert({
          user_id: user.id,
          client_name: clientName,
          client_company: clientCompany,
          client_email: clientEmail,
          client_logo_url: clientLogo,
          project_title: projectTitle,
          project_description: projectDescription,
          project_goals: goalsArray,
          deliverables: deliverables.filter(d => d.title.trim() !== ''),
          timeline_start: timelineStart || null,
          timeline_end: timelineEnd || null,
          total_price: totalPrice ? parseFloat(totalPrice) : null,
          payment_terms: paymentTerms,
          about_us: aboutUs,
          terms_conditions: termsConditions,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      // Generate shareable link
      const shareLink = `${window.location.origin}/proposal/${data.share_link}`
      setGeneratedLink(shareLink)

    } catch (error) {
      console.error('Error generating proposal:', error)
      alert('Failed to generate proposal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/tools')}
            className="text-sm font-medium hover:text-primary transition-colors mb-4"
          >
            ← Back to Tools
          </button>
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Proposal Generator</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create professional client proposals with shareable links and PDF export
          </p>
        </div>

        {!generatedLink ? (
          <div className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Details about your prospective client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name *</Label>
                    <Input
                      id="client-name"
                      placeholder="John Smith"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-company">Company</Label>
                    <Input
                      id="client-company"
                      placeholder="Acme Corp"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      placeholder="john@acme.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-logo">Client Logo URL (Optional)</Label>
                    <Input
                      id="client-logo"
                      placeholder="https://..."
                      value={clientLogo}
                      onChange={(e) => setClientLogo(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Describe the project scope and objectives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-title">Project Title *</Label>
                  <Input
                    id="project-title"
                    placeholder="Website Redesign & Brand Identity"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Project Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="A comprehensive overview of the project..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-goals">Project Goals (one per line)</Label>
                  <Textarea
                    id="project-goals"
                    placeholder="Increase conversion rate by 30%&#10;Modernize brand identity&#10;Improve mobile experience"
                    value={projectGoals}
                    onChange={(e) => setProjectGoals(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Deliverables */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Deliverables</CardTitle>
                    <CardDescription>What will be delivered to the client</CardDescription>
                  </div>
                  <Button onClick={addDeliverable} size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Deliverable
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {deliverables.map((deliverable, index) => (
                  <div key={deliverable.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Deliverable {index + 1}</h4>
                      {deliverables.length > 1 && (
                        <Button
                          onClick={() => removeDeliverable(deliverable.id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Title (e.g., Homepage Design)"
                        value={deliverable.title}
                        onChange={(e) => updateDeliverable(deliverable.id, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Timeline (e.g., Week 1-2)"
                        value={deliverable.timeline}
                        onChange={(e) => updateDeliverable(deliverable.id, 'timeline', e.target.value)}
                      />
                    </div>
                    <Textarea
                      placeholder="Description of this deliverable..."
                      value={deliverable.description}
                      onChange={(e) => updateDeliverable(deliverable.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Timeline & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline & Pricing</CardTitle>
                <CardDescription>Project duration and investment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline-start">Start Date</Label>
                    <Input
                      id="timeline-start"
                      type="date"
                      value={timelineStart}
                      onChange={(e) => setTimelineStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline-end">End Date</Label>
                    <Input
                      id="timeline-end"
                      type="date"
                      value={timelineEnd}
                      onChange={(e) => setTimelineEnd(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total-price">Total Investment ($)</Label>
                    <Input
                      id="total-price"
                      type="number"
                      placeholder="5000"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-terms">Payment Terms</Label>
                    <Input
                      id="payment-terms"
                      placeholder="50% upfront, 50% upon completion"
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Optional sections to personalize your proposal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about-us">About Us</Label>
                  <Textarea
                    id="about-us"
                    placeholder="Brief introduction about your agency or yourself..."
                    value={aboutUs}
                    onChange={(e) => setAboutUs(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Any terms, conditions, or legal requirements..."
                    value={termsConditions}
                    onChange={(e) => setTermsConditions(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={generateProposal}
              disabled={loading || !projectTitle || !clientName}
              size="lg"
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Generating Proposal...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Proposal
                </>
              )}
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Proposal Generated Successfully!
              </CardTitle>
              <CardDescription>
                Your proposal is ready to share with your client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <Label>Shareable Link</Label>
                <div className="flex gap-2">
                  <Input value={generatedLink} readOnly className="font-mono text-sm" />
                  <Button onClick={copyLink} variant="outline" className="gap-2 shrink-0">
                    <LinkIcon className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => window.open(generatedLink, '_blank')}
                  className="flex-1 gap-2"
                >
                  <FileText className="h-4 w-4" />
                  View Proposal
                </Button>
                <Button
                  onClick={() => {
                    const win = window.open(generatedLink, '_blank')
                    if (win) {
                      setTimeout(() => win.print(), 1000)
                    }
                  }}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Print / PDF
                </Button>
              </div>

              <Button
                onClick={() => {
                  setGeneratedLink(null)
                  router.push('/tools/proposal-generator')
                }}
                variant="outline"
                className="w-full"
              >
                Create Another Proposal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

