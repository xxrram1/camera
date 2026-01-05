import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import CanvasEditor, { CanvasEditorRef } from '@/components/Editor/CanvasEditor'
import EditControls from '@/components/Editor/EditControls'
import LayoutSelector from '@/components/Editor/LayoutSelector'
import DateStampCustomizer from '@/components/Editor/DateStampCustomizer'
import SaveAndShare from '@/components/Editor/SaveAndShare'
import ExifDataDisplay from '@/components/Editor/ExifDataDisplay'
import { LayoutType } from '@/lib/layoutTypes'

export default function EditPage() {
  const searchParams = useSearchParams()
  const [imageData, setImageData] = useState<string | null>(null)
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('1:1')
  const [dateStampConfig, setDateStampConfig] = useState({
    enabled: true,
    color: '#000000',
    fontSize: 14,
    position: 'bottom-right' as 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right',
  })
  const [activeTool, setActiveTool] = useState<'text' | 'draw' | null>(null)
  const [drawingColor, setDrawingColor] = useState('#000000')
  const [drawingWidth, setDrawingWidth] = useState(5)
  const canvasEditorRef = useRef<CanvasEditorRef>(null)

  useEffect(() => {
    const image = searchParams.get('image')
    if (image) {
      setImageData(decodeURIComponent(image))
    }
  }, [searchParams])

  const handleAddText = () => {
    const text = prompt('Enter text:')
    if (text && canvasEditorRef.current) {
      canvasEditorRef.current.addText(text)
    }
  }

  if (!imageData) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-gray-500">Loading image...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="container mx-auto px-premium py-premium-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-premium">
          {/* Editor Canvas */}
          <div className="lg:col-span-2 space-y-premium">
            <CanvasEditor
              ref={canvasEditorRef}
              imageData={imageData}
              layout={selectedLayout}
              dateStampConfig={dateStampConfig}
              activeTool={activeTool}
              drawingColor={drawingColor}
              drawingWidth={drawingWidth}
            />
          </div>

          {/* Controls Sidebar */}
          <div className="space-y-premium">
            <div className="bg-white rounded-premium shadow-soft-lg p-premium space-y-premium">
              <h2 className="text-xl font-semibold text-gray-800">Edit</h2>

              <EditControls
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onAddText={handleAddText}
                drawingColor={drawingColor}
                onDrawingColorChange={setDrawingColor}
                drawingWidth={drawingWidth}
                onDrawingWidthChange={setDrawingWidth}
              />

              <LayoutSelector
                selectedLayout={selectedLayout}
                onLayoutChange={setSelectedLayout}
              />

              <DateStampCustomizer
                config={dateStampConfig}
                onConfigChange={setDateStampConfig}
              />

              <ExifDataDisplay />
            </div>

            <SaveAndShare imageData={imageData} />
          </div>
        </div>
      </div>
    </div>
  )
}

