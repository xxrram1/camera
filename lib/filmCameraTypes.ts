export interface FilmCameraType {
  id: string
  name: string
  brand: string
  description: string
  filterId: string
  thumbnailStyle?: React.CSSProperties
}

export const FILM_CAMERA_TYPES: FilmCameraType[] = [
  {
    id: 'kodak-portra',
    name: 'Portra 400',
    brand: 'Kodak',
    description: 'Natural skin tones, warm highlights',
    filterId: 'kodak-portra',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%)',
    },
  },
  {
    id: 'fuji-superia',
    name: 'Superia 400',
    brand: 'Fujifilm',
    description: 'Vibrant colors, cool tones',
    filterId: 'fuji-superia',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e6f3ff 0%, #cce6ff 100%)',
    },
  },
  {
    id: 'cinestill-800',
    name: 'Cinestill 800T',
    brand: 'Cinestill',
    description: 'Cinematic tungsten, warm glow',
    filterId: 'cinestill-800',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #ffe6f0 0%, #ffccdf 100%)',
    },
  },
  {
    id: 'ilford-bw',
    name: 'Ilford HP5',
    brand: 'Ilford',
    description: 'Classic black & white, high contrast',
    filterId: 'ilford-bw',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
    },
  },
  {
    id: 'polaroid-600',
    name: 'Polaroid 600',
    brand: 'Polaroid',
    description: 'Instant film, soft pastels',
    filterId: 'soft-warm',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%)',
    },
  },
  {
    id: 'contax-t2',
    name: 'Contax T2',
    brand: 'Contax',
    description: 'Premium compact, clean modern',
    filterId: 'clean-modern',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    },
  },
  {
    id: 'leica-m6',
    name: 'Leica M6',
    brand: 'Leica',
    description: 'Legendary rangefinder, classic',
    filterId: 'classic-bw',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #d0d0d0 0%, #b0b0b0 100%)',
    },
  },
  {
    id: 'canon-ae1',
    name: 'Canon AE-1',
    brand: 'Canon',
    description: '70s vintage, warm tones',
    filterId: 'vintage-70s',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b3 100%)',
    },
  },
  {
    id: 'minolta-x700',
    name: 'Minolta X-700',
    brand: 'Minolta',
    description: '80s classic, retro fade',
    filterId: 'retro-fade',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4c1 100%)',
    },
  },
  {
    id: 'nikon-f3',
    name: 'Nikon F3',
    brand: 'Nikon',
    description: 'Professional, cinematic',
    filterId: 'cinematic',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    },
  },
]

