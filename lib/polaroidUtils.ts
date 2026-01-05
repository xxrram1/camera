export function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  imageWidth: number,
  imageHeight: number
) {
  // Polaroid frame dimensions (white border)
  const borderWidth = 40
  const bottomBorder = 80 // Extra space at bottom for "signature area"
  
  const frameWidth = imageWidth + borderWidth * 2
  const frameHeight = imageHeight + borderWidth + bottomBorder

  // Draw white background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, frameWidth, frameHeight)

  // Draw image area with slight shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2

  // Image position (centered with border)
  return {
    imageX: borderWidth,
    imageY: borderWidth,
    frameWidth,
    frameHeight,
  }
}

