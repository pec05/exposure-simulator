import { AfterViewInit, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import { ExposureResult } from '../../../core/exposure/exposure.model';
import { applyBrightnessAdjustment } from '../rendering/canvas-renderer';

const SUNNY_16_EV = 15;

@Component({
  selector: 'app-exposure-preview',
  standalone: true,
  templateUrl: './exposure-preview.component.html',
  //styleUrl: './exposure-preview.component.scss',
})
export class ExposurePreviewComponent implements AfterViewInit {
  readonly exposureResult = input.required<ExposureResult>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private image?: HTMLImageElement;
  private imageLoaded = false;

  constructor() {
    effect(() => {
      const result = this.exposureResult();
      if (this.imageLoaded) {
        this.render(result.evDelta);
      }
    });
  }

  ngAfterViewInit(): void {
    this.image = new Image();
    this.image.src = 'reference-photo.jpg';

    this.image.onload = () => {
      this.imageLoaded = true;
      this.render(this.exposureResult().evDelta);
    };

    this.image.onerror = (err) => {
      console.error("Échec du chargement de l'image de référence :", err);
    };
  }

  private render(evDelta: number): void {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.image) return;

    canvas.width = this.image.width;
    canvas.height = this.image.height;

    applyBrightnessAdjustment(ctx, this.image, evDelta);
  }
}
