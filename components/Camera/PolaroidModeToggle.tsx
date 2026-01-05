'use client'

interface PolaroidModeToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function PolaroidModeToggle({ enabled, onToggle }: PolaroidModeToggleProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => onToggle(!enabled)}
        className="relative w-12 h-6 rounded-full bg-black border border-white/20 shadow-inner overflow-hidden transition-all"
      >
        {/* Switch Track */}
        <div className={`absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 ${enabled ? 'opacity-100' : 'opacity-100'}`} />

        {/* Moving Thumb */}
        <div
          className={`
                    absolute top-0.5 bottom-0.5 w-5 rounded-full shadow-lg border border-white/10 transition-all duration-300
                    bg-gradient-to-b from-gray-200 to-gray-400
                    ${enabled ? 'left-[calc(100%-1.375rem)] bg-yellow-500 border-yellow-300' : 'left-0.5'}
                `}
        >
          {/* Grip texture */}
          <div className="absolute inset-0 flex items-center justify-center gap-[1px] opacity-30">
            <div className="w-[1px] h-3 bg-black" />
            <div className="w-[1px] h-3 bg-black" />
            <div className="w-[1px] h-3 bg-black" />
          </div>
        </div>
      </button>
      <span className={`text-[9px] font-mono tracking-wider ${enabled ? 'text-yellow-500' : 'text-neutral-500'}`}>
        {enabled ? 'INSTANT' : 'STD'}
      </span>
    </div>
  )
}

