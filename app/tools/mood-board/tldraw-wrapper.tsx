"use client"

import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export default function TldrawWrapper() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Tldraw 
        persistenceKey="lookscout-mood-board"
      />
    </div>
  )
}

