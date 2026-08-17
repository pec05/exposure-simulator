const SHARP_SHUTTER_SPEED = 1 / 500; // vitesse à partir de laquelle il n'y a plus de flou perceptible
const MAX_BLUR_SHUTTER_SPEED = 1; // vitesse la plus lente prévue dans les sliders (1s)
const MAX_OFFSET_PX = 15; // décalage horizontal maximal, à la vitesse la plus lente
const GHOST_COUNT = 6; // nombre de "fantômes" dessinés pour simuler le bougé

/**
 * Simule un flou de bougé horizontal en dessinant l'image plusieurs fois
 * avec un léger décalage progressif et une opacité réduite.
 */
export function applyMotionBlur(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  shutterSpeed: number,
): void {
  const canvas = ctx.canvas;
  const maxOffset = calculateMaxOffset(shutterSpeed);

  if (maxOffset === 0) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return;
  }

  ctx.save();
  ctx.globalAlpha = 1 / GHOST_COUNT;

  for (let i = 0; i < GHOST_COUNT; i++) {
    const progress = i / (GHOST_COUNT - 1); // de 0 à 1
    const offsetX = (progress - 0.5) * maxOffset;
    ctx.drawImage(image, offsetX, 0, canvas.width, canvas.height);
  }

  ctx.restore();
}

function calculateMaxOffset(shutterSpeed: number): number {
  if (shutterSpeed <= SHARP_SHUTTER_SPEED) return 0;

  const clampedSpeed = Math.min(shutterSpeed, MAX_BLUR_SHUTTER_SPEED);
  const ratio =
    (Math.log2(clampedSpeed) - Math.log2(SHARP_SHUTTER_SPEED)) /
    (Math.log2(MAX_BLUR_SHUTTER_SPEED) - Math.log2(SHARP_SHUTTER_SPEED));

  return ratio * MAX_OFFSET_PX;
}
