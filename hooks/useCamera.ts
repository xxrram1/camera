import { useState, useCallback, useRef } from 'react'
import { getCameraStream, stopCameraStream, capturePhoto } from '@/lib/camera'

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const startCamera = useCallback(async (videoElement: HTMLVideoElement, selectedDeviceId?: string | null) => {
    try {
      if (stream) {
        stopCameraStream(stream)
      }

      videoRef.current = videoElement

      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId
          ? {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
          : {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
      }

      const newStream = await getCameraStream(constraints)
      setStream(newStream)
      videoElement.srcObject = newStream
      setError(null)

      if (selectedDeviceId) {
        setDeviceId(selectedDeviceId)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start camera'))
      console.error(err)
    }
  }, [facingMode, stream])

  const stopCamera = useCallback(() => {
    if (stream) {
      stopCameraStream(stream)
      setStream(null)
    }
  }, [stream])

  const switchCamera = useCallback(async (newDeviceId: string) => {
    setDeviceId(newDeviceId)
    if (videoRef.current) {
      if (stream) stopCameraStream(stream)

      try {
        const newStream = await getCameraStream({
          video: {
            deviceId: { exact: newDeviceId },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })
        setStream(newStream)
        videoRef.current.srcObject = newStream
      } catch (err) {
        console.error("Failed to switch camera", err)
      }
    }
  }, [stream])

  const toggleCamera = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(newMode)

    if (videoRef.current) {
      if (stream) stopCameraStream(stream)

      try {
        const newStream = await getCameraStream({
          video: {
            facingMode: newMode,
            width: { ideal: 3840 },
            height: { ideal: 2160 }
          }
        })
        setStream(newStream)
        videoRef.current.srcObject = newStream
      } catch (err) {
        console.error("Failed to switch camera", err)
      }
    }
  }, [facingMode, stream])

  const takePhoto = useCallback((video: HTMLVideoElement, canvas: HTMLCanvasElement, options?: { mirror?: boolean }) => {
    return capturePhoto(video, canvas, options)
  }, [])

  return {
    stream,
    error,
    startCamera,
    stopCamera,
    takePhoto,
    toggleCamera,
    switchCamera,
    facingMode,
    deviceId
  }
}

