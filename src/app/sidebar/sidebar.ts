import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [ RouterLink, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() visible: boolean = false; 
  // visible = false;
  @Output()onSideBarToggle = new EventEmitter<void>();

  toggleDrawer() {
    this.visible = !this.visible;
    this.onSideBarToggle.emit();
  }
}
