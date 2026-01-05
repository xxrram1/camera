'use client'

interface FlashToggleProps {
    enabled: boolean
    onToggle: (enabled: boolean) => void
}

export default function FlashToggle({ enabled, onToggle }: FlashToggleProps) {
    return (
        <button
            onClick={() => onToggle(!enabled)}
            className={`
        w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300
        ${enabled
                    ? 'bg-yellow-500/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }
      `}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={enabled ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-colors ${enabled ? 'text-yellow-500' : 'text-white/60'}`}
            >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
        </button>
    )
}
