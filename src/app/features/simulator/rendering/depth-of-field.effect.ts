const WIDE_OPEN_APERTURE = 1.4; // ouverture la plus large prévue dans les sliders
const CLOSED_APERTURE = 22; // ouverture la plus fermée prévue dans les sliders
const MAX_BLUR_PX = 8; // flou maximal en pixels, à f/1.4

/**
 * Applique un flou gaussien uniforme dont l'intensité dépend de l'ouverture.
 * Plus l'ouverture est large (f petit), plus le flou est marqué.
 */

export function applyDepthOfField(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  aperture: number,
): void {
  const canvas = ctx.canvas;
  const blurPx = calculateBlurAmount(aperture);

  if (blurPx === 0) return;

  // On redessine l'image à travers un filtre CSS de flou natif du canvas
  ctx.save();
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function calculateBlurAmount(aperture: number): number {
  const clampedAperture = Math.min(Math.max(aperture, WIDE_OPEN_APERTURE), CLOSED_APERTURE);
  const ratio = (CLOSED_APERTURE - clampedAperture) / (CLOSED_APERTURE - WIDE_OPEN_APERTURE);
  return ratio * MAX_BLUR_PX;
}
