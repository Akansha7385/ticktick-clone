import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Today } from "./today/today";
import { Home } from "./home/home";
import { Shortcut } from "./shortcut/shortcut";

@Component({
  selector: 'app-root',
  imports: [Today, Home, Shortcut],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tick-tick-clone');
}
