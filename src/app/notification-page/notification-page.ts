import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-notification-page',
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule, CommonModule],
  templateUrl: './notification-page.html',
  styleUrl: './notification-page.css'
})
export class NotificationPage {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>(); 

  activeTab: 'notifications' | 'activities' = 'notifications';

  constructor(private eRef: ElementRef) {}

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  // 👇 bahar click detect karega
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (this.visible && !this.eRef.nativeElement.contains(event.target)) {
      this.closeDialog();
    }
  }
}
