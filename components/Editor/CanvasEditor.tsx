'use client'

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { FabricCanvas } from './FabricCanvas'
import { FilmEngine } from '@/lib/filmEngine'
import { LayoutType, LAYOUT_CONFIGS } from '@/lib/layoutTypes'

interface CanvasEditorProps {
  imageData: string
  layout: LayoutType
  dateStampConfig: {
    enabled: boolean
    color: string
    fontSize: number
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  }
  activeTool?: 'text' | 'draw' | null
  drawingColor?: string
  drawingWidth?: number
  filterId?: string
}

export interface CanvasEditorRef {
  addText: (text: string, options?: { fontSize?: number; color?: string; fontFamily?: string }) => void
  enableDrawing: () => void
  disableDrawing: () => void
  setDrawingColor: (color: string) => void
  setDrawingWidth: (width: number) => void
}

const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ imageData, layout, dateStampConfig, activeTool, drawingColor, drawingWidth, filterId = 'none' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const filmEngineRef = useRef<FilmEngine | null>(null)
    const canvasInstanceRef = useRef<FabricCanvas | null>(null)
    const [processedImage, setProcessedImage] = useState<string | null>(null)
    const prevActiveToolRef = useRef(activeTool)

    // State for preserving drawings during re-processing
    const savedStateRef = useRef<{ textElements: any[], drawingPaths: any[] } | null>(null)

    // Stage 1: Film Engine Processing (with Re-processing for Date Stamp)
    // ... (useEffect for processing remains same, just need to ensure dateStampConfig dependency)
    useEffect(() => {
      let isMounted = true;

      // Save state before re-processing if canvas exists
      if (canvasInstanceRef.current) {
        savedStateRef.current = canvasInstanceRef.current.getObjects()
      }

      const process = async () => {
        if (!imageData) return;

        // Use an offscreen canvas for the heavy lifting
        const offscreenCanvas = document.createElement('canvas');
        const engine = new FilmEngine(offscreenCanvas);

        const options = {
          intensity: 1.0,
          grainAmount: 0.25,
          dustAmount: 0.15,
          vignetteAmount: 0.5,
          lightLeak: Math.random() > 0.7,
          dateStamp: dateStampConfig.enabled ? {
            enabled: true,
            date: new Date(),
            color: dateStampConfig.color,
            format: 'classic' as const
          } : undefined
        }

        if (filterId.includes('bw')) options.grainAmount = 0.5;
        if (filterId.includes('vintage')) options.dustAmount = 0.4;

        try {
          const result = await engine.processImage(imageData, filterId, options);
          if (isMounted) setProcessedImage(result);
        } catch (err) {
          console.error("Film processing failed", err);
          if (isMounted) setProcessedImage(imageData); // Fallback
        }
      };

      process();

      return () => { isMounted = false; }
    }, [imageData, filterId, dateStampConfig.enabled, dateStampConfig.color]); // Re-run when date stamp toggles


    // Stage 2: Fabric Canvas Initialization
    useEffect(() => {
      if (!canvasRef.current || !processedImage) return

      // Initialize Fabric with the PROCESSED image
      // Note: If we re-process (date stamp toggle), we might lose drawings if we fully re-init.
      // Ideally FabricCanvas class handles "updating background" without losing objects.
      // For now, simpler approach: full re-init is acceptable as "developing new print".
      // But user might want to keep drawings? 
      // User request said: "Edit after capture... remove time... draw".
      // Usually removing time means re-printing the film. So drawings on top might technically stay or go.
      // Let's assume re-init is safer for consistency with FilmEngine output.

      const fabricCanvas = new FabricCanvas(canvasRef.current, processedImage, layout)
      canvasInstanceRef.current = fabricCanvas

      // Restore state if available
      if (savedStateRef.current) {
        fabricCanvas.restoreObjects(savedStateRef.current)
      }

      const canvas = canvasRef.current
      const handleMouseDown = (e: MouseEvent) => fabricCanvas.handleMouseDown(e)
      const handleMouseMove = (e: MouseEvent) => fabricCanvas.handleMouseMove(e)
      const handleMouseUp = () => fabricCanvas.handleMouseUp()

      canvas.addEventListener('mousedown', handleMouseDown)
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('mouseup', handleMouseUp)

      return () => {
        // Save state before disposing
        savedStateRef.current = fabricCanvas.getObjects()

        canvas.removeEventListener('mousedown', handleMouseDown)
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseup', handleMouseUp)
        fabricCanvas.dispose()
      }
    }, [processedImage]) // Removed layout from dependency array

    // Effect for handling layout changes without re-init
    useEffect(() => {
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.setLayout(layout)
      }
    }, [layout])


    // --- Tool Hooks ---
    useEffect(() => {
      if (canvasInstanceRef.current) {
        // Date stamp is baked in now, but if we wanted real-time updates without re-processing:
        // canvasInstanceRef.current.updateDateStamp(dateStampConfig)
      }
    }, [dateStampConfig])

    useEffect(() => {
      if (canvasInstanceRef.current) {
        if (activeTool === 'draw') {
          canvasInstanceRef.current.enableDrawing()
        } else {
          canvasInstanceRef.current.disableDrawing()
        }

        // Add text when text tool is activated (only on change, not on every render)
        if (activeTool === 'text' && prevActiveToolRef.current !== 'text') {
          canvasInstanceRef.current.addText('Type here...', {
            fontSize: 40,
            color: drawingColor || '#ffffff',
            fontFamily: 'Courier New'
          })
        }

        prevActiveToolRef.current = activeTool
      }
    }, [activeTool, drawingColor])

    useEffect(() => {
      if (canvasInstanceRef.current && drawingColor) {
        canvasInstanceRef.current.setDrawingColor(drawingColor)
      }
    }, [drawingColor])

    useEffect(() => {
      if (canvasInstanceRef.current && drawingWidth) {
        canvasInstanceRef.current.setDrawingWidth(drawingWidth)
      }
    }, [drawingWidth])

    // --- External API ---
    useImperativeHandle(ref, () => ({
      addText: (text: string, options?: { fontSize?: number; color?: string }) => {
        canvasInstanceRef.current?.addText(text, options)
      },
      enableDrawing: () => {
        canvasInstanceRef.current?.enableDrawing()
      },
      disableDrawing: () => {
        canvasInstanceRef.current?.disableDrawing()
      },
      setDrawingColor: (color: string) => {
        canvasInstanceRef.current?.setDrawingColor(color)
      },
      setDrawingWidth: (width: number) => {
        canvasInstanceRef.current?.setDrawingWidth(width)
      },
    }))

    const getCanvasDimensions = () => {
      const config = LAYOUT_CONFIGS[layout]
      return { width: config.width, height: config.height }
    }

    const { width, height } = getCanvasDimensions()

    if (!processedImage) {
      return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="w-8 h-8 border-2 border-neutral-400 border-t-neutral-800 rounded-full animate-spin" />
          <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">Developing...</div>
        </div>
      )
    }

    return (
      <div className="bg-white p-2 shadow-2xl transition-all duration-500 origin-center animate-scale-in">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="max-w-full h-auto shadow-inner touch-none" // touch-none for drawing
        />
      </div>
    )
  }
)

CanvasEditor.displayName = 'CanvasEditor'

export default CanvasEditor

