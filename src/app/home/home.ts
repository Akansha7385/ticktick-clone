import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
   @Input() visible: boolean = false; 
  @Output() visibleChange = new EventEmitter<boolean>();
}
