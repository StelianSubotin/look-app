"use client"

import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
import Link from 'next/link'

interface Board {
  id: string
  name: string
  data: string
  share_link: string
  created_at: string
  updated_at: string
}

interface SharedBoardViewProps {
  board: Board
}

export function SharedBoardView({ board }: SharedBoardViewProps) {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
            <Home className="h-4 w-4" />
            Lookscout
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="font-medium">{board.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/tools/mood-board">
            <Button size="sm">Create Your Own</Button>
          </Link>
        </div>
      </div>

      {/* Coming soon message */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Shared board viewing coming soon</p>
          <Link href="/tools/mood-board">
            <Button className="mt-4">Create Your Own Board</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
