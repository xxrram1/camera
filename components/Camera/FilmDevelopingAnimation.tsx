'use client'

export default function FilmDevelopingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-black rounded-premium">
      <div className="relative w-64 h-64">
        {/* Film strip animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-32 bg-white/10 rounded-lg animate-pulse" />
        </div>
        
        {/* Developing text */}
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <p className="text-white/80 text-lg font-medium animate-pulse">
            Developing...
          </p>
          <div className="mt-4 w-32 h-1 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-white animate-[shimmer_2s_ease-in-out_infinite]" 
              style={{
                width: '100%',
                background: 'linear-gradient(90deg, transparent, white, transparent)',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

