# Film Camera App 📷

Premium film camera web application built with Next.js, React, and Tailwind CSS.

## Features

### Core Features
- **Camera System**: WebRTC API integration for real-time camera access
- **Film Filters**: Multiple film simulation presets (Kodak Portra, Fuji Superia, Cinestill, Ilford B&W, etc.)
- **Polaroid Mode**: White frame border around photos
- **Canvas Editor**: 
  - Text overlay tool
  - Drawing/signature tool
  - Layout selection (1:1, 4:5, Grid)
  - Date stamp customization
- **Save & Share**: Download images and share to social media

### Premium Features
- **Haptic Feedback**: Vibration feedback on shutter button
- **Film Developing Animation**: Smooth developing effect after capture
- **Mechanical Shutter Sound**: Authentic camera shutter sound
- **Grain Control**: Real-time film grain adjustment
- **Date Stamp Customization**: Customizable color, font size, and position
- **Gallery Vault**: Personal photo collection gallery
- **EXIF Data Display**: Simulated camera metadata (ISO, Shutter Speed, Aperture, etc.)

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
camera/
├── app/
│   ├── edit/           # Edit page for post-processing
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── Camera/         # Camera-related components
│   ├── Editor/         # Canvas editor components
│   ├── Filters/        # Filter system components
│   ├── Gallery/        # Gallery components
│   └── UI/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── public/             # Static assets
```

## Key Components

### Filter System
The filter system (`lib/filterPresets.ts`) includes:
- Film grain generation
- Light leak effects
- Color grading (brightness, contrast, saturation, warmth)
- Multiple film stock presets

### Canvas Editor
The canvas editor uses Fabric.js for:
- Text overlay with editing capabilities
- Freehand drawing
- Layout management
- Date stamp rendering

## Technologies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Fabric.js**: Canvas manipulation
- **html2canvas**: Image export
- **date-fns**: Date formatting

## Browser Support

- Modern browsers with WebRTC support
- Camera access permissions required
- Mobile devices supported (iOS/Android)

## License

MIT

