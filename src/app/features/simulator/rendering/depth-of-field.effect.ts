const WIDE_OPEN_APERTURE = 1.4; // ouverture la plus large prévue dans les sliders
const CLOSED_APERTURE = 22; // ouverture la plus fermée prévue dans les sliders
const MAX_BLUR_PX = 8; // flou maximal en pixels, à f/1.4

/**
 * Applique un flou gaussien uniforme dont l'intensité dépend de l'ouverture.
 * Plus l'ouverture est large (f petit), plus le flou est marqué.
 */

export function applyDepthOfFieldInPlace(ctx: CanvasRenderingContext2D, aperture: number): void {
  const canvas = ctx.canvas;
  const blurPx = calculateBlurAmount(aperture);

  if (blurPx === 0) return;

  // getImageData/putImageData ne supportent pas ctx.filter directement,
  // donc on redessine le canvas sur lui-même à travers le filtre actif
  const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCanvas.getContext('2d')!.putImageData(snapshot, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.filter = 'none';
}

function calculateBlurAmount(aperture: number): number {
  const clampedAperture = Math.min(Math.max(aperture, WIDE_OPEN_APERTURE), CLOSED_APERTURE);
  const ratio = (CLOSED_APERTURE - clampedAperture) / (CLOSED_APERTURE - WIDE_OPEN_APERTURE);
  return ratio * MAX_BLUR_PX;
}
