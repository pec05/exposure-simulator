import { Component, signal } from '@angular/core';
import { SimulatorComponent } from './features/simulator/simulator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SimulatorComponent],
  template: `<app-simulator/> `,
  //templateUrl: './app.html',
  //styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('exposure-simulator');
}
