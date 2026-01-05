# Component Structure Overview

## โครงสร้างโปรเจกต์ Film Camera App

```
camera/
├── app/
│   ├── edit/
│   │   └── page.tsx              # หน้า Edit สำหรับ Post-processing
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (Camera + Gallery)
│
├── components/
│   ├── Camera/
│   │   ├── CameraView.tsx        # หน้าหลักของ Camera
│   │   ├── CaptureButton.tsx     # ปุ่มถ่ายภาพ (พร้อม Haptic + Sound)
│   │   ├── FilmDevelopingAnimation.tsx  # อนิเมชันรอฟิล์มล้าง
│   │   └── PolaroidModeToggle.tsx       # Toggle Polaroid Mode
│   │
│   ├── Editor/
│   │   ├── CanvasEditor.tsx      # Component หลักของ Canvas Editor
│   │   ├── FabricCanvas.ts       # Canvas Class สำหรับจัดการ Drawing/Text
│   │   ├── EditControls.tsx      # Controls สำหรับ Text/Draw tools
│   │   ├── LayoutSelector.tsx    # เลือก Layout (1:1, 4:5, Grid)
│   │   ├── DateStampCustomizer.tsx     # ปรับแต่ง Date Stamp
│   │   ├── ExifDataDisplay.tsx   # แสดงข้อมูล EXIF จำลอง
│   │   └── SaveAndShare.tsx      # บันทึกและแชร์ภาพ
│   │
│   ├── Filters/
│   │   ├── FilterSelector.tsx    # เลือก Film Preset
│   │   └── GrainControl.tsx      # ควบคุม Grain Intensity
│   │
│   ├── Gallery/
│   │   └── GalleryVault.tsx      # อัลบั้มภาพส่วนตัว
│   │
│   └── UI/
│       └── Navigation.tsx        # Navigation bar
│
├── hooks/
│   ├── useCamera.ts              # Hook สำหรับ Camera (WebRTC)
│   ├── useHapticFeedback.ts      # Hook สำหรับ Haptic Feedback
│   └── useCameraSound.ts         # Hook สำหรับ Shutter Sound
│
├── lib/
│   ├── filterPresets.ts          # Film Filter Presets + Functions
│   └── polaroidUtils.ts          # Utility functions สำหรับ Polaroid
│
└── [config files]
```

## Component Flow

### 1. Camera Flow
```
CameraView
  ├── useCamera (startCamera)
  ├── FilterSelector (เลือก Filter)
  ├── PolaroidModeToggle
  └── CaptureButton
      ├── useHapticFeedback
      ├── useCameraSound
      └── takePhoto → navigate to /edit
```

### 2. Edit Flow
```
EditPage
  ├── CanvasEditor
  │   └── FabricCanvas (จัดการ Canvas operations)
  ├── EditControls (Text/Draw tools)
  ├── LayoutSelector
  ├── DateStampCustomizer
  ├── ExifDataDisplay
  └── SaveAndShare
```

### 3. Gallery Flow
```
GalleryVault
  └── Display images from localStorage
```

## Key Components Details

### CameraView
- **Purpose**: หน้าหลักสำหรับถ่ายภาพ
- **Features**: 
  - Camera preview (WebRTC)
  - Filter selection (preview)
  - Polaroid mode toggle
  - Capture button with haptic + sound
  - Film developing animation

### CanvasEditor
- **Purpose**: Canvas editor สำหรับ Post-processing
- **Features**:
  - Image display
  - Text overlay
  - Drawing tool
  - Date stamp
  - Layout support (1:1, 4:5, Grid)

### FilterSelector
- **Purpose**: เลือก Film Preset
- **Presets**:
  - Original (none)
  - Kodak Portra 400
  - Fuji Superia 400
  - Cinestill 800T
  - Ilford HP5 (B&W)
  - 70s Vintage

### FabricCanvas Class
- **Methods**:
  - `addText()` - เพิ่มข้อความ
  - `enableDrawing()` / `disableDrawing()` - เปิด/ปิดโหมดวาด
  - `setDrawingColor()` / `setDrawingWidth()` - ตั้งค่าการวาด
  - `updateDateStamp()` - อัปเดต Date Stamp
  - `exportToDataURL()` - Export เป็น Data URL

## Data Flow

### Image Capture → Edit
1. User captures photo
2. `takePhoto()` returns data URL
3. Navigate to `/edit?image={dataUrl}&filter={filterId}&polaroid={bool}`
4. EditPage loads image and applies settings

### Filter Application
- Filters are applied using Canvas 2D API
- `filterPresets.ts` contains all filter logic
- Each filter has `applyFilter(canvas, ctx)` method

### Canvas Operations
- All canvas operations go through `FabricCanvas` class
- Uses native HTML5 Canvas API (no external dependencies)
- Supports: Text, Drawing, Date Stamp, Export

## Styling (Tailwind CSS)

### Colors
- `bg-off-white` (#FAFAFA) - พื้นหลังหลัก
- `bg-soft-gray` (#F5F5F5) - พื้นหลังรอง

### Shadows
- `shadow-soft` - เงาเบา
- `shadow-soft-lg` - เงาเบาขนาดใหญ่
- `shadow-premium` - เงาพรีเมียม

### Spacing
- `p-premium` (32px)
- `p-premium-lg` (48px)
- `space-y-premium` (32px)

### Border Radius
- `rounded-premium` (24px)

## Premium Features Implementation

### 1. Haptic Feedback
- ใช้ `navigator.vibrate(10)` สำหรับการสั่นเบา
- Trigger เมื่อกด Capture button

### 2. Film Developing Animation
- CSS animation สำหรับเอฟเฟกต์รอฟิล์มล้าง
- ใช้ `FilmDevelopingAnimation` component

### 3. Shutter Sound
- ใช้ Web Audio API (`AudioContext`)
- สร้างเสียงชัตเตอร์แบบ Mechanical

### 4. Film Grain Control
- Slider สำหรับปรับ Grain intensity (0-100%)
- Real-time preview

### 5. Date Stamp Customization
- ปรับสี, ขนาดฟอนต์, ตำแหน่ง
- ใช้ Courier New font (สไตล์กล้องคอมแพค)

### 6. EXIF Data Display
- แสดงข้อมูลจำลอง: ISO, Shutter Speed, Aperture, Focal Length
- Random values สำหรับแต่ละภาพ

### 7. Gallery Vault
- เก็บภาพใน localStorage
- Grid layout แบบ Lookbook

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas API
- **Camera**: WebRTC API (getUserMedia)
- **Storage**: localStorage (Gallery)
- **Image Export**: Canvas.toDataURL() + html2canvas

## Browser Requirements

- Modern browser with WebRTC support
- Camera permissions
- Canvas API support
- Mobile-friendly (iOS/Android)

