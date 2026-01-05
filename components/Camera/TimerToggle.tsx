'use client'

interface TimerToggleProps {
    duration: number // 0, 3, 10
    onToggle: () => void
}

export default function TimerToggle({ duration, onToggle }: TimerToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={`
        w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300
        ${duration > 0
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }
      `}
        >
            <span className="font-mono text-xs font-bold">
                {duration > 0 ? `${duration}s` : 'OFF'}
            </span>
        </button>
    )
}
