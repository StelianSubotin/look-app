"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Helper component to test clipboard functionality
 * This helps debug what format Figma expects
 */
export function FigmaClipboardHelper() {
  const [testResult, setTestResult] = useState<string>("")

  const testClipboardRead = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()
      const results: string[] = []

      for (const item of clipboardItems) {
        for (const type of item.types) {
          const blob = await item.getType(type)
          const text = await blob.text()
          results.push(`${type}: ${text.substring(0, 100)}...`)
        }
      }

      setTestResult(results.join("\n\n"))
    } catch (err) {
      setTestResult(`Error: ${err}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clipboard Debug Helper</CardTitle>
        <CardDescription>
          Use this to inspect what's in your clipboard after copying from Figma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testClipboardRead}>Read Clipboard</Button>
        {testResult && (
          <div className="rounded-md bg-muted p-4">
            <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

