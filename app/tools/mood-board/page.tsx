"use client"

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Save, 
  Share2, 
  Download, 
  FolderOpen, 
  Plus,
  Loader2,
  Check,
  Copy,
  ArrowLeft
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Dynamic import for tldraw to avoid SSR issues
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

// Import tldraw styles
import '@tldraw/tldraw/tldraw.css'

interface Board {
  id: string
  name: string
  data: string
  share_link: string | null
  created_at: string
  updated_at: string
}

export default function MoodBoardPage() {
  const router = useRouter()
  const [editor, setEditor] = useState<any>(null)
  const [boardName, setBoardName] = useState('Untitled Board')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [boards, setBoards] = useState<Board[]>([])
  const [loadingBoards, setLoadingBoards] = useState(false)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  // Handle editor mount
  const handleMount = useCallback((editorInstance: any) => {
    setEditor(editorInstance)
  }, [])

  // Save board
  const saveBoard = async () => {
    if (!editor || !user) {
      if (!user) {
        router.push('/login?redirect=/tools/mood-board')
      }
      return
    }

    setSaving(true)
    try {
      const snapshot = editor.store.getSnapshot()
      const data = JSON.stringify(snapshot)

      if (currentBoardId) {
        // Update existing board
        const { error } = await supabase
          .from('mood_boards')
          .update({ 
            name: boardName, 
            data,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentBoardId)

        if (error) throw error
      } else {
        // Create new board
        const { data: newBoard, error } = await supabase
          .from('mood_boards')
          .insert({
            user_id: user.id,
            name: boardName,
            data
          })
          .select()
          .single()

        if (error) throw error
        setCurrentBoardId(newBoard.id)
        setShareLink(newBoard.share_link)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving board:', error)
      alert('Failed to save board')
    } finally {
      setSaving(false)
    }
  }

  // Load boards list
  const loadBoardsList = async () => {
    if (!user) return

    setLoadingBoards(true)
    try {
      const { data, error } = await supabase
        .from('mood_boards')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setBoards(data || [])
    } catch (error) {
      console.error('Error loading boards:', error)
    } finally {
      setLoadingBoards(false)
    }
  }

  // Load a specific board
  const loadBoard = async (board: Board) => {
    if (!editor) return

    try {
      const snapshot = JSON.parse(board.data)
      editor.store.loadSnapshot(snapshot)
      setBoardName(board.name)
      setCurrentBoardId(board.id)
      setShareLink(board.share_link)
      setShowLoadDialog(false)
    } catch (error) {
      console.error('Error loading board:', error)
      alert('Failed to load board')
    }
  }

  // Create new board
  const newBoard = () => {
    if (editor) {
      editor.store.clear()
    }
    setBoardName('Untitled Board')
    setCurrentBoardId(null)
    setShareLink(null)
  }

  // Export as PNG
  const exportPNG = async () => {
    if (!editor) return

    try {
      const shapeIds = editor.getCurrentPageShapeIds()
      if (shapeIds.size === 0) {
        alert('Add some content to export!')
        return
      }

      const blob = await editor.getSvg(Array.from(shapeIds))
      if (blob) {
        // Convert SVG to PNG using canvas
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
              a.download = `${boardName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`
              a.click()
              URL.revokeObjectURL(url)
            }
          }, 'image/png')
        }
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)))
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export. Try selecting specific shapes.')
    }
  }

  // Generate share link
  const generateShareLink = async () => {
    if (!currentBoardId) {
      await saveBoard()
    }
    
    if (shareLink) {
      setShowShareDialog(true)
      return
    }

    try {
      const { data, error } = await supabase
        .from('mood_boards')
        .update({ 
          share_link: crypto.randomUUID().substring(0, 12)
        })
        .eq('id', currentBoardId)
        .select('share_link')
        .single()

      if (error) throw error
      setShareLink(data.share_link)
      setShowShareDialog(true)
    } catch (error) {
      console.error('Error generating share link:', error)
    }
  }

  const copyShareLink = () => {
    const link = `${window.location.origin}/board/${shareLink}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-background z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push('/tools')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tools
          </Button>
          <div className="h-6 w-px bg-border" />
          <Input
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-48 h-8 text-sm font-medium"
            placeholder="Board name..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={newBoard}
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              loadBoardsList()
              setShowLoadDialog(true)
            }}
            disabled={!user}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Open
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={saveBoard}
            disabled={saving || !user}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saved ? 'Saved!' : 'Save'}
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={generateShareLink}
            disabled={!user}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={exportPNG}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <Tldraw onMount={handleMount} />
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Mood Board</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your mood board
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input 
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/board/${shareLink}`}
                readOnly
                className="font-mono text-sm"
              />
              <Button onClick={copyShareLink} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with clients or colleagues to get feedback on your mood board.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your Mood Boards</DialogTitle>
            <DialogDescription>
              Select a board to open
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {loadingBoards ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : boards.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No boards yet. Create your first one!
              </p>
            ) : (
              boards.map((board) => (
                <button
                  key={board.id}
                  onClick={() => loadBoard(board)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <p className="font-medium">{board.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(board.updated_at).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

