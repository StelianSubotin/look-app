"use client"

import { useState, useEffect } from 'react'
import { Card } from '@tremor/react'
import { Palette, X, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KpiData {
  name: string
  stat: string
  previousStat: string
  change: string
  changeType: 'positive' | 'negative'
}

interface EditableKpiCardProps {
  data: KpiData[]
  title?: string
  styles?: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }
  onStylesChange?: (styles: {
    backgroundColor?: string
    textColor?: string
    borderColor?: string
  }) => void
}

export function EditableKpiCard({ 
  data = [], 
  title, 
  styles = {},
  onStylesChange 
}: EditableKpiCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localStyles, setLocalStyles] = useState({
    backgroundColor: styles?.backgroundColor || '#ffffff',
    textColor: styles?.textColor || '#111827',
    borderColor: styles?.borderColor || '#e5e7eb',
  })

  // Sync local styles when prop changes
  useEffect(() => {
    if (styles) {
      setLocalStyles({
        backgroundColor: styles.backgroundColor || '#ffffff',
        textColor: styles.textColor || '#111827',
        borderColor: styles.borderColor || '#e5e7eb',
      })
    }
  }, [styles])

  // Ensure data is an array
  const kpiData = Array.isArray(data) ? data : []

  const handleStyleChange = (key: string, value: string) => {
    const newStyles = { ...localStyles, [key]: value }
    setLocalStyles(newStyles)
    onStylesChange?.(newStyles)
  }

  return (
    <div className="space-y-4 relative group">
      {/* Edit Button - appears on hover */}
      <div className="absolute top-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          <Palette className="h-4 w-4" />
          {isEditing ? 'Done' : 'Edit Colors'}
        </Button>
      </div>

      {/* Color Editor Panel */}
      {isEditing && (
        <div className="mb-4 p-4 bg-muted rounded-lg border space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Customize Colors</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Background Color */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localStyles.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="h-8 w-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={localStyles.backgroundColor}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border rounded font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Text</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localStyles.textColor}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="h-8 w-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={localStyles.textColor}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border rounded font-mono"
                  placeholder="#111827"
                />
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Border</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={localStyles.borderColor}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="h-8 w-12 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={localStyles.borderColor}
                  onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border rounded font-mono"
                  placeholder="#e5e7eb"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {kpiData.length === 0 ? (
        <div className="text-sm text-muted-foreground p-4">No KPI data available</div>
      ) : (
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpiData.map((item) => (
          <Card
            key={item.name}
            style={{
              backgroundColor: localStyles.backgroundColor,
              color: localStyles.textColor,
              borderColor: localStyles.borderColor,
            }}
            className="transition-all"
          >
            <dt className="text-sm font-medium opacity-80">
              {item.name}
            </dt>
            <dd className="mt-1 flex items-baseline space-x-2.5">
              <p className="text-2xl font-semibold">
                {item.stat}
              </p>
              <p className="text-sm opacity-70">
                from {item.previousStat}
              </p>
            </dd>
            <dd className="mt-4 flex items-center space-x-2">
              <p className="flex items-center space-x-0.5">
                {item.changeType === 'positive' ? (
                  <ArrowUp className="h-4 w-4 text-emerald-700" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-700" />
                )}
                <span className={item.changeType === 'positive' ? 'text-emerald-700' : 'text-red-700'}>
                  {item.change}
                </span>
              </p>
              <p className="text-sm opacity-70">from previous month</p>
            </dd>
          </Card>
        ))}
        </dl>
      )}
    </div>
  )
}

