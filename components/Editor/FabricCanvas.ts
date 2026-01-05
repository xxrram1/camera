import { format } from 'date-fns'

export interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  color: string
  fontFamily: string
}

export interface DrawingPath {
  points: Array<{ x: number; y: number }>
  color: string
  width: number
}

export class FabricCanvas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private image: HTMLImageElement | null = null
  private imageDataUrl: string
  private textElements: TextElement[] = []
  private drawingPaths: DrawingPath[] = []
  private isDrawing: boolean = false
  private currentPath: DrawingPath | null = null
  private drawingColor: string = '#000000'
  private drawingWidth: number = 5
  private dateStampConfig: {
    enabled: boolean
    color: string
    fontSize: number
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  } | null = null
  private layout: string = '4:5'

  // State Persistence
  getObjects() {
    return {
      textElements: [...this.textElements],
      drawingPaths: [...this.drawingPaths]
    }
  }

  restoreObjects(state: { textElements: TextElement[], drawingPaths: DrawingPath[] }) {
    this.textElements = state.textElements
    this.drawingPaths = state.drawingPaths
    this.render()
  }

  // Touch Handling
  private handleTouchStart = (e: TouchEvent) => {
    if (!this.isDrawing) return
    e.preventDefault()
    const touch = e.touches[0]
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    const x = (touch.clientX - rect.left) * scaleX
    const y = (touch.clientY - rect.top) * scaleY
    this.currentPath = {
      points: [{ x, y }],
      color: this.drawingColor,
      width: this.drawingWidth * scaleX,
    }
  }

  private handleTouchMove = (e: TouchEvent) => {
    if (!this.isDrawing || !this.currentPath) return
    e.preventDefault()
    const touch = e.touches[0]
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    this.currentPath.points.push({
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    })
    this.render()
  }

  private handleTouchEnd = (e: TouchEvent) => {
    if (!this.isDrawing) return
    e.preventDefault()
    this.handleMouseUp()
  }

  constructor(canvasElement: HTMLCanvasElement, imageData: string, layout: string = '4:5') {
    this.canvas = canvasElement
    this.layout = layout
    const ctx = canvasElement.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get 2d context')
    }
    this.ctx = ctx
    this.imageDataUrl = imageData

    // Add touch listeners
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false })

    this.loadImage()
  }

  public setLayout(layout: string) {
    this.layout = layout
    this.render()
  }

  private async loadImage() {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.image = img
        this.render()
        resolve()
      }
      img.src = this.imageDataUrl
    })
  }

  private render() {
    if (!this.image) return

    const { width, height } = this.canvas

    // Clear canvas
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, width, height)

    // Layout Logic
    let drawX = 0
    let drawY = 0
    let drawW = width
    let drawH = height

    if (this.layout === 'polaroid') {
      // Define margins for Polaroid
      // Standard Polaroid is roughly: Top/Sides ~5-8%, Bottom ~20-25%
      const marginSide = width * 0.05 // Adjusted to 5%
      const marginTop = height * 0.05
      const marginBottom = height * 0.22

      drawX = marginSide
      drawY = marginTop
      drawW = width - (marginSide * 2)
      drawH = height - marginTop - marginBottom
    } else {
      // Universal Border: Apply a uniform ~4% border for all other prints
      // This mimics the visual frame the user expects
      const border = Math.min(width, height) * 0.04

      drawX = border
      drawY = border
      drawW = width - (border * 2)
      drawH = height - (border * 2)
    }

    // Calculate image scale to fill content area (Cover)
    // We target drawW/drawH instead of fill width/height
    const scale = Math.max(drawW / this.image.width, drawH / this.image.height)
    const imgScaledW = this.image.width * scale
    const imgScaledH = this.image.height * scale

    // Center the image within the draw area
    const imgOffX = drawX + (drawW - imgScaledW) / 2
    const imgOffY = drawY + (drawH - imgScaledH) / 2

    // Save context for clipping
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.rect(drawX, drawY, drawW, drawH)
    this.ctx.clip()

    // Draw image
    this.ctx.drawImage(this.image, imgOffX, imgOffY, imgScaledW, imgScaledH)

    this.ctx.restore()

    // Draw paths
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.drawingPaths.forEach((path) => {
      this.ctx.strokeStyle = path.color
      this.ctx.lineWidth = path.width
      this.ctx.beginPath()
      if (path.points.length > 0) {
        this.ctx.moveTo(path.points[0].x, path.points[0].y)
        for (let i = 1; i < path.points.length; i++) {
          this.ctx.lineTo(path.points[i].x, path.points[i].y)
        }
      }
      this.ctx.stroke()
    })

    // Draw text elements
    this.textElements.forEach((textEl) => {
      this.ctx.font = `${textEl.fontSize}px ${textEl.fontFamily}`
      this.ctx.fillStyle = textEl.color
      this.ctx.fillText(textEl.text, textEl.x, textEl.y)
    })

    // Draw date stamp
    if (this.dateStampConfig?.enabled) {
      this.drawDateStamp(this.dateStampConfig)
    }
  }

  private drawDateStamp(config: {
    enabled: boolean
    color: string
    fontSize: number
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  }) {
    const dateString = format(new Date(), 'MM/dd/yyyy')
    const padding = 20
    const { width, height } = this.canvas

    this.ctx.font = `${config.fontSize}px Courier New`
    this.ctx.fillStyle = config.color
    this.ctx.textAlign = config.position.includes('right') ? 'right' : 'left'
    this.ctx.textBaseline = config.position.includes('bottom') ? 'bottom' : 'top'

    const x = config.position.includes('right') ? width - padding : padding
    const y = config.position.includes('bottom') ? height - padding : padding

    this.ctx.fillText(dateString, x, y)
  }

  // Text Tool
  addText(text: string, options?: { fontSize?: number; color?: string; fontFamily?: string }) {
    const textEl: TextElement = {
      id: Date.now().toString(),
      text,
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      fontSize: options?.fontSize || 40,
      color: options?.color || '#000000',
      fontFamily: options?.fontFamily || 'Arial',
    }
    this.textElements.push(textEl)
    this.render()
  }

  // Drawing Tool
  enableDrawing() {
    this.isDrawing = true
    this.canvas.style.cursor = 'crosshair'
  }

  disableDrawing() {
    this.isDrawing = false
    if (this.currentPath) {
      this.drawingPaths.push(this.currentPath)
      this.currentPath = null
    }
    this.canvas.style.cursor = 'default'
  }

  setDrawingColor(color: string) {
    this.drawingColor = color
  }

  setDrawingWidth(width: number) {
    this.drawingWidth = width
  }

  handleMouseDown(e: MouseEvent) {
    if (!this.isDrawing) return
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    this.currentPath = {
      points: [{ x, y }],
      color: this.drawingColor,
      width: this.drawingWidth * scaleX, // Scale width too
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.isDrawing || !this.currentPath) return
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    this.currentPath.points.push({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    })
    this.render()
  }

  handleMouseUp() {
    if (this.currentPath) {
      this.drawingPaths.push(this.currentPath)
      this.currentPath = null
      this.render()
    }
  }

  // Date Stamp
  updateDateStamp(config: {
    enabled: boolean
    color: string
    fontSize: number
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  }) {
    this.dateStampConfig = config
    this.render()
  }

  // Export
  exportToDataURL(format: 'png' | 'jpeg' = 'png'): string {
    return this.canvas.toDataURL(`image/${format}`, 0.95)
  }

  // Clear
  clearCanvas() {
    this.textElements = []
    this.drawingPaths = []
    this.render()
  }

  dispose() {
    // Cleanup if needed
  }
}
