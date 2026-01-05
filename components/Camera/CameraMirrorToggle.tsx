'use client'

interface CameraMirrorToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function CameraMirrorToggle({ enabled, onToggle }: CameraMirrorToggleProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
      title={enabled ? 'Mirror Off' : 'Mirror On'}
    >
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
        enabled 
          ? 'border-yellow-500 bg-yellow-500/20' 
          : 'border-white/20 bg-white/5'
      }`}>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={enabled ? '#fbbf24' : 'currentColor'} 
          strokeWidth="2"
          className={enabled ? '' : 'text-white/60'}
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </div>
      <span className={`text-[9px] font-mono tracking-wider ${enabled ? 'text-yellow-500' : 'text-white/40'}`}>
        FLIP
      </span>
    </button>
  )
}

