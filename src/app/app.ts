import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Today } from "./today/today";
import {TaskMenu} from './task-menu/task-menu';

@Component({
  selector: 'app-root',
  imports: [Today, TaskMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tick-tick-clone');
}
