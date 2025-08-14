import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
}
