'use client'

import { useState } from 'react'
import html2canvas from 'html2canvas'
import { LayoutType, LAYOUT_CONFIGS } from '@/lib/layoutTypes'

interface SaveAndShareProps {
  imageData: string
  children?: React.ReactNode
  onRetake?: () => void
  layout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
  // Editor Tool Props
  activeTool: 'draw' | 'text' | null
  onToolChange: (tool: 'draw' | 'text' | null) => void
  dateEnabled: boolean
  onToggleDate: () => void
  drawingColor: string
  onColorChange: (color: string) => void
}

export default function SaveAndShare({
  imageData,
  children,
  onRetake,
  layout,
  onLayoutChange,
  activeTool,
  onToolChange,
  dateEnabled,
  onToggleDate,
  drawingColor,
  onColorChange
}: SaveAndShareProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleDownload = async () => {
    setIsSaving(true)
    try {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        // ... existing canvas logic
        const dataURL = canvas.toDataURL('image/jpeg', 0.95)
        const link = document.createElement('a')
        link.download = `film-cam-${Date.now()}.jpg`
        link.href = dataURL
        link.click()
        return
      }

      // Fallback if no canvas (e.g. just image data)
      const link = document.createElement('a')
      link.href = imageData
      link.download = `film-cam-${Date.now()}.jpg`
      link.click()
    } catch (error) {
      console.error('Error downloading image:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) return

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `film-cam-${Date.now()}.jpg`, { type: 'image/jpeg' })

        if (navigator.share && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'Film Camera Photo',
            })
          } catch (error) {
            console.error('Error sharing:', error)
          }
        } else {
          // Fallback: copy to clipboard or download
          handleDownload()
        }
      }, 'image/jpeg', 0.95)
    } catch (error) {
      console.error('Error sharing image:', error)
    }
  }

  const colors = ['#ffffff', '#000000', '#ff0000', '#ffff00', '#00ff00', '#0000ff']

  return (
    <div className="w-full h-full flex flex-col pt-[var(--safe-top)] pb-[var(--safe-bottom)] animate-slide-up bg-[#1a1a1a]">

      {/* Header - iOS Style */}
      <div className="shrink-0 h-16 flex items-center justify-between px-4 bg-black/80 backdrop-blur-xl border-b border-white/10 safe-area-top">
        {/* Tools (Left) */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleDate}
            className={`p-2 rounded-full transition-all ${dateEnabled ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/50'}`}
          >
            <span className="font-mono text-xs font-bold">DATE</span>
          </button>
          <button
            onClick={() => onToolChange(activeTool === 'draw' ? null : 'draw')}
            className={`p-2 rounded-full transition-all ${activeTool === 'draw' ? 'bg-white text-black' : 'bg-white/10 text-white/50'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
          </button>
          <button
            onClick={() => {
              if (activeTool === 'text') {
                // Add text when clicking again (text tool is active)
                const canvas = document.querySelector('canvas')
                if (canvas) {
                  // Text will be added via CanvasEditor's activeTool effect
                  // Just toggle to trigger
                }
              }
              onToolChange(activeTool === 'text' ? null : 'text')
            }}
            className={`p-2 rounded-full transition-all ${activeTool === 'text' ? 'bg-white text-black' : 'bg-white/10 text-white/50'}`}
          >
            <span className="font-serif font-bold text-xs">T</span>
          </button>

          {(activeTool === 'draw' || activeTool === 'text') && (
            <div className="flex gap-2 ml-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => onColorChange(c)}
                  style={{ backgroundColor: c }}
                  className={`w-4 h-4 rounded-full border border-white/20 ${drawingColor === c ? 'ring-2 ring-white scale-125' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onRetake}
          className="px-4 py-2 text-white/70 hover:text-white font-semibold text-sm transition-colors"
        >
          Done
        </button>
      </div>

      {/* Main Content (Photo) */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-0 bg-[#121212] relative overflow-hidden">
        {/* Background 'Red Light' Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-red-900/10 blur-[100px] pointer-events-none" />

        {/* Photo Container - constrained to not overflow */}
        <div
          className="relative w-full max-w-sm shadow-2xl transition-all duration-500"
          style={{ aspectRatio: LAYOUT_CONFIGS[layout].aspectRatio }}
        >
          {/* Glossy Overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

          {/* The developed photo placeholder */}
          <div className="w-full h-full bg-gray-100 overflow-hidden relative grayscale-[0.1] contrast-[1.1] flex items-center justify-center">
            {children ? children : (
              <img src={imageData} alt="Developed Film" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls - iOS Style */}
      <div className="shrink-0 bg-black/80 backdrop-blur-xl border-t border-white/10 p-6 space-y-6 z-30 safe-area-bottom">

        {/* Format Toggle - iOS Style */}
        <div className="flex justify-center w-full">
          <div className="flex bg-black/60 backdrop-blur-xl p-1 rounded-2xl border border-white/20 w-full md:w-auto">
            <div className="flex overflow-x-auto scrollbar-hide gap-1 px-1 w-full md:flex-wrap md:justify-center">
              {(['1:1', '4:5', '9:16', '16:9', '4:3', '3:4', 'polaroid'] as LayoutType[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => onLayoutChange(fmt)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${layout === fmt
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {LAYOUT_CONFIGS[fmt].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* iOS Style Buttons */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
          <button
            onClick={handleDownload}
            disabled={isSaving}
            className="w-full px-6 py-4 bg-blue-500 text-white text-base font-semibold rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? 'Saving...' : 'Save to Photos'}
          </button>

          <button
            onClick={handleShare}
            className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl text-white text-base font-semibold rounded-2xl hover:bg-white/30 active:scale-[0.98] transition-all border border-white/30"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

