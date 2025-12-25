"use client"

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'

// Dynamic import for tldraw - completely isolated
const TldrawWrapper = dynamic(
  () => import('./tldraw-wrapper'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }
)

export default function MoodBoardPage() {
  const router = useRouter()

  return (
    <div className="h-screen flex flex-col">
      {/* Simple Header */}
      <div className="h-12 border-b flex items-center px-4 bg-white shrink-0">
        <Button variant="ghost" size="sm" onClick={() => router.push('/tools')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Button>
        <span className="ml-4 font-medium">Mood Board</span>
      </div>

      {/* Canvas - Full height */}
      <div className="flex-1">
        <TldrawWrapper />
      </div>
    </div>
  )
}
