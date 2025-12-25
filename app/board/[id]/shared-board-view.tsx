"use client"

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Home, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Dynamic import for tldraw wrapper
const TldrawEditor = dynamic(
  () => import('@/components/tldraw-editor').then(mod => mod.TldrawEditor),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }
)

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
  const editorRef = useRef<any>(null)

  const handleMount = (editor: any) => {
    editorRef.current = editor
  }

  const exportPNG = async () => {
    if (!editorRef.current) return

    try {
      const shapeIds = editorRef.current.getCurrentPageShapeIds()
      if (shapeIds.size === 0) {
        alert('No content to export')
        return
      }

      const blob = await editorRef.current.getSvg(Array.from(shapeIds))
      if (blob) {
        const svgString = new XMLSerializer().serializeToString(blob)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          canvas.width = img.width * 2
          canvas.height = img.height * 2
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
          
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const url = URL.createObjectURL(pngBlob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${board.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
              a.click()
              URL.revokeObjectURL(url)
            }
          }, 'image/png')
        }
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)))
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  // Parse board data for initial load
  const initialData = typeof board.data === 'string' ? board.data : JSON.stringify(board.data)

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
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">View Only</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportPNG}>
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
          <Link href="/tools/mood-board">
            <Button size="sm">Create Your Own</Button>
          </Link>
        </div>
      </div>

      {/* Canvas (Read-only) */}
      <div className="flex-1 relative">
        <TldrawEditor 
          onMount={handleMount} 
          readOnly={true}
          initialData={initialData}
        />
      </div>
    </div>
  )
}

