import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExposureSettings } from '../../../core/exposure/exposure.model';

const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400] as const;
const APERTURE_VALUES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22] as const;
const SHUTTER_SPEED_VALUES = [
  1 / 4000,
  1 / 2000,
  1 / 1000,
  1 / 500,
  1 / 250,
  1 / 125,
  1 / 60,
  1 / 30,
  1 / 15,
  1 / 8,
  1 / 4,
  1 / 2,
  1,
] as const;

@Component({
  selector: 'app-exposure-controls',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exposure-controls.component.html',
 // styleUrl: './exposure-controls.component.scss',
})
export class ExposureControlsComponent {
  protected readonly isoIndex = signal(0);
  protected readonly apertureIndex = signal(4);
  protected readonly shutterIndex = signal(6);

  protected readonly isoValues = ISO_VALUES;
  protected readonly apertureValues = APERTURE_VALUES;
  protected readonly shutterSpeedValues = SHUTTER_SPEED_VALUES;

  readonly settingsChange = output<ExposureSettings>();

  protected onIsoChange(index: number): void {
    this.isoIndex.set(index);
    this.emitSettings();
  }

  protected onApertureChange(index: number): void {
    this.apertureIndex.set(index);
    this.emitSettings();
  }

  protected onShutterChange(index: number): void {
    this.shutterIndex.set(index);
    this.emitSettings();
  }

  private emitSettings(): void {
    this.settingsChange.emit({
      iso: this.isoValues[this.isoIndex()],
      aperture: this.apertureValues[this.apertureIndex()],
      shutterSpeed: this.shutterSpeedValues[this.shutterIndex()],
    });
  }

  protected formatShutterSpeed(speed: number): string {
    return speed >= 1 ? `${speed}s` : `1/${Math.round(1 / speed)}s`;
  }
}
