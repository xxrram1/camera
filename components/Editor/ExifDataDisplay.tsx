'use client'

import { useState, useEffect } from 'react'

interface ExifData {
  iso: number
  shutterSpeed: string
  aperture: string
  focalLength: string
  date: string
}

export default function ExifDataDisplay() {
  const [exifData, setExifData] = useState<ExifData>({
    iso: 400,
    shutterSpeed: '1/125',
    aperture: 'f/2.8',
    focalLength: '35mm',
    date: new Date().toLocaleDateString(),
  })

  // Simulate random EXIF data on mount
  useEffect(() => {
    const isos = [100, 200, 400, 800, 1600]
    const shutterSpeeds = ['1/60', '1/125', '1/250', '1/500', '1/1000']
    const apertures = ['f/1.8', 'f/2.8', 'f/4', 'f/5.6', 'f/8']
    const focalLengths = ['24mm', '35mm', '50mm', '85mm']

    setExifData({
      iso: isos[Math.floor(Math.random() * isos.length)],
      shutterSpeed: shutterSpeeds[Math.floor(Math.random() * shutterSpeeds.length)],
      aperture: apertures[Math.floor(Math.random() * apertures.length)],
      focalLength: focalLengths[Math.floor(Math.random() * focalLengths.length)],
      date: new Date().toLocaleDateString(),
    })
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Camera Info</h3>
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 font-mono text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">ISO</span>
          <span className="text-gray-900 font-semibold">{exifData.iso}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shutter</span>
          <span className="text-gray-900 font-semibold">{exifData.shutterSpeed}s</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Aperture</span>
          <span className="text-gray-900 font-semibold">{exifData.aperture}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Focal Length</span>
          <span className="text-gray-900 font-semibold">{exifData.focalLength}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-600">Date</span>
          <span className="text-gray-900 font-semibold">{exifData.date}</span>
        </div>
      </div>
    </div>
  )
}

