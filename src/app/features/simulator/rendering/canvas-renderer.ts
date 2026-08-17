/**
 * Ajuste la luminosité des pixels déjà présents sur le canvas (ne redessine pas l'image)
 */

export function applyBrightnessAdjustment(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  evDelta: number
): void {
  const canvas = ctx.canvas;
  const brightnessFactor = Math.pow(2, evDelta);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = clamp(pixels[i] * brightnessFactor);       // R
    pixels[i + 1] = clamp(pixels[i + 1] * brightnessFactor); // G
    pixels[i + 2] = clamp(pixels[i + 2] * brightnessFactor); // B
    // pixels[i + 3] = alpha, inchangé
  }

  ctx.putImageData(imageData, 0, 0);
}

function clamp(value: number): number {
  return Math.min(255, Math.max(0, value));
}
