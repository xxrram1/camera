'use client'

import { Suspense, lazy } from 'react'

// Lazy load heavy components for better performance
const CameraView = lazy(() => import('@/components/Camera/CameraView'))

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      }>
        <CameraView />
      </Suspense>
    </main>
  )
}

