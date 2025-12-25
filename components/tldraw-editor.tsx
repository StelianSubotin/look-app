"use client"

import { Tldraw, Editor } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

interface TldrawEditorProps {
  onMount?: (editor: Editor) => void
  readOnly?: boolean
  initialData?: string
}

export function TldrawEditor({ onMount, readOnly = false, initialData }: TldrawEditorProps) {
  return (
    <div className="w-full h-full">
      <Tldraw
        onMount={(editor) => {
          // Load initial data if provided
          if (initialData) {
            try {
              const snapshot = JSON.parse(initialData)
              // Use the correct API for loading snapshots
              if (snapshot && snapshot.store) {
                editor.store.mergeRemoteChanges(() => {
                  editor.store.put(Object.values(snapshot.store))
                })
              }
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

