'use client'

import React, { useMemo, memo, useState } from 'react'
import { FILTER_PRESETS } from '@/lib/filterPresets'

interface FilterSelectorProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

// Group filters by category
const FILTER_CATEGORIES = [
  { name: 'All', filters: FILTER_PRESETS },
  { name: 'Warm', filters: FILTER_PRESETS.filter(f => ['kodak-portra', 'kodak-gold', 'soft-warm', 'golden-hour', 'vintage-70s', 'retro-fade', 'film-nostalgia'].includes(f.id)) },
  { name: 'Cool', filters: FILTER_PRESETS.filter(f => ['fuji-superia', 'fuji-pro', 'cool-mood', 'arctic-blue'].includes(f.id)) },
  { name: 'Vibrant', filters: FILTER_PRESETS.filter(f => ['cinestill-800', 'agfa-vista', 'lomo-purple', 'vibrant-pop', 'pastel-dream'].includes(f.id)) },
  { name: 'Vintage', filters: FILTER_PRESETS.filter(f => ['vintage-70s', 'retro-fade', 'film-nostalgia'].includes(f.id)) },
  { name: 'Moody', filters: FILTER_PRESETS.filter(f => ['moody-dark', 'cinematic', 'dramatic-bw'].includes(f.id)) },
  { name: 'B&W', filters: FILTER_PRESETS.filter(f => ['ilford-bw', 'classic-bw', 'dramatic-bw'].includes(f.id)) },
  { name: 'Modern', filters: FILTER_PRESETS.filter(f => ['clean-modern', 'soft-matte'].includes(f.id)) },
]

const FilterThumbnail = memo(({ filter, isSelected, onClick }: {
  filter: typeof FILTER_PRESETS[0],
  isSelected: boolean,
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex-shrink-0 flex flex-col items-center gap-2 transition-all duration-200 ${isSelected ? 'scale-105' : 'hover:scale-102'
        }`}
    >
      <div
        className={`relative w-16 h-16 rounded-2xl overflow-hidden shadow-soft transition-all duration-200 ${isSelected
          ? 'ring-3 ring-gray-900 shadow-premium scale-105'
          : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-soft-lg'
          }`}
      >
        <div
          className="w-full h-full"
          style={filter.thumbnailStyle}
        />
        {isSelected && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
        )}
      </div>
      <span
        className={`text-[10px] font-medium transition-colors duration-200 ${isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
          }`}
      >
        {filter.name}
      </span>
    </button>
  )
})

FilterThumbnail.displayName = 'FilterThumbnail'

export default function FilterSelector({ selectedFilter, onFilterChange }: FilterSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPresets = useMemo(() => {
    if (selectedCategory === 'All') return FILTER_PRESETS
    return FILTER_CATEGORIES.find(cat => cat.name === selectedCategory)?.filters || FILTER_PRESETS
  }, [selectedCategory])

  return (
    <div className="w-full h-full flex items-center overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory px-4">
      {FILTER_CATEGORIES[0].filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
                group shrink-0 relative w-12 h-12 mx-1 snap-center flex flex-col items-center justify-center transition-all duration-300
                ${selectedFilter === filter.id ? 'opacity-100 scale-110' : 'opacity-40 scale-90'}
            `}
        >
          {/* Film Perforation effect top/bottom */}
          <div className={`w-10 h-10 rounded-lg overflow-hidden border-2 ${selectedFilter === filter.id ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'border-white/20'}`}>
            <div className="w-full h-full" style={filter.thumbnailStyle} />
          </div>

          {/* Label only visible when selected */}
          {selectedFilter === filter.id && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap text-yellow-500 tracking-wider bg-black/80 px-1 rounded">
              {filter.name}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
