import { AfterViewInit, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { ExposureResult, ExposureSettings } from '../../../core/exposure/exposure.model';
import { applyBrightnessAdjustment } from '../rendering/canvas-renderer';
import { applyGrain } from '../rendering/grain.effect';
import { applyDepthOfField } from '../rendering/depth-of-field.effect';

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

    applyDepthOfField(ctx, this.image, settings.aperture); // 1. dessine l'image avec flou
    applyBrightnessAdjustment(ctx, this.image, result.evDelta); // 2. ajuste la luminosité déjà présente
    applyGrain(ctx, settings.iso); // 3. ajoute le grain par-dessus
  }
}
