'use client'

import { useState, useRef, useEffect, useMemo, memo } from 'react'
import { useCamera } from '@/hooks/useCamera'
import FilterSelector from '@/components/Filters/FilterSelector'
import PolaroidModeToggle from '@/components/Camera/PolaroidModeToggle'
import CaptureButton from '@/components/Camera/CaptureButton'
import FilmDevelopingAnimation from '@/components/Camera/FilmDevelopingAnimation'
import FilmCameraTypeSelector from '@/components/Camera/FilmCameraTypeSelector'
import CameraMirrorToggle from '@/components/Camera/CameraMirrorToggle'
import CameraFlipToggle from '@/components/Camera/CameraFlipToggle'
import FlashToggle from '@/components/Camera/FlashToggle'
import { getFilterCSSOverlay } from '@/lib/filterPreview'
import { FILM_CAMERA_TYPES } from '@/lib/filmCameraTypes'
import { LayoutType } from '@/lib/layoutTypes'
import SaveAndShare from '@/components/Editor/SaveAndShare'
import CanvasEditor from '@/components/Editor/CanvasEditor'

export default function CameraView() {
  const [selectedCameraType, setSelectedCameraType] = useState<string>('kodak-portra')
  const [selectedFilter, setSelectedFilter] = useState<string>('kodak-portra')
  const [polaroidMode, setPolaroidMode] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [isDeveloping, setIsDeveloping] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // Flash Effect State
  const [showFlashEffect, setShowFlashEffect] = useState(false)

  const [editorLayout, setEditorLayout] = useState<LayoutType>('4:5')
  const [activeTool, setActiveTool] = useState<'draw' | 'text' | null>(null)
  const [drawingColor, setDrawingColor] = useState('#ff0000')

  // Editor State keys off polaroid mode initially
  useEffect(() => {
    setEditorLayout(polaroidMode ? 'polaroid' : '4:5')
  }, [polaroidMode])

  const [dateStampConfig, setDateStampConfig] = useState({
    enabled: true,
    color: '#ff9500', // Film Orange
    fontSize: 20,
    position: 'bottom-right' as const,
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { startCamera, stopCamera, takePhoto, toggleCamera, facingMode } = useCamera()
  const [showCameraTypeSelector, setShowCameraTypeSelector] = useState(false)
  const [mirrorEnabled, setMirrorEnabled] = useState(true) // Mirror front camera by default

  // Update filter when camera type changes
  useEffect(() => {
    const cameraType = FILM_CAMERA_TYPES.find(c => c.id === selectedCameraType)
    if (cameraType) {
      setSelectedFilter(cameraType.filterId)
    }
  }, [selectedCameraType])

  useEffect(() => {
    if (videoRef.current) {
      startCamera(videoRef.current)
    }
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return

    // Trigger Flash if enabled
    if (flashEnabled) {
      setShowFlashEffect(true)
      // Small delay to let the screen go white before capturing
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsDeveloping(true)
    const imageDataUrl = takePhoto(videoRef.current, canvasRef.current, {
      mirror: facingMode === 'user' && mirrorEnabled
    })

    // Turn off flash immediately after capture frame is grabbed
    if (flashEnabled) {
      setShowFlashEffect(false)
    }

    // Simulate film developing delay
    setTimeout(() => {
      setCapturedImage(imageDataUrl)
      setIsDeveloping(false)
    }, 2000)
  }

  const handleRetake = () => {
    setCapturedImage(null)
  }
  if (capturedImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <SaveAndShare
          imageData={capturedImage}
          onRetake={handleRetake}
          layout={editorLayout}
          onLayoutChange={setEditorLayout}
          activeTool={activeTool}
          onToolChange={setActiveTool}
          dateEnabled={dateStampConfig.enabled}
          onToggleDate={() => setDateStampConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
          drawingColor={drawingColor}
          onColorChange={setDrawingColor}
        >
          <div className="w-full h-full">
            <CanvasEditor
              imageData={capturedImage}
              layout={editorLayout}
              dateStampConfig={dateStampConfig}
              activeTool={activeTool}
              drawingColor={drawingColor}
              drawingWidth={5} // default
              filterId={selectedFilter}
            />
          </div>
        </SaveAndShare>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-neutral-900 texture-leather overflow-hidden relative selection:bg-none select-none">

      {/* GLOBAL FLASH OVERLAY */}
      <div className={`fixed inset-0 z-[100] bg-white pointer-events-none transition-opacity duration-75 ${showFlashEffect ? 'opacity-100' : 'opacity-0'}`} />

      {/* --- TOP DECK (Header) --- */}
      <div className="shrink-0 h-16 pt-[var(--safe-top)] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-6 z-30 shadow-lg">
        {/* Flash Module */}
        <FlashToggle enabled={flashEnabled} onToggle={setFlashEnabled} />

        {/* Brand / Counter */}
        <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase border border-white/10 px-2 py-1 rounded">
          Film_Cam • 001
        </div>

        {/* Film Camera Type Selector */}
        <button
          onClick={() => setShowCameraTypeSelector(true)}
          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 active:bg-white/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white/60" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-[9px] font-mono text-white/80 uppercase tracking-wider">
            {FILM_CAMERA_TYPES.find(c => c.id === selectedCameraType)?.name || 'Camera'}
          </span>
        </button>
      </div>

      {/* --- LENS SYSTEM (Viewfinder) --- */}
      <div className="flex-1 relative w-full flex items-center justify-center bg-black/50 overflow-hidden">
        {/* Background blur effect for immersion */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${capturedImage || ''})`,
            backgroundSize: 'cover',
            filter: 'blur(20px)'
          }}
        />

        {isDeveloping ? (
          <FilmDevelopingAnimation />
        ) : (
          /* Viewfinder Frame - maximizing space but keeping aspect ratio */
          <div className="relative z-10 w-full max-w-sm md:max-w-md aspect-[4/5] shadow-2xl transition-all duration-300">
            {/* Physical Frame */}
            <div className="absolute inset-0 border-[16px] border-[#1a1a1a] rounded-[24px] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-20 pointer-events-none">
              {/* Inner Bezel */}
              <div className="absolute inset-[-4px] border border-white/10 rounded-[20px]" />
            </div>

            {/* Live Preview */}
            <div className="w-full h-full rounded-[10px] overflow-hidden bg-black relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform duration-500 ${facingMode === 'user' && mirrorEnabled ? '-scale-x-100' : ''}`}
                style={{
                  filter: getFilterCSSOverlay(selectedFilter),
                }}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* HUD Overlays */}
              <div className="absolute inset-0 pointer-events-none opacity-60">
                {/* ... (HUD elements) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/50 rounded-full" />
                <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/50" />
                <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/50" />
                <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/50" />
                <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/50" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- CONTROL GRIP (Footer) --- */}
      <div className="shrink-0 pb-[var(--safe-bottom)] bg-[#222] texture-metal border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30 relative">
        {/* Ergonomic Curve */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-4 bg-[#222] rounded-full blur-xl opacity-50" />

        <div className="px-6 py-6 flex flex-col gap-6">

          {/* Filter Wheel Area */}
          <div className="w-full overflow-hidden relative h-16 bg-black/20 rounded-xl inner-shadow border border-white/5 flex items-center px-2">
            {/* This will be the new Film Roll component */}
            <FilterSelector
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          {/* Primary Controls Row */}
          <div className="flex items-center justify-between px-2">
            {/* Left Controls - Secondary Toggles */}
            <div className="flex-1 flex justify-start gap-3">
              <PolaroidModeToggle
                enabled={polaroidMode}
                onToggle={setPolaroidMode}
              />
              {facingMode === 'user' && (
                <CameraMirrorToggle
                  enabled={mirrorEnabled}
                  onToggle={setMirrorEnabled}
                />
              )}
            </div>

            {/* Shutter (Center) */}
            <div className="flex-0 relative -top-2">
              <CaptureButton onCapture={handleCapture} disabled={isDeveloping} />
            </div>

            {/* Right Controls - Primary Actions (Flip) */}
            <div className="flex-1 flex justify-end">
              <CameraFlipToggle
                facingMode={facingMode}
                onToggle={toggleCamera}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Film Camera Type Selector Modal */}
      <FilmCameraTypeSelector
        selectedCameraType={selectedCameraType}
        onCameraTypeChange={setSelectedCameraType}
        isOpen={showCameraTypeSelector}
        onClose={() => setShowCameraTypeSelector(false)}
      />
    </div>
  )
}
