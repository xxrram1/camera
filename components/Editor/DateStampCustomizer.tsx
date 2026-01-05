'use client'

interface DateStampCustomizerProps {
  config: {
    enabled: boolean
    color: string
    fontSize: number
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  }
  onConfigChange: (config: DateStampCustomizerProps['config']) => void
}

export default function DateStampCustomizer({ config, onConfigChange }: DateStampCustomizerProps) {
  const positions = [
    { id: 'top-left' as const, label: 'TL' },
    { id: 'top-right' as const, label: 'TR' },
    { id: 'bottom-left' as const, label: 'BL' },
    { id: 'bottom-right' as const, label: 'BR' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Date Stamp</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onConfigChange({ ...config, enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
        </label>
      </div>

      {config.enabled && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Color</label>
            <input
              type="color"
              value={config.color}
              onChange={(e) => onConfigChange({ ...config, color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">
              Font Size: {config.fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={config.fontSize}
              onChange={(e) => onConfigChange({ ...config, fontSize: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-2 block">Position</label>
            <div className="grid grid-cols-4 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => onConfigChange({ ...config, position: pos.id })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    config.position === pos.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

