# Film Camera App - Code Examples

## ตัวอย่างการใช้งาน Filter System

### 1. Filter Presets (`lib/filterPresets.ts`)

ไฟล์นี้กำหนด Film Presets ต่างๆ เช่น Kodak Portra, Fuji Superia, Cinestill 800T

```typescript
// ตัวอย่าง: การใช้ Filter Preset
import { FILTER_PRESETS } from '@/lib/filterPresets'

const selectedFilter = FILTER_PRESETS.find(f => f.id === 'kodak-portra')

if (selectedFilter && canvas) {
  selectedFilter.applyFilter(canvas, ctx)
}
```

### 2. Film Grain Generator

ฟังก์ชัน `generateGrain()` สร้างเม็ดฟิล์มแบบ Random:

```typescript
import { generateGrain } from '@/lib/filterPresets'

// ใช้ Grain intensity 0.3 (30%)
generateGrain(ctx, 0.3)
```

### 3. Light Leak Effect

ฟังก์ชัน `applyLightLeak()` เพิ่มเอฟเฟกต์แสงรั่ว:

```typescript
import { applyLightLeak } from '@/lib/filterPresets'

// เพิ่ม Light Leak ที่มุมบนขวา
applyLightLeak(ctx, 'top-right', 0.4)
```

### 4. Color Grading

ฟังก์ชัน `applyColorGrading()` ปรับสีภาพ:

```typescript
import { applyColorGrading } from '@/lib/filterPresets'

applyColorGrading(ctx, {
  brightness: 0.05,    // เพิ่มความสว่าง 5%
  contrast: -0.1,      // ลดคอนทราสต์ 10%
  saturation: 0.15,    // เพิ่มความอิ่มตัว 15%
  warmth: 0.2,         // เพิ่มโทนอบอุ่น
  shadows: 0.1,        // เพิ่มความสว่างในเงา
  highlights: 0.15,    // เพิ่มความสว่างในส่วนสว่าง
})
```

## ตัวอย่างการใช้งาน Canvas Editor

### 1. Canvas Editor Component

```typescript
import CanvasEditor, { CanvasEditorRef } from '@/components/Editor/CanvasEditor'
import { useRef } from 'react'

function MyComponent() {
  const canvasRef = useRef<CanvasEditorRef>(null)

  const handleAddText = () => {
    canvasRef.current?.addText('Hello World', {
      fontSize: 40,
      color: '#000000'
    })
  }

  return (
    <CanvasEditor
      ref={canvasRef}
      imageData={imageDataUrl}
      layout="1:1"
      dateStampConfig={{
        enabled: true,
        color: '#000000',
        fontSize: 14,
        position: 'bottom-right'
      }}
    />
  )
}
```

### 2. Drawing Tool

```typescript
// เปิดโหมดวาด
canvasRef.current?.enableDrawing()

// เปลี่ยนสีปากกา
canvasRef.current?.setDrawingColor('#FF0000')

// เปลี่ยนขนาดปากกา
canvasRef.current?.setDrawingWidth(10)

// ปิดโหมดวาด
canvasRef.current?.disableDrawing()
```

### 3. Text Tool

```typescript
// เพิ่มข้อความ
canvasRef.current?.addText('My Text', {
  fontSize: 50,
  color: '#FF5733'
})
```

### 4. Date Stamp

```typescript
canvasRef.current?.updateDateStamp({
  enabled: true,
  color: '#000000',
  fontSize: 16,
  position: 'bottom-right' // หรือ 'top-left', 'top-right', 'bottom-left'
})
```

### 5. Export Canvas

```typescript
// Export เป็น PNG
const pngDataUrl = canvasRef.current?.exportToDataURL('png')

// Export เป็น JPEG
const jpegDataUrl = canvasRef.current?.exportToDataURL('jpeg')
```

## ตัวอย่างการใช้งาน Camera Hook

```typescript
import { useCamera } from '@/hooks/useCamera'

function CameraComponent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { startCamera, stopCamera, takePhoto } = useCamera()

  useEffect(() => {
    startCamera(videoRef)
    return () => stopCamera()
  }, [])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const photoDataUrl = takePhoto(videoRef.current, canvasRef.current)
      console.log('Photo captured:', photoDataUrl)
    }
  }
}
```

## ตัวอย่างการใช้งาน Haptic Feedback

```typescript
import { useHapticFeedback } from '@/hooks/useHapticFeedback'

function Button() {
  const { triggerHaptic } = useHapticFeedback()

  const handleClick = () => {
    triggerHaptic() // สั่นเบาๆ 10ms
    // ทำสิ่งอื่นๆ
  }
}
```

## ตัวอย่างการใช้งาน Camera Sound

```typescript
import { useCameraSound } from '@/hooks/useCameraSound'

function CaptureButton() {
  const { playShutterSound } = useCameraSound()

  const handleCapture = () => {
    playShutterSound() // เล่นเสียงชัตเตอร์
    // ถ่ายภาพ
  }
}
```

## ตัวอย่างการ Apply Filter กับ Image

```typescript
import { FILTER_PRESETS, generateGrain, applyColorGrading } from '@/lib/filterPresets'

function applyFilterToImage(imageDataUrl: string, filterId: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!

      // วาดภาพลง canvas
      ctx.drawImage(img, 0, 0)

      // Apply filter
      const filter = FILTER_PRESETS.find(f => f.id === filterId)
      if (filter) {
        filter.applyFilter(canvas, ctx)
      }

      // Export เป็น data URL
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.src = imageDataUrl
  })
}

// ใช้งาน
const filteredImage = await applyFilterToImage(originalImage, 'kodak-portra')
```

## ตัวอย่าง Custom Filter

```typescript
import { generateGrain, applyColorGrading } from '@/lib/filterPresets'

// สร้าง Custom Filter
const customFilter: FilterPreset = {
  id: 'my-custom-filter',
  name: 'My Custom',
  applyFilter: (canvas, ctx) => {
    // 1. Color Grading
    applyColorGrading(ctx, {
      brightness: 0.1,
      contrast: 0.2,
      saturation: 0.3,
      warmth: 0.4,
    })

    // 2. Film Grain
    generateGrain(ctx, 0.25)

    // 3. Custom effects
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // เพิ่ม Vignette effect
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % canvas.width
      const y = Math.floor((i / 4) / canvas.width)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const distance = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      )
      const maxDistance = Math.sqrt(
        Math.pow(centerX, 2) + Math.pow(centerY, 2)
      )
      const vignette = 1 - (distance / maxDistance) * 0.5

      data[i] *= vignette     // R
      data[i + 1] *= vignette // G
      data[i + 2] *= vignette // B
    }

    ctx.putImageData(imageData, 0, 0)
  },
}
```

## ตัวอย่าง Polaroid Frame

```typescript
import { drawPolaroidFrame } from '@/lib/polaroidUtils'

function drawPolaroidPhoto(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  const { imageX, imageY, frameWidth, frameHeight } = drawPolaroidFrame(
    ctx,
    frameWidth,
    frameHeight,
    image.width,
    image.height
  )

  // วาดภาพ
  ctx.drawImage(image, imageX, imageY, image.width, image.height)

  // วาดขอบล่าง (พื้นที่สำหรับลายเซ็น)
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, imageY + image.height, frameWidth, 80)
}
```

## สรุป

- **Filter System**: ใช้ฟังก์ชันจาก `lib/filterPresets.ts` เพื่อสร้าง Film Effects
- **Canvas Editor**: ใช้ `FabricCanvas` class สำหรับจัดการ Canvas operations
- **Camera**: ใช้ `useCamera` hook สำหรับเข้าถึงกล้องผ่าน WebRTC
- **Premium Features**: Haptic, Sound, และ Animations พร้อมใช้งาน

