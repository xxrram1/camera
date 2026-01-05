import { useCallback } from 'react'

export function useHapticFeedback() {
  const triggerHaptic = useCallback(() => {
    if ('vibrate' in navigator) {
      // Light haptic feedback (10ms)
      navigator.vibrate(10)
    }
  }, [])

  return { triggerHaptic }
}

