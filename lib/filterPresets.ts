export interface FilterPreset {
  id: string
  name: string
  thumbnailClass?: string
  thumbnailStyle?: React.CSSProperties
  cssFilter: string // New: Strict CSS filter for parity
  applyFilter: (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void
}

// Film Grain Generator (Original - kept for backward compatibility)
export function generateGrain(ctx: CanvasRenderingContext2D, intensity: number = 0.3) {
  generateGrainOptimized(ctx, intensity)
}

// Optimized grain generation with caching
const grainCache = new Map<string, ImageData>()

export function generateGrainOptimized(ctx: CanvasRenderingContext2D, intensity: number = 0.3) {
  const cacheKey = `${ctx.canvas.width}x${ctx.canvas.height}-${Math.floor(intensity * 100)}`
  let grainData = grainCache.get(cacheKey)

  if (!grainData) {
    grainData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height)
    const data = grainData.data

    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * intensity * 255
      data[i] = grain
      data[i + 1] = grain
      data[i + 2] = grain
      data[i + 3] = 255
    }
    grainCache.set(cacheKey, grainData)
  }

  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const imgData = imageData.data
  const grainDataArray = grainData.data

  for (let i = 0; i < imgData.length; i += 4) {
    // Soft light blend mode approximation for better grain
    // Or simple additive/subtractive
    imgData[i] = Math.max(0, Math.min(255, imgData[i] + grainDataArray[i]))
    imgData[i + 1] = Math.max(0, Math.min(255, imgData[i + 1] + grainDataArray[i + 1]))
    imgData[i + 2] = Math.max(0, Math.min(255, imgData[i + 2] + grainDataArray[i + 2]))
  }

  ctx.putImageData(imageData, 0, 0)
}

// Light Leak Effect
export function applyLightLeak(
  ctx: CanvasRenderingContext2D,
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right',
  intensity: number = 0.4
) {
  const gradient = ctx.createRadialGradient(
    position === 'top-right' || position === 'bottom-right'
      ? ctx.canvas.width * 0.8
      : ctx.canvas.width * 0.2,
    position === 'top-left' || position === 'top-right'
      ? ctx.canvas.height * 0.2
      : ctx.canvas.height * 0.8,
    0,
    position === 'top-right' || position === 'bottom-right'
      ? ctx.canvas.width * 0.8
      : ctx.canvas.width * 0.2,
    position === 'top-left' || position === 'top-right'
      ? ctx.canvas.height * 0.2
      : ctx.canvas.height * 0.8,
    ctx.canvas.width * 0.6
  )

  gradient.addColorStop(0, `rgba(255, 200, 100, ${intensity})`)
  gradient.addColorStop(0.5, `rgba(255, 150, 50, ${intensity * 0.5})`)
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

// Note: applyColorGrading is REMOVED in favor of ctx.filter for strict parity

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'none',
    name: 'Original',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
    },
    cssFilter: '',
    applyFilter: () => { },
  },
  // Warm & Soft Tones
  {
    id: 'kodak-portra',
    name: 'Portra 400',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff5e6 0%, #ffe6cc 100%)',
    },
    cssFilter: 'brightness(1.05) contrast(0.9) saturate(1.15) sepia(0.1)',
    applyFilter: (canvas, ctx) => {
      // CSS Filter does color; we just add grain
      generateGrainOptimized(ctx, 0.2)
    },
  },
  {
    id: 'kodak-gold',
    name: 'Gold 200',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #ffd700 0%, #ffcc00 100%)',
    },
    cssFilter: 'contrast(1.1) saturate(1.3) brightness(1.05) sepia(0.2) hue-rotate(-5deg)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.25)
    }
  },
  {
    id: 'soft-warm',
    name: 'Soft Warm',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%)',
    },
    cssFilter: 'brightness(1.08) contrast(0.85) saturate(1.1) sepia(0.15)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.15)
    },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff4e6 0%, #ffd89b 100%)',
    },
    cssFilter: 'brightness(1.1) contrast(0.92) saturate(1.2) sepia(0.2)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.18)
      applyLightLeak(ctx, 'top-right', 0.2)
    },
  },
  // Cool & Clean Tones
  {
    id: 'fuji-pro',
    name: 'Fuji Pro 400H',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #d3f3ee 0%, #a8e6cf 100%)' // Minty
    },
    cssFilter: 'brightness(1.05) contrast(1.0) saturate(1.1) hue-rotate(-5deg)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.15)
    }
  },
  {
    id: 'fuji-superia',
    name: 'Superia 400',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e6f3ff 0%, #cce6ff 100%)',
    },
    cssFilter: 'brightness(1.02) contrast(1.1) saturate(1.2) hue-rotate(-5deg)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.25)
    },
  },
  {
    id: 'agfa-vista',
    name: 'Agfa Vista',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #ff9999 0%, #ff4d4d 100%)' // Reddish
    },
    cssFilter: 'contrast(1.2) saturate(1.4) brightness(1.02) sepia(0.1)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.2)
    }
  },
  {
    id: 'cool-mood',
    name: 'Cool Mood',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e8f4f8 0%, #d1e9f0 100%)',
    },
    cssFilter: 'brightness(1.03) contrast(1.12) saturate(1.15) hue-rotate(-10deg)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.22)
    },
  },
  {
    id: 'arctic-blue',
    name: 'Arctic Blue',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e0f2f7 0%, #b8e0e8 100%)',
    },
    cssFilter: 'brightness(1.06) contrast(1.08) saturate(1.18) hue-rotate(-15deg)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.2)
    },
  },
  // Vibrant & Colorful
  {
    id: 'cinestill-800',
    name: 'Cinestill 800T',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #ffe6f0 0%, #ffccdf 100%)',
    },
    cssFilter: 'brightness(1.1) contrast(1.15) saturate(1.25) sepia(0.15)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.3)
      applyLightLeak(ctx, 'top-right', 0.3)
    },
  },
  {
    id: 'lomo-purple',
    name: 'Lomo Purple',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e6ccff 0%, #9933ff 100%)'
    },
    cssFilter: 'hue-rotate(60deg) contrast(1.2) saturate(1.2)', // Drastic shift
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.3)
      applyLightLeak(ctx, 'bottom-left', 0.1)
    }
  },
  {
    id: 'vibrant-pop',
    name: 'Vibrant Pop',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff0f5 0%, #ffd6e8 100%)',
    },
    cssFilter: 'brightness(1.08) contrast(1.18) saturate(1.35)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.25)
    },
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fef7f0 0%, #fee8d6 100%)',
    },
    cssFilter: 'brightness(1.12) contrast(0.8) saturate(1.25)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.2)
    },
  },
  // Vintage & Retro
  {
    id: 'vintage-70s',
    name: '70s Vintage',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b3 100%)',
    },
    cssFilter: 'brightness(1.08) contrast(0.85) saturate(1.3) sepia(0.2)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.4)
      applyLightLeak(ctx, 'top-left', 0.25)
    },
  },
  {
    id: 'retro-fade',
    name: 'Retro Fade',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d4c1 100%)',
    },
    cssFilter: 'brightness(1.1) contrast(0.8) saturate(1.2) sepia(0.15)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.35)
    },
  },
  {
    id: 'film-nostalgia',
    name: 'Film Nostalgia',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #f4e8d8 0%, #e8d5c4 100%)',
    },
    cssFilter: 'brightness(1.06) contrast(0.88) saturate(1.28) sepia(0.18)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.38)
      applyLightLeak(ctx, 'bottom-right', 0.2)
    },
  },
  // Moody & Dramatic
  {
    id: 'moody-dark',
    name: 'Moody Dark',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    },
    cssFilter: 'brightness(0.85) contrast(1.25) saturate(1.15)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.3)
    },
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    },
    cssFilter: 'brightness(0.9) contrast(1.2) saturate(1.2)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.25)
    },
  },
  {
    id: 'dramatic-bw',
    name: 'Dramatic B&W',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 100%)',
    },
    cssFilter: 'brightness(0.92) contrast(1.3) grayscale(100%)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.32)
    },
  },
  // Black & White
  {
    id: 'ilford-bw',
    name: 'Ilford HP5',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%)',
    },
    cssFilter: 'contrast(1.2) grayscale(100%)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.35)
    },
  },
  {
    id: 'classic-bw',
    name: 'Classic B&W',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #d0d0d0 0%, #b0b0b0 100%)',
    },
    cssFilter: 'contrast(1.15) grayscale(100%) brightness(1.02)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.28)
    },
  },
  // Modern & Clean
  {
    id: 'clean-modern',
    name: 'Clean Modern',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    },
    cssFilter: 'brightness(1.04) contrast(1.1) saturate(1.08)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.12)
    },
  },
  {
    id: 'soft-matte',
    name: 'Soft Matte',
    thumbnailStyle: {
      background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
    },
    cssFilter: 'brightness(1.06) contrast(0.88) saturate(1.05)',
    applyFilter: (canvas, ctx) => {
      generateGrainOptimized(ctx, 0.15)
    },
  },
]

