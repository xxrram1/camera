export async function getCameraStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser')
    }
    return await navigator.mediaDevices.getUserMedia(constraints)
}

export function stopCameraStream(stream: MediaStream) {
    stream.getTracks().forEach(track => track.stop())
}

export function capturePhoto(
    video: HTMLVideoElement, 
    canvas: HTMLCanvasElement, 
    options?: { mirror?: boolean }
): string {
    if (!video || !canvas) return ''

    const context = canvas.getContext('2d')
    if (!context) return ''

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // If mirror is enabled, flip the image horizontally
    if (options?.mirror) {
        context.save()
        context.translate(canvas.width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        context.restore()
    } else {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    return canvas.toDataURL('image/jpeg', 0.95)
}
