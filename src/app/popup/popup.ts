import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-popup',
  imports: [CommonModule, MenuModule, ButtonModule],
  templateUrl: './popup.html',
  styleUrl: './popup.scss'
})
export class Popup {
     @Output() prioritySelected = new EventEmitter<'high' | 'medium' | 'low' | 'none'>();
     @Output() categorySelected = new EventEmitter<'inbox' | 'today' | 'next7Days'>(); 
     @Output() openTags = new EventEmitter<void>();


 items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Priority',
        icon: 'pi pi-flag',
        items: [
          { label: 'High', icon: 'pi pi-flag-fill text-red-500', command: () => this.setPriority('high') },
          { label: 'Medium', icon: 'pi pi-flag-fill text-yellow-500', command: () => this.setPriority('medium') },
          { label: 'Low', icon: 'pi pi-flag-fill text-blue-500', command: () => this.setPriority('low') },
          { label: 'None', icon: 'pi pi-flag-fill text-black', command: () => this.setPriority('none') }
        ]
      },
       {
      label: 'Categories',
      icon: 'pi pi-folder',
      items: [
        { label: 'Inbox', icon: 'pi pi-inbox', command: () => this.setCategory('inbox') },
        { label: 'Today', icon: 'pi pi-calendar', command: () => this.setCategory('today') }
      ]
    },
    {
  label: 'Tags',
  icon: 'pi pi-tags',
  items: [
    {
      label: 'Add Tags',
      command: () => this.openTags.emit()
    }
  ]
}
    ];
  }
  setPriority(priority: 'high' | 'medium' | 'low' | 'none') {
    this.prioritySelected.emit(priority);
  }
  setCategory(category: 'inbox' | 'today' | 'next7Days') {
  this.categorySelected.emit(category);
}
}
