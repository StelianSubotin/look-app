"use client"

import { useState, useEffect } from "react"
import { 
  CheckCircle2, Calendar, DollarSign, Mail, Building2, 
  ArrowDown, Clock, Target, Package, FileText, Users,
  ChevronDown, MessageSquare, Send, Check, Sparkles
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

// Safe date formatter
function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'TBD'
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'TBD'
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  } catch {
    return 'TBD'
  }
}

// Animation hook for scroll reveal
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}

interface Deliverable {
  title: string
  description: string
  timeline: string
}

interface Comment {
  id: string
  author: string
  content: string
  created_at: string
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
  status?: string
  accepted_at?: string | null
  view_count?: number
  comments?: Comment[]
}

interface ProposalTemplateProps {
  proposal: ProposalData
  showWatermark: boolean
  onAccept?: () => void
  onComment?: (comment: string) => void
  isAccepting?: boolean
}

export function ProposalTemplate({ 
  proposal, 
  showWatermark, 
  onAccept,
  onComment,
  isAccepting 
}: ProposalTemplateProps) {
  const [activeSection, setActiveSection] = useState('')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  
  useScrollReveal()

  // Calculate project duration in weeks
  const getProjectDuration = () => {
    if (!proposal.timeline_start || !proposal.timeline_end) return null
    const start = new Date(proposal.timeline_start)
    const end = new Date(proposal.timeline_end)
    const weeks = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7))
    return weeks
  }

  const duration = getProjectDuration()

  const handleSubmitComment = () => {
    if (commentText.trim() && onComment) {
      onComment(commentText)
      setCommentText('')
      setShowCommentForm(false)
    }
  }

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'goals', label: 'Goals' },
    { id: 'deliverables', label: 'Deliverables' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'investment', label: 'Investment' },
    { id: 'about', label: 'About Us' },
  ]

  return (
    <div className="relative bg-white text-gray-900 min-h-screen">
      {/* CSS for animations */}
      <style jsx global>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .scroll-reveal.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .scroll-reveal:nth-child(2) { transition-delay: 0.1s; }
        .scroll-reveal:nth-child(3) { transition-delay: 0.2s; }
        .scroll-reveal:nth-child(4) { transition-delay: 0.3s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s ease-in-out infinite;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Watermark for free users */}
      {showWatermark && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 print:hidden">
          <div 
            className="text-gray-300 font-bold transform rotate-[-45deg] select-none"
            style={{ fontSize: '100px', opacity: 0.08 }}
          >
            LOOKSCOUT
          </div>
        </div>
      )}

      {/* Floating Navigation */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block print:hidden">
        <div className="bg-white/80 backdrop-blur-lg rounded-full py-3 px-2 shadow-lg border">
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={section.label}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-[120px] animate-pulse-soft" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[150px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-[200px] opacity-20" />
          </div>
          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Client Logo */}
          {proposal.client_logo_url && (
            <div className="mb-8 scroll-reveal">
              <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 p-3">
                <Image
                  src={proposal.client_logo_url}
                  alt={proposal.client_name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl text-white/90 px-4 py-2 rounded-full text-sm mb-6 border border-white/20 scroll-reveal">
            <Sparkles className="h-4 w-4" />
            Project Proposal
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 scroll-reveal leading-tight">
            {proposal.project_title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-200 mb-8 scroll-reveal">
            Prepared exclusively for{' '}
            <span className="text-white font-semibold">{proposal.client_name}</span>
            {proposal.client_company && (
              <span className="text-blue-300"> at {proposal.client_company}</span>
            )}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 scroll-reveal">
            {duration && (
              <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-4 border border-white/20">
                <div className="flex items-center gap-2 text-blue-300 text-sm mb-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <div className="text-2xl font-bold text-white">{duration} weeks</div>
              </div>
            )}
            {proposal.deliverables && proposal.deliverables.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-4 border border-white/20">
                <div className="flex items-center gap-2 text-blue-300 text-sm mb-1">
                  <Package className="h-4 w-4" />
                  Deliverables
                </div>
                <div className="text-2xl font-bold text-white">{proposal.deliverables.length} items</div>
              </div>
            )}
            {proposal.total_price && (
              <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-4 border border-white/20">
                <div className="flex items-center gap-2 text-blue-300 text-sm mb-1">
                  <DollarSign className="h-4 w-4" />
                  Investment
                </div>
                <div className="text-2xl font-bold text-white">${proposal.total_price.toLocaleString()}</div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 scroll-reveal">
            {proposal.status !== 'accepted' && onAccept && (
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-6 text-lg rounded-xl shadow-xl shadow-blue-500/25"
                onClick={onAccept}
                disabled={isAccepting}
              >
                <Check className="h-5 w-5 mr-2" />
                {isAccepting ? 'Processing...' : 'Accept Proposal'}
              </Button>
            )}
            {proposal.status === 'accepted' && (
              <div className="bg-green-500/20 text-green-300 px-6 py-3 rounded-xl border border-green-500/30 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Proposal Accepted on {formatDate(proposal.accepted_at || null)}
              </div>
            )}
            <a 
              href="#overview" 
              className="text-white/80 hover:text-white flex items-center gap-2 transition-colors"
            >
              View Details
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-24">
        
        {/* Project Overview */}
        {proposal.project_description && (
          <section id="overview" className="scroll-reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold">Project Overview</h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-8 border">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {proposal.project_description}
              </p>
            </div>
          </section>
        )}

        {/* Project Goals */}
        {proposal.project_goals && proposal.project_goals.length > 0 && (
          <section id="goals" className="scroll-reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold">Project Goals</h2>
            </div>
            <div className="grid gap-4">
              {proposal.project_goals.map((goal, index) => (
                <div 
                  key={index} 
                  className="scroll-reveal flex items-start gap-4 bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="p-2 bg-green-100 rounded-lg shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-lg text-gray-700 pt-1">{goal}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {proposal.deliverables && proposal.deliverables.length > 0 && (
          <section id="deliverables" className="scroll-reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold">Deliverables</h2>
            </div>
            <div className="space-y-4">
              {proposal.deliverables.map((deliverable, index) => (
                <div 
                  key={index} 
                  className="scroll-reveal group bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-semibold">{deliverable.title}</h3>
                      </div>
                      {deliverable.timeline && (
                        <span className="shrink-0 text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
                          {deliverable.timeline}
                        </span>
                      )}
                    </div>
                    {deliverable.description && (
                      <p className="text-gray-600 pl-[52px]">{deliverable.description}</p>
                    )}
                  </div>
                  <div className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {(proposal.timeline_start || proposal.timeline_end) && (
          <section id="timeline" className="scroll-reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold">Timeline</h2>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
              <div className="flex items-center justify-between relative">
                <div className="text-center">
                  <p className="text-sm text-orange-600 font-medium mb-2">Start Date</p>
                  <div className="bg-white rounded-xl px-6 py-4 shadow-sm border">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDate(proposal.timeline_start)}
                    </p>
                  </div>
                </div>
                
                <div className="flex-1 mx-8 relative">
                  <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-full border shadow-sm">
                    <span className="text-sm font-medium text-gray-600">
                      {duration ? `${duration} weeks` : 'Duration TBD'}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-amber-600 font-medium mb-2">End Date</p>
                  <div className="bg-white rounded-xl px-6 py-4 shadow-sm border">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDate(proposal.timeline_end)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Investment */}
        {proposal.total_price && (
          <section id="investment" className="scroll-reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold">Investment</h2>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-3xl p-10">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative">
                <p className="text-emerald-200 text-lg mb-2">Total Project Investment</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl md:text-7xl font-bold">
                    ${proposal.total_price.toLocaleString()}
                  </span>
                  <span className="text-emerald-200 text-xl">USD</span>
                </div>
                
                {proposal.payment_terms && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-sm text-emerald-200 mb-1">Payment Terms</p>
                    <p className="text-lg">{proposal.payment_terms}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* About Us */}
        {proposal.about_us && (
          <section id="about" className="scroll-reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold">About Us</h2>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50/30 rounded-2xl p-8 border">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {proposal.about_us}
              </p>
            </div>
          </section>
        )}

        {/* Terms & Conditions */}
        {proposal.terms_conditions && (
          <section className="scroll-reveal">
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none mb-4">
                <div className="p-3 bg-gray-100 rounded-xl">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <h2 className="text-3xl font-bold">Terms & Conditions</h2>
                <ChevronDown className="h-5 w-5 text-gray-400 ml-auto transition-transform group-open:rotate-180" />
              </summary>
              <div className="bg-gray-50 rounded-2xl p-6 border">
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                  {proposal.terms_conditions}
                </p>
              </div>
            </details>
          </section>
        )}

        {/* Comments Section */}
        {onComment && (
          <section className="scroll-reveal">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold">Comments & Feedback</h2>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </Button>
            </div>

            {showCommentForm && (
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
                <Textarea
                  placeholder="Share your thoughts or ask questions about this proposal..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-4 min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowCommentForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitComment} className="gap-2">
                    <Send className="h-4 w-4" />
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {proposal.comments && proposal.comments.length > 0 ? (
              <div className="space-y-4">
                {proposal.comments.map((comment) => (
                  <div key={comment.id} className="bg-white rounded-xl p-5 border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {comment.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </section>
        )}

        {/* Accept CTA - Bottom */}
        {proposal.status !== 'accepted' && onAccept && (
          <section className="scroll-reveal">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-center text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Accept this proposal to begin our collaboration. We&apos;re excited to bring your vision to life.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-10 py-6 text-lg rounded-xl"
                onClick={onAccept}
                disabled={isAccepting}
              >
                <Check className="h-5 w-5 mr-2" />
                {isAccepting ? 'Processing...' : 'Accept Proposal'}
              </Button>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t pt-12 pb-8 scroll-reveal">
          <div className="text-center">
            <p className="text-gray-500 mb-2">This proposal is valid for 30 days from the date of issue.</p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <span>Created {formatDate(proposal.created_at)}</span>
              {proposal.view_count !== undefined && proposal.view_count > 0 && (
                <span>Viewed {proposal.view_count} times</span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Powered by{' '}
              <a href="https://look-app-eight.vercel.app" className="text-blue-600 hover:underline">
                Lookscout
              </a>
            </p>
          </div>
        </footer>

        {/* Upgrade CTA for watermarked proposals */}
        {showWatermark && (
          <div className="fixed bottom-6 right-6 z-50 print:hidden">
            <a
              href="https://look-app-eight.vercel.app"
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full pl-5 pr-6 py-3 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Remove Watermark - Upgrade to Pro</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
