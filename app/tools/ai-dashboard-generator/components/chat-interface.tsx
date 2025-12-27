"use client"

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, Sparkles, Loader2, User } from 'lucide-react'
import { DashboardConfig } from '@/lib/dashboard-schema'

interface ChatInterfaceProps {
  onDashboardGenerated: (config: DashboardConfig) => void
}

export function ChatInterface({ onDashboardGenerated }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/ai-dashboard',
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onFinish: (message) => {
      // Try to parse JSON from the AI response
      try {
        // Remove markdown code blocks if present
        let content = message.content.trim()
        
        // Remove ```json and ``` wrappers if present
        if (content.startsWith('```')) {
          content = content.replace(/```json?\n?/g, '').replace(/```\n?$/g, '')
        }
        
        const dashboardConfig = JSON.parse(content)
        onDashboardGenerated(dashboardConfig)
      } catch (e) {
        console.error('Failed to parse dashboard config:', e)
        console.log('Raw content:', message.content)
        // Still show the message even if parsing fails
      }
    }
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">AI Dashboard Generator</h3>
            <p className="text-xs text-muted-foreground">
              Describe your dashboard and I&apos;ll design it
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="text-4xl">💬</div>
            <div>
              <h4 className="font-semibold mb-2">Start a Conversation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Try asking for a dashboard like:
              </p>
              <div className="space-y-2 text-sm">
                <Card className="p-3 text-left hover:bg-accent cursor-pointer transition-colors">
                  <p className="font-medium">Hotel Analytics Dashboard</p>
                  <p className="text-xs text-muted-foreground">
                    with occupancy, revenue, and bookings
                  </p>
                </Card>
                <Card className="p-3 text-left hover:bg-accent cursor-pointer transition-colors">
                  <p className="font-medium">SaaS Metrics Dashboard</p>
                  <p className="text-xs text-muted-foreground">
                    showing MRR, churn, and user growth
                  </p>
                </Card>
                <Card className="p-3 text-left hover:bg-accent cursor-pointer transition-colors">
                  <p className="font-medium">E-commerce Dashboard</p>
                  <p className="text-xs text-muted-foreground">
                    with sales, orders, and top products
                  </p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}

            <Card
              className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </CardContent>
            </Card>

            {message.role === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <Card className="bg-muted">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Generating dashboard...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Card className="bg-destructive/10 border-destructive">
            <CardContent className="p-3">
              <p className="text-sm text-destructive">
                Error: {error.message}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Describe the dashboard you want to create..."
            className="min-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleFormSubmit(e)
              }
            }}
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to send
            </p>
            <Button type="submit" disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

