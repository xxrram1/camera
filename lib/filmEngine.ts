import { FILTER_PRESETS, generateGrainOptimized } from './filterPresets';

// Types
export interface FilmProcessingOptions {
    intensity: number;       // 0-1, overall strength
    grainAmount: number;     // 0-1
    dustAmount: number;      // 0-1
    vignetteAmount: number;  // 0-1
    lightLeak: boolean;
    dateStamp?: {
        enabled: boolean;
        date: Date;
        color: string;
        format: 'classic' | 'digital';
    };
}

// Helper to apply filter preset
function applyFilterPreset(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, filterId: string) {
    if (filterId === 'none') return;

    const filter = FILTER_PRESETS.find(f => f.id === filterId);
    if (filter && filter.applyFilter) {
        filter.applyFilter(canvas, ctx);
    }
}

export class FilmEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Could not get canvas context');
        this.ctx = context;
    }

    /**
     * Main processing pipeline
     */
    public async processImage(
        imageDataUrl: string,
        filterId: string,
        options: Partial<FilmProcessingOptions>
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Resize canvas to match image (Upgrade to 4K max)
                const maxSize = 3840;
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    const ratio = Math.min(maxSize / width, maxSize / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                this.canvas.width = width;
                this.canvas.height = height;

                // 1. Draw original
                this.ctx.drawImage(img, 0, 0, width, height);

                // [MODULE 3] Smart Sharpening (Pre-process)
                this.applySharpening();

                // 2. Apply Filter Preset (Color Grading)
                const preset = FILTER_PRESETS.find(f => f.id === filterId);
                this.ctx.save();
                if (preset && preset.cssFilter) {
                    this.ctx.filter = preset.cssFilter;
                    this.ctx.drawImage(this.canvas, 0, 0); // Apply filter to existing content
                }
                this.ctx.restore();

                // [MODULE 2] Halation Engine (Post-Filter Bloom)
                if (filterId !== 'none') {
                    this.applyHalation();
                }

                // 3. Apply Grain & Overlays (Texture)
                applyFilterPreset(this.canvas, this.ctx, filterId);

                // 4. Additional Grain
                if ((options.grainAmount ?? 0) > 0) {
                    this.applyGrain(options.grainAmount!);
                }

                // 5. Apply Light Leaks
                if (options.lightLeak) {
                    this.applyLightLeak();
                }

                // 6. Apply Vignette
                if ((options.vignetteAmount ?? 0) > 0) {
                    this.applyVignette(options.vignetteAmount!);
                }

                // 7. Dust & Scratches
                if ((options.dustAmount ?? 0) > 0 && (filterId.includes('vintage') || filterId.includes('retro'))) {
                    this.applyDust(options.dustAmount!);
                }

                // 8. Date Stamp
                if (options.dateStamp?.enabled) {
                    this.applyDateStamp(options.dateStamp);
                }

                resolve(this.canvas.toDataURL('image/jpeg', 0.95));
            };
            img.onerror = reject;
            img.src = imageDataUrl;
        });
    }

    private applySharpening() {
        // Simple 3x3 Sharpen Kernel
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Get pixel data
        const imageData = this.ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const buff = new Uint8ClampedArray(data); // Copy for reading

        // Kernel:
        //  0 -1  0
        // -1  5 -1
        //  0 -1  0
        // Strength factor (mix with original)
        const mix = 0.2; // 20% sharpening strength

        for (let y = 1; y < h - 1; y++) {
            for (let x = 1; x < w - 1; x++) {
                const i = (y * w + x) * 4;

                // Neighbor indices
                const up = i - w * 4;
                const down = i + w * 4;
                const left = i - 4;
                const right = i + 4;

                // Apply kernel for RGB
                for (let c = 0; c < 3; c++) {
                    const val = (
                        buff[i + c] * 5 +
                        buff[up + c] * -1 +
                        buff[down + c] * -1 +
                        buff[left + c] * -1 +
                        buff[right + c] * -1
                    );

                    // Blend sharpened value with original
                    data[i + c] = data[i + c] * (1 - mix) + val * mix;
                }
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    private applyHalation() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Create a temporary canvas for the glow map
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tCtx = tempCanvas.getContext('2d');
        if (!tCtx) return;

        // 1. Draw current image to temp
        tCtx.drawImage(this.canvas, 0, 0);

        // 2. Threshold: Keep only bright areas
        // Using composite operations to isolate highlights
        tCtx.globalCompositeOperation = 'destination-in';
        // (Simplified thresholding via contrast)
        tCtx.filter = 'contrast(200%) brightness(80%) grayscale(100%)';
        tCtx.drawImage(tempCanvas, 0, 0);
        tCtx.filter = 'none';

        // 3. Blur the highlights to create glow
        // We do this on the main canvas to save performance or Draw back
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.filter = 'blur(8px) saturate(200%)'; // Red Halation usually implies saturation
        this.ctx.globalAlpha = 0.4; // Strength of halation

        // Tint it Red/Orange for authentic Reprocity Failure/Halation
        // We can't easily tint with just drawImage, so we assume the warm filters handle the color,
        // or we draw a red overlay on the temp canvas first. 
        // For now, Screen mode with high saturation gives a nice bloom.

        this.ctx.drawImage(tempCanvas, 0, 0);
        this.ctx.restore();
    }

    private applyGrain(amount: number) {
        generateGrainOptimized(this.ctx, amount);
    }

    private applyVignette(amount: number) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const gradient = this.ctx.createRadialGradient(w / 2, h / 2, h / 3, w / 2, h / 2, h * 0.8);

        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${amount})`);

        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.restore();
    }

    private applyLightLeak() {
        if (Math.random() > 0.7) return;

        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';

        const isLeft = Math.random() > 0.5;
        const x = isLeft ? 0 : w;
        const width = w * (0.2 + Math.random() * 0.3);

        const gradient = this.ctx.createLinearGradient(
            isLeft ? 0 : w,
            0,
            isLeft ? width : w - width,
            0
        );

        gradient.addColorStop(0, 'rgba(255, 60, 20, 0.5)'); // Redder leak
        gradient.addColorStop(0.5, 'rgba(255, 180, 50, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(isLeft ? 0 : w - width, 0, width, h);
        this.ctx.restore();
    }

    private applyDust(amount: number) {
        const count = Math.floor((this.canvas.width * this.canvas.height) / 50000 * amount);

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';

        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 2 + 0.5;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < count / 5; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const len = Math.random() * 50;

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + (Math.random() - 0.5) * 5, y + len);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    private applyDateStamp(options: NonNullable<FilmProcessingOptions['dateStamp']>) {
        const { date, color } = options;
        const text = this.formatDate(date);

        const fontSize = this.canvas.height * 0.04;
        const margin = this.canvas.height * 0.05;

        this.ctx.save();
        this.ctx.font = `bold ${fontSize}px 'Courier New', 'Global Mono', monospace`;
        this.ctx.fillStyle = color;
        this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
        this.ctx.shadowBlur = 2;

        if (options.format === 'digital') {
            this.ctx.shadowColor = 'rgba(255, 100, 0, 0.8)';
            this.ctx.shadowBlur = 10;
        }

        const x = this.canvas.width - margin - this.ctx.measureText(text).width;
        const y = this.canvas.height - margin;

        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    private formatDate(date: Date): string {
        const y = date.getFullYear().toString().slice(-2);
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        return `'${y} ${m} ${d}`;
    }
}
