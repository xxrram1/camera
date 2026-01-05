'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface GalleryImage {
  id: string
  dataUrl: string
  date: Date
  filter?: string
}

export default function GalleryVault() {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    // Load images from localStorage
    const savedImages = localStorage.getItem('filmCameraGallery')
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    }
  }, [])

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-premium">
        <div className="text-center">
          <div className="text-6xl mb-4">📷</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Gallery is Empty</h2>
          <p className="text-gray-600">Start capturing moments to build your collection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-off-white p-premium">
      <div className="container mx-auto">
        <div className="mb-premium">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gallery Vault</h1>
          <p className="text-gray-600">{images.length} photos</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-xl overflow-hidden shadow-soft hover:shadow-premium transition-shadow cursor-pointer bg-white"
            >
              <img
                src={image.dataUrl}
                alt={`Photo ${image.id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs font-medium">
                  {format(new Date(image.date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

