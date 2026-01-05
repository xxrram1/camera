// Optimized filter preview system using CSS filters for real-time preview
// This provides instant preview without processing the full canvas

import { FILTER_PRESETS } from './filterPresets'

export function getFilterCSSOverlay(filterId: string): string {
  const preset = FILTER_PRESETS.find(f => f.id === filterId)
  return preset?.cssFilter || ''
}

