import { ExposureResult, ExposureSettings, ExposureStatus } from './exposure.model';

const REFERENCE_ISO = 100;
const CORRECT_EXPOSURE_TOLERANCE = 0.5 // en EV
const SUNNY_16_EV = 15; // EV standard, journée ensoleillée, ISO 100

/**
 *  Calcule l'exposure Value (EV) à ISO 100 pour une ouverture et une vitesse données.
 *  Formule standard photographique : EV = log2(N² / t)
 */
export function calculateBaseEv(aperture: number, shutterSpeed: number): number {
  return Math.log2((aperture * aperture) / shutterSpeed);
}

/**
 * Compense l'EV de base selon l'ISO réel.
 * Chaque doublement d'ISO par rapport à la référence (100) ajoute 1 stop
 * de sensibilité, donc réduit l'EV effectif nécessaire de 1.
 */
export function applyIsoCompensation(baseEv: number, iso: number): number {
  const isoStops = Math.log2(iso / REFERENCE_ISO );
  return baseEv - isoStops;
}

/**
 * Détermine si l'exposition résultante est correcte, sous- ou surexposée
 * par rapport à l'EV cible standard (0, convention "sunny 16" simplifiée).
 */
function determineStatus(effectiveEv: number, targetEv: number): ExposureStatus {
  const diff = effectiveEv - targetEv;
  if (Math.abs(diff) <= CORRECT_EXPOSURE_TOLERANCE) return 'correct';
  // effectiveEv < targetEv => réglages calibrés pour une scène plus sombre => trop de lumière captée
  return diff > 0 ? 'underexposed' : 'overexposed';
}

export function calculateExposure(
  settings: ExposureSettings,
  targetEv: number = SUNNY_16_EV,
): ExposureResult {
  const baseEv = calculateBaseEv(settings.aperture, settings.shutterSpeed);
  const effectiveEv = applyIsoCompensation(baseEv, settings.iso);

  return {
    ev : effectiveEv,
    status: determineStatus(effectiveEv, targetEv),
  };
}
