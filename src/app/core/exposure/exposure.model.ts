export interface ExposureSettings {
  iso : number;
  aperture : number;
  shutterSpeed : number;
}

export type ExposureStatus = 'underexposed' | 'correct' | 'overexposed';

export interface ExposureResult {
  ev: number;
  status: ExposureStatus;
}
