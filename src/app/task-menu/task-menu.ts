import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';

@Component({
  selector: 'app-task-menu',
  standalone: true,
  imports: [CommonModule, ContextMenuModule],
  templateUrl: './task-menu.html',
  styleUrls: ['./task-menu.css'],
})
export class TaskMenu {
  @ViewChild('cm') cm!: ContextMenu;
  @Output() deleteTask = new EventEmitter<void>();
  @Output() setPriority = new EventEmitter<
    'high' | 'medium' | 'low' | 'none'
  >();
  @Output() addSubtask = new EventEmitter<void>();
  @Output() copyLink = new EventEmitter<void>();
  @Output() convertToNote = new EventEmitter<void>();
  @Output() convertToTask = new EventEmitter<void>();
  @Output() openTags = new EventEmitter<void>();
  @Output() setDueDate = new EventEmitter<string>();
  @Output() pinTask = new EventEmitter<void>();

  items: MenuItem[] = [];

  ngOnInit() {
    this.buildMenu('task');
  }

  buildMenu(type: 'task' | 'note') {
    this.items = [
      {
        label: 'Date',
        items: [
          {
            label: 'Today',
            icon: 'pi pi-sun',
            command: () => this.setDueDate.emit('Today'),
          },
          {
            label: 'Tomorrow',
            icon: 'pi pi-moon',
            command: () => this.setDueDate.emit('Tomorrow'),
          },
          { label: 'Pick a Date', icon: 'pi pi-calendar' },
        ],

      },
      {
        label: 'Priority',
        items: [
          {
            label: 'High',
            icon: 'pi pi-flag-fill text-red-500',
            command: () => this.setPriority.emit('high'),
          },
          {
            label: 'Medium',
            icon: 'pi pi-flag-fill text-yellow-500',
            command: () => this.setPriority.emit('medium'),
          },
          {
            label: 'Low',
            icon: 'pi pi-flag-fill text-blue-500',
            command: () => this.setPriority.emit('low'),
          },
          {
            label: 'None',
            icon: 'pi pi-flag-fill text-black',
            command: () => this.setPriority.emit('none'),
          },
        ],
      },
      { separator: true },
      {
        label: 'Add Subtask',
        icon: 'pi pi-plus',
        command: () => this.addSubtask.emit(),
      },
      {
        label: 'Pin / Unpin',
        icon: 'pi pi-thumbtack',
        command: () => this.pinTask.emit(),
      },

      {
        label: "Won't Do",
        icon: 'pi pi-times',
        command: () => this.deleteTask.emit(),
      },
      {
        label: 'Move to',
        items: [{ label: 'Inbox' }, { label: 'Welcome' }, { label: 'Work' }],
      },
      {
        label: 'Tags',
        icon: 'pi pi-tags',
        command: () => this.openTags.emit(),
      },
      { label: 'Duplicate', icon: 'pi pi-copy' },
      {
        label: 'Copy Link',
        icon: 'pi pi-link',
        command: () => this.copyLink.emit(),
      },

      type === 'task'
        ? {
            label: 'Convert to Note',
            icon: 'pi pi-file',
            command: () => this.convertToNote.emit(),
          }
        : {
            label: 'Convert to Task',
            icon: 'pi pi-check-square',
            command: () => this.convertToTask.emit(),
          },
      {
        label: 'Delete',
        icon: 'pi pi-trash text-red-500',
        command: () => this.deleteTask.emit(),
      },
    ];
  }

  open(event: MouseEvent) {
    this.cm.show(event);
  }
}
