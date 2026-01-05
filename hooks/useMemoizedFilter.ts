import { useMemo } from 'react'
import { FILTER_PRESETS } from '@/lib/filterPresets'

export function useMemoizedFilter(filterId: string) {
  return useMemo(() => {
    return FILTER_PRESETS.find(f => f.id === filterId) || FILTER_PRESETS[0]
  }, [filterId])
}

