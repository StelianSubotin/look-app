"use client"

import { Tldraw, Editor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useEffect, useRef } from 'react'

interface TldrawEditorProps {
  onMount?: (editor: Editor) => void
  readOnly?: boolean
  initialData?: string
}

export function TldrawEditor({ onMount, readOnly = false, initialData }: TldrawEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="w-full h-full">
      <Tldraw
        onMount={(editor) => {
          // Load initial data if provided
          if (initialData) {
            try {
              const snapshot = JSON.parse(initialData)
              editor.store.loadSnapshot(snapshot)
            } catch (e) {
              console.error('Failed to load initial data:', e)
            }
          }

          // Set read-only if needed
          if (readOnly) {
            editor.updateInstanceState({ isReadonly: true })
          }

          // Call onMount callback
          if (onMount) {
            onMount(editor)
          }
        }}
      />
    </div>
  )
}

