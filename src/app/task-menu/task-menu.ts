import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TieredMenu } from 'primeng/tieredmenu';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, TieredMenu],
  templateUrl: './task-menu.html',
  styleUrl: './task-menu.css'
})
export class TaskMenu {
  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: 'Date',
        items: [
          { label: 'Today', icon: 'pi pi-sun' },
          { label: 'Tomorrow', icon: 'pi pi-moon' },
          { label: 'Pick a Date', icon: 'pi pi-calendar' }
        ]
      },
      {
        label: 'Priority',
        items: [
          { label: 'High', icon: 'pi pi-flag-fill text-red-500' },
          { label: 'Medium', icon: 'pi pi-flag-fill text-yellow-500' },
          { label: 'Low', icon: 'pi pi-flag-fill text-blue-500' }
        ]
      },
      { separator: true },
      { label: 'Add Subtask', icon: 'pi pi-plus' },
      { label: 'Link Parent Task', icon: 'pi pi-link' },
      { label: 'Pin', icon: 'pi pi-thumbtack' },
      { label: "Won't Do", icon: 'pi pi-times' },
      {
        label: 'Move to',
        items: [
          { label: 'Inbox' },
          { label: 'Today' }
        ]
      },
      { label: 'Tags', icon: 'pi pi-tags' },
      { label: 'Duplicate', icon: 'pi pi-copy' },
      { label: 'Copy Link', icon: 'pi pi-link' },
      { label: 'Convert to Note', icon: 'pi pi-file' },
      { label: 'Delete', icon: 'pi pi-trash text-red-500' }
    ];
  }
}
