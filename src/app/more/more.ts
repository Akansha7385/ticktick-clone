import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';   // <-- Router import
import { DialogModule } from 'primeng/dialog';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [DialogModule, TieredMenuModule],
  templateUrl: './more.html'
})
export class MoreComponent {
  constructor(private router: Router) {} 

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  items: MenuItem[] = [
    { 
      label: 'Home', 
      icon: 'pi pi-home', 
      command: () => { 
        this.router.navigate(['/home']);   
        this.closeDialog();         
      }  
    },
    { 
      label: 'Shortcuts', 
      icon: 'pi pi-key', 
      command: () => { 
        this.router.navigate(['/shortcut']); 
        this.closeDialog();         
      } 
    },
    { label: 'Help Center', icon: 'pi pi-question-circle', command: () => this.closeDialog() },
    { label: 'Feedback', icon: 'pi pi-comment', command: () => this.closeDialog() },
    { label: 'View Changelog', icon: 'pi pi-list', command: () => this.closeDialog() }
  ];

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
