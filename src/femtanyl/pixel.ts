/** Internal resolution divisor when pixel mode is on (5 ≈ 256×144 buffer, upscaled sharp). */
export const PIXEL_DOWNSCALE = 5;

export function internalBufferSize(full: number, pixel: boolean) {
  return pixel ? Math.max(1, Math.floor(full / PIXEL_DOWNSCALE)) : full;
}

export function applyCanvasDisplaySize(
  canvas: HTMLCanvasElement,
  displayW: number,
  displayH: number,
) {
  canvas.style.width = `${displayW}px`;
  canvas.style.height = `${displayH}px`;
  canvas.style.transform = "none";
}

export function configure2dSmoothing(ctx: CanvasRenderingContext2D, pixel: boolean) {
  ctx.imageSmoothingEnabled = !pixel;
  if (!pixel) return;
  ctx.imageSmoothingQuality = "low";
}
