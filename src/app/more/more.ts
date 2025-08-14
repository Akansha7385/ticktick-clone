import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() visible: boolean = false; //  Needed for [(visible)] binding
  @Output() visibleChange = new EventEmitter<boolean>(); //  Needed for two-way binding
  @Output() shortcutClick = new EventEmitter<void>();
  @Output() homeClick = new EventEmitter<void>();

  items: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', command: () =>  { 
        this.homeClick.emit();  
        this.closeDialog();         
      }  },
    { 
      label: 'Shortcuts', 
      icon: 'pi pi-key', 
      command: () => { 
        this.shortcutClick.emit();  
        this.closeDialog();         
      } 
    },
    { label: 'Help Center', icon: 'pi pi-question-circle', command: () => this.closeDialog() },
    { label: 'Feedback', icon: 'pi pi-comment', command: () => this.closeDialog() },
    { label: 'View Changelog', icon: 'pi pi-list', command: () => this.closeDialog() }
  ];

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false); // ✅ Tell parent to update state
  }
}
