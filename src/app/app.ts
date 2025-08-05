import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Today } from "./today/today";

@Component({
  selector: 'app-root',
  imports: [ Today],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tick-tick-clone');
}
