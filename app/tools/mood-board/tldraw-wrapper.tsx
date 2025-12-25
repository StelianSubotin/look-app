"use client"

import { Excalidraw } from '@excalidraw/excalidraw'
import { useEffect, useState } from 'react'

// Import Excalidraw styles
import '@excalidraw/excalidraw/index.css'

export default function ExcalidrawWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full" />
      </div>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <Excalidraw 
        theme="light"
        UIOptions={{
          canvasActions: {
            saveToActiveFile: false,
            loadScene: false,
            export: { saveFileToDisk: true },
          },
        }}
      />
    </div>
  )
}
