const BASE_ISO = 100;
const MAX_NOISE_INTENSITY = 40; // amplitude max du bruit en valeur de pixel (0-255)

/**
 * Applique un bruit aléatoire sur l'image, avec une intensité croissante selon l'ISO.
 * Simule le grain numérique visible à haute sensibilité.
 */

export function applyGrain(ctx: CanvasRenderingContext2D, iso: number): void {
  const canvas = ctx.canvas;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const intensity = calculateNoiseIntensity(iso);
  if (intensity === 0) return;

  for (let i = 0; i < pixels.length; i += 4) {
    const noise = (Math.random() - 0.5) * 2 * intensity;
    pixels[i] = clamp(pixels[i] + noise);
    pixels[i + 1] = clamp(pixels[i + 1] + noise);
    pixels[i + 2] = clamp(pixels[i + 2] + noise);
  }

  ctx.putImageData(imageData, 0, 0);
}

function calculateNoiseIntensity(iso: number): number {
  if (iso <= BASE_ISO) return 0;
  const isoStops = Math.log2(iso / BASE_ISO);
  const maxStops = Math.log2(6400 / BASE_ISO); // plage ISO max prévue dans les sliders
  return (isoStops / maxStops) * MAX_NOISE_INTENSITY;
}

function clamp(value: number): number {
  return Math.min(255, Math.max(0, value));
}

