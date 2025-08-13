import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false); 
  }
  
}
