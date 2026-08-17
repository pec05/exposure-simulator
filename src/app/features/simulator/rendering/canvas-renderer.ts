/**
 * Ajuste la luminosité d'une image dessinée sur canvas selon un delta d'EV.
 * Un EV positif = image plus lumineuse, négatif = plus sombre.
 */

export function applyBrightnessAdjustment(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  evDelta: number
): void {
  const canvas = ctx.canvas;

  // Reset et redessine l'image de base à chaque appel
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  // Chaque stop d'EV double/divise la luminosité perçue.
  // On convertit ça en un facteur multiplicatif exploitable en pixels.
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
