'use client'

import { useState, useEffect } from 'react'
import { useCameraDevices } from '@/hooks/useCameraDevices'

interface CameraDeviceSelectorProps {
  selectedDeviceId: string | null
  onDeviceChange: (deviceId: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function CameraDeviceSelector({
  selectedDeviceId,
  onDeviceChange,
  isOpen,
  onClose,
}: CameraDeviceSelectorProps) {
  const { devices } = useCameraDevices()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/20 max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-mono text-sm tracking-wider uppercase">Select Camera</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
          {devices.length === 0 ? (
            <div className="text-white/60 text-sm text-center py-8">
              No cameras found
            </div>
          ) : (
            devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => {
                  onDeviceChange(device.deviceId)
                  onClose()
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  selectedDeviceId === device.deviceId
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500'
                    : 'bg-white/5 border-2 border-transparent text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs">{device.label}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

