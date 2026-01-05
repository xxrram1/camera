'use client'

import { FILM_CAMERA_TYPES, FilmCameraType } from '@/lib/filmCameraTypes'

interface FilmCameraTypeSelectorProps {
  selectedCameraType: string
  onCameraTypeChange: (cameraTypeId: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function FilmCameraTypeSelector({
  selectedCameraType,
  onCameraTypeChange,
  isOpen,
  onClose,
}: FilmCameraTypeSelectorProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/20 max-w-2xl w-full p-6 shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-mono text-sm tracking-wider uppercase">Select Film Camera</h3>
            <p className="text-white/50 text-xs mt-1 font-mono">Choose your camera type</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-y-auto scrollbar-hide flex-1 pr-2">
          {FILM_CAMERA_TYPES.map((camera) => (
            <button
              key={camera.id}
              onClick={() => {
                onCameraTypeChange(camera.id)
                onClose()
              }}
              className={`relative group text-left p-4 rounded-xl border-2 transition-all ${
                selectedCameraType === camera.id
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Film Strip Perforations */}
              <div className="absolute top-2 left-2 right-2 h-1 flex justify-around items-center opacity-30">
                {[...Array(6)].map((_, i) => (
                  <div key={`top-perf-${i}`} className="w-0.5 h-0.5 bg-white rounded-full" />
                ))}
              </div>

              {/* Camera Thumbnail */}
              <div 
                className="w-full h-20 rounded-lg mb-3 border border-white/10"
                style={camera.thumbnailStyle}
              />

              {/* Camera Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider">
                    {camera.brand}
                  </span>
                  {selectedCameraType === camera.id && (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  )}
                </div>
                <h4 className="text-white font-mono text-sm font-bold">
                  {camera.name}
                </h4>
                <p className="text-white/50 text-[10px] font-mono leading-tight">
                  {camera.description}
                </p>
              </div>

              {/* Selected Indicator */}
              {selectedCameraType === camera.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

