'use client'

interface EditControlsProps {
  activeTool: 'text' | 'draw' | null
  onToolChange: (tool: 'text' | 'draw' | null) => void
  onAddText: () => void
  drawingColor: string
  onDrawingColorChange: (color: string) => void
  drawingWidth: number
  onDrawingWidthChange: (width: number) => void
}

export default function EditControls({
  activeTool,
  onToolChange,
  onAddText,
  drawingColor,
  onDrawingColorChange,
  drawingWidth,
  onDrawingWidthChange,
}: EditControlsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Tools</h3>
      
      <div className="flex gap-3">
        <button
          onClick={() => {
            if (activeTool === 'text') {
              onAddText()
            } else {
              onToolChange('text')
            }
          }}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTool === 'text'
              ? 'bg-gray-900 text-white shadow-soft-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Text
        </button>
        
        <button
          onClick={() => onToolChange(activeTool === 'draw' ? null : 'draw')}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTool === 'draw'
              ? 'bg-gray-900 text-white shadow-soft-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Draw
        </button>
      </div>

      {activeTool === 'draw' && (
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Color</label>
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => onDrawingColorChange(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Brush Size: {drawingWidth}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={drawingWidth}
              onChange={(e) => onDrawingWidthChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  )
}

