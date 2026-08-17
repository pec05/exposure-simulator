import { AfterViewInit, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { ExposureResult, ExposureSettings } from '../../../core/exposure/exposure.model';
import {
  applyBrightnessAdjustmentInPlace,
} from '../rendering/canvas-renderer';
import { applyGrain } from '../rendering/grain.effect';
import { applyDepthOfFieldInPlace } from '../rendering/depth-of-field.effect';
import { applyMotionBlur } from '../rendering/motion-blur.effect';

const SUNNY_16_EV = 15;

@Component({
  selector: 'app-exposure-preview',
  standalone: true,
  templateUrl: './exposure-preview.component.html',
  //styleUrl: './exposure-preview.component.scss',
})
export class ExposurePreviewComponent implements AfterViewInit {
  readonly exposureResult = input.required<ExposureResult>();
  readonly settings = input.required<ExposureSettings>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private image?: HTMLImageElement;
  private imageLoaded = false;

  constructor() {
    effect(() => {
      const result = this.exposureResult();
      const settings = this.settings();
      if (this.imageLoaded) {
        this.render(result, settings);
      }
    });
  }

  ngAfterViewInit(): void {
    this.image = new Image();
    this.image.src = 'reference-photo.jpg';

    this.image.onload = () => {
      this.imageLoaded = true;
      this.render(this.exposureResult(), this.settings());
    };

    this.image.onerror = (err) => {
      console.error("Échec du chargement de l'image de référence :", err);
    };
  }

  private render(result: ExposureResult, settings: ExposureSettings): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.image) return;

    canvas.width = this.image.width;
    canvas.height = this.image.height;

    applyMotionBlur(ctx, this.image, settings.shutterSpeed); // 1. dessine l'image avec bougé
    applyDepthOfFieldInPlace(ctx, settings.aperture); // 2. floute ce qui est déjà sur le canvas
    applyBrightnessAdjustmentInPlace(ctx, result.evDelta); // 3. ajuste la luminosité
    applyGrain(ctx, settings.iso); // 4. ajoute le grain par-dessus
  }
}
