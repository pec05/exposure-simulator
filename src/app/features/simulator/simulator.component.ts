import { ExposureSettings } from '../../core/exposure/exposure.model';
import { ExposureControlsComponent } from './controls/exposure-controls.component';
import { Component, computed, signal } from '@angular/core';
import { calculateExposure } from '../../core/exposure/exposure-calculator';
import { DecimalPipe } from '@angular/common';
import { ExposurePreviewComponent } from './preview/exposure-preview.component';

const DEFAULT_SETTING: ExposureSettings = {
  iso: 100,
  aperture: 5.6,
  shutterSpeed: 1 / 60,
};

@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [ExposureControlsComponent, DecimalPipe, ExposurePreviewComponent],
  templateUrl: './simulator.component.html',
 // styleUrl: './simulator.component.scss',
})
export class SimulatorComponent {
  protected readonly settings = signal<ExposureSettings>(DEFAULT_SETTING);

  protected readonly exposureResult = computed(() => calculateExposure(this.settings()));

  protected onSettingsChange(newSettings: ExposureSettings): void {
    this.settings.set(newSettings);
  }
}
