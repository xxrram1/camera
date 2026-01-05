'use client'

interface LayoutSelectorProps {
  selectedLayout: '1:1' | '4:5' | 'grid'
  onLayoutChange: (layout: '1:1' | '4:5' | 'grid') => void
}

export default function LayoutSelector({ selectedLayout, onLayoutChange }: LayoutSelectorProps) {
  const layouts = [
    { id: '1:1' as const, name: 'Square', icon: '⬜' },
    { id: '4:5' as const, name: 'Portrait', icon: '▭' },
    { id: 'grid' as const, name: 'Grid', icon: '⬛' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Layout</h3>
      <div className="grid grid-cols-3 gap-3">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onLayoutChange(layout.id)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedLayout === layout.id
                ? 'border-gray-900 bg-gray-50 shadow-soft'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">{layout.icon}</div>
            <div className="text-xs font-medium text-gray-700">{layout.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

