import { calculateBaseEv, applyIsoCompensation, calculateExposure } from './exposure-calculator';

describe('exposure-calculator', () => {
  describe('calculateBaseEv', () => {
    it('calcule un EV cohérent pour f/16 et 1/100s (référence Sunny 16)', () => {
      const ev = calculateBaseEv(16, 1 / 100);
      expect(ev).toBeCloseTo(Math.log2((16 * 16) / (1 / 100)), 5);
    });
  });

  describe('applyIsoCompensation', () => {
    it('ne change rien à ISO 100 (référence)', () => {
      expect(applyIsoCompensation(10, 100)).toBeCloseTo(10, 5);
    });

    it("réduit l'EV effectif de 1 stop quand ISO double (100 -> 200)", () => {
      expect(applyIsoCompensation(10, 200)).toBeCloseTo(9, 5);
    });
  });

  describe('calculateExposure', () => {
    it('retourne "correct" pour des réglages Sunny 16 à ISO 100', () => {
      const result = calculateExposure({ iso: 100, aperture: 16, shutterSpeed: 1 / 100 });
      expect(result.status).toBe('correct');
    });

    it('retourne "overexposed" quand la vitesse est trop lente', () => {
      const result = calculateExposure({ iso: 100, aperture: 16, shutterSpeed: 1 / 4 });
      expect(result.status).toBe('overexposed');
    });

    it('retourne "underexposed" quand la vitesse est trop rapide', () => {
      const result = calculateExposure({ iso: 100, aperture: 16, shutterSpeed: 1 / 4000 });
      expect(result.status).toBe('underexposed');
    });
  });
});
