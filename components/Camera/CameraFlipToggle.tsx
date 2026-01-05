'use client'

interface CameraFlipToggleProps {
  facingMode: 'user' | 'environment'
  onToggle: () => void
}

export default function CameraFlipToggle({ facingMode, onToggle }: CameraFlipToggleProps) {
  const isFront = facingMode === 'user'
  
  return (
    <button
      onClick={onToggle}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
      title={isFront ? 'Switch to Back Camera' : 'Switch to Front Camera'}
    >
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
        isFront 
          ? 'border-blue-500 bg-blue-500/20' 
          : 'border-green-500 bg-green-500/20'
      }`}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={isFront ? '#3b82f6' : '#10b981'} 
          strokeWidth="2"
        >
          <path d="M12 2v20M2 12h20M8 7l4-4 4 4M16 17l-4 4-4-4" />
        </svg>
      </div>
      <span className={`text-[9px] font-mono tracking-wider ${isFront ? 'text-blue-400' : 'text-green-400'}`}>
        {isFront ? 'FRONT' : 'BACK'}
      </span>
    </button>
  )
}

