import { useState, useEffect, useCallback } from 'react'

export interface CameraDevice {
  deviceId: string
  label: string
  kind: MediaDeviceKind
}

export function useCameraDevices() {
  const [devices, setDevices] = useState<CameraDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  const enumerateDevices = useCallback(async () => {
    try {
      // Request permission first - use a temporary stream to get device labels
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      
      // Stop the temporary stream
      stream.getTracks().forEach(track => track.stop())
      
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = deviceList
        .filter(device => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
          kind: device.kind as MediaDeviceKind,
        }))

      setDevices(videoDevices)
      
      // Select first device if none selected
      setSelectedDeviceId(prev => {
        if (!prev && videoDevices.length > 0) {
          return videoDevices[0].deviceId
        }
        return prev
      })
    } catch (error) {
      console.error('Error enumerating devices:', error)
    }
  }, [])

  useEffect(() => {
    enumerateDevices()
    
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', enumerateDevices)
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', enumerateDevices)
    }
  }, [enumerateDevices])

  return {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    refreshDevices: enumerateDevices,
  }
}

