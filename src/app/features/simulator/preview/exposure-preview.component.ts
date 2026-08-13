import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { ExposureResult } from '../../../core/exposure/exposure.model';

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

  ngAfterViewInit(): void {
    this.image = new Image();
    this.image.src = 'reference-photo.jpg';
    this.image.onload = () => this.draw();

    this.image.onerror = (err) => {
      console.error("Échec du chargement de l'image de référence :", err);
    };
  }

  private draw() {
    const canvas = this.canvasRef().nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !this.image) return;

    canvas.width = this.image.width;
    canvas.height = this.image.height;
    ctx.drawImage(this.image, 0, 0);
  }
}
