'use client'

import { LayoutType, LAYOUT_CONFIGS } from '@/lib/layoutTypes'

interface LayoutSelectorProps {
  selectedLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
}

export default function LayoutSelector({ selectedLayout, onLayoutChange }: LayoutSelectorProps) {
  // Convert config object to array for mapping
  const layouts = Object.values(LAYOUT_CONFIGS)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Layout</h3>
      <div className="grid grid-cols-3 gap-3">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedLayout === layout.id
                ? 'border-gray-900 bg-gray-50 shadow-soft'
                : 'border-gray-200 hover:border-gray-300'
              }`}
          >
            {/* Simple visual representation of aspect ratio */}
            <div
              className="border-2 border-current rounded-sm"
              style={{
                width: '24px',
                height: `${24 / layout.aspectRatio}px`,
                maxHeight: '32px'
              }}
            />
            <div className="text-xs font-medium text-gray-700">{layout.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

