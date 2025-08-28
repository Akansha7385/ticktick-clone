import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';   // <-- Router import
import { DialogModule } from 'primeng/dialog';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Shortcut } from '../shortcut/shortcut';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [DialogModule, TieredMenuModule, CommonModule, RouterModule, Shortcut],
  templateUrl: './more.html',
  styleUrls:['./more.scss']
})
export class MoreComponent {
  constructor(private router: Router, private eRef: ElementRef) {} 

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  shortcutVisible = false;


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
            this.shortcutVisible = true;   
        this.closeDialog();         
      } 
    },
    {
  label: 'View Changelog',
  icon: 'pi pi-list',
  command: () => { 
    this.router.navigate(['/view-change-log']);   
        this.closeDialog();         
  }
},
{ label: 'Help Center', icon: 'pi pi-question-circle', command: () => { 
    this.router.navigate(['/help-center']);   
        this.closeDialog();         
  } },
{ label: 'Feedback', icon: 'pi pi-comment', command: () => this.closeDialog() },
  ];

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.visible && !this.eRef.nativeElement.contains(event.target)) {
      this.closeDialog();
    }
}
}
