"use client"

import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Home, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'

// Dynamic import for tldraw
const Tldraw = dynamic(
  async () => {
    const mod = await import('@tldraw/tldraw')
    return mod.Tldraw
  },
  { 
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
)

import '@tldraw/tldraw/tldraw.css'

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
  const [editor, setEditor] = useState<any>(null)

  const handleMount = useCallback((editorInstance: any) => {
    setEditor(editorInstance)
    
    // Load the board data
    try {
      const snapshot = typeof board.data === 'string' 
        ? JSON.parse(board.data) 
        : board.data
      
      if (snapshot && Object.keys(snapshot).length > 0) {
        editorInstance.store.loadSnapshot(snapshot)
      }
    } catch (error) {
      console.error('Error loading board data:', error)
    }

    // Set to read-only mode
    editorInstance.updateInstanceState({ isReadonly: true })
  }, [board.data])

  const exportPNG = async () => {
    if (!editor) return

    try {
      const shapeIds = editor.getCurrentPageShapeIds()
      if (shapeIds.size === 0) {
        alert('No content to export')
        return
      }

      const blob = await editor.getSvg(Array.from(shapeIds))
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-background z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
            <Home className="h-4 w-4" />
            Lookscout
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-medium">{board.name}</h1>
          <span className="text-xs bg-muted px-2 py-1 rounded">View Only</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportPNG}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
          <Link href="/tools/mood-board">
            <Button size="sm">
              Create Your Own
            </Button>
          </Link>
        </div>
      </div>

      {/* Canvas (Read-only) */}
      <div className="flex-1">
        <Tldraw onMount={handleMount} />
      </div>
    </div>
  )
}

