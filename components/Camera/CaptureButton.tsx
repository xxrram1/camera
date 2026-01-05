'use client'

import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { useCameraSound } from '@/hooks/useCameraSound'

interface CaptureButtonProps {
  onCapture: () => void
  disabled?: boolean
}

export default function CaptureButton({ onCapture, disabled }: CaptureButtonProps) {
  const { triggerHaptic } = useHapticFeedback()
  const { playShutterSound } = useCameraSound()

  const handleClick = () => {
    if (disabled) return

    triggerHaptic()
    playShutterSound()
    onCapture()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        group relative w-24 h-24 rounded-full transition-transform active:scale-95 disabled:cursor-not-allowed
        ${disabled ? 'opacity-50 grayscale' : ''}
      `}
    >
      {/* Outer Metal Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 via-gray-400 to-gray-500 shadow-lg" />

      {/* Inner Ring Detail */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-gray-500 via-gray-300 to-gray-100" />

      {/* The Button Itself */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-inner flex items-center justify-center overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-80" />
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-black/20 to-transparent blur-sm" />
      </div>
    </button>
  )
}

