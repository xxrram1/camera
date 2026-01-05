'use client'

import { useState } from 'react'

interface GrainControlProps {
  grainIntensity: number
  onGrainChange: (intensity: number) => void
}

export default function GrainControl({ grainIntensity, onGrainChange }: GrainControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Film Grain</label>
        <span className="text-xs text-gray-500">{Math.round(grainIntensity * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={grainIntensity}
        onChange={(e) => onGrainChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
      />
    </div>
  )
}

