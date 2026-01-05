'use client'

import { memo } from 'react'

interface NavigationProps {
  currentView: 'camera' | 'gallery'
  onViewChange: (view: 'camera' | 'gallery') => void
}

function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100/50 sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 md:px-premium py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight font-display">
            Film Camera
          </h1>
          
          <div className="flex gap-2">
            <button
              onClick={() => onViewChange('camera')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === 'camera'
                  ? 'bg-gray-900 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => onViewChange('gallery')}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentView === 'gallery'
                  ? 'bg-gray-900 text-white shadow-soft'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Gallery
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default memo(Navigation)

