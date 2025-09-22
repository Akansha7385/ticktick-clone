import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-shortcut',
  standalone: true,
  imports: [DialogModule, ButtonModule, NgFor, CommonModule],
  templateUrl: './shortcut.html',
  styleUrl: './shortcut.scss'
})
export class Shortcut {
  @Input() visible: boolean = true;
  @Output() visibleChange = new EventEmitter<boolean>();
 
  generalShortcuts = [
    { name: 'Save', key: 'Ctrl+S' },
    { name: 'Sync', key: '.' },
    { name: 'Cancel', key: 'Esc' },
    { name: 'Undo', key: 'Ctrl+Z' },
    { name: 'Redo', key: 'Ctrl+Shift+Z' },
    { name: 'Print', key: 'Ctrl+P' },
    { name: 'Open Command Menu', key: 'Ctrl+K' },
    { name: 'Shortcuts', key: '?' }
  ];
 taskShortcuts = [
    { name: 'Add Task', key: 'Tab+N/N' },
    { name: 'Add Task Below', key: 'Enter' },
    { name: 'Add Subtask', key: 'Shift+Enter' },
    { name: 'Toggle All Groups', key: 'Set shortcut' },
    { name: 'Expand/Collapse all subtasks', key: 'Tab+E' },
    { name: 'List View', key: 'V then L' },
    { name: 'Kanban View', key: 'V then K' },
    { name: 'Timeline view', key: 'V then T' }
  ];
 quickShortcuts = [
    { name: 'Set due date for the task', key: '*' },
    { name: 'Set priority for the task', key: '!' },
    { name: 'Set tag for the task', key: '#' },
    { name: 'Add/move task to certain list', key: '~/^' },
    { name: 'Assign task to certain list', key: '@' },
  ];
 editShortcuts = [
    { name: 'Complete tasks', key: 'Tab+M' },
    { name: 'Pin tasks', key: 'Tab+P' },
    { name: 'Delete tasks', key: 'Ctrl+Del' },
    { name: 'Set date', key: 'Tab+D' },
    { name: 'Clear Time', key: 'Tab+O' },
    { name: 'Set Today', key: 'Tab+1' },
    { name: 'Set Tomorrow', key: 'Tab+2' },
    { name: 'Set next week', key: 'Tab+3' },
    { name: 'Set priority', key: 'Alt+0/1/2/3' }
  ];
 navigationShortcuts = [
    { name: 'Go to Search ', key: '/' },
    { name: 'Go to Settings', key: 'G then S' },
    { name: 'Go to All', key: 'G then A' },
    { name: 'Go to Today', key: 'G then T' },
    { name: 'Go to Tomorrow', key: 'G then R' },
    { name: 'Go to Next 7 Days', key: 'G then N' },
    { name: 'Go to Assigned to me', key: 'G then M' },
    { name: 'Go to Inbox', key: 'G then I' },
    { name: 'Go to Completed', key: 'G then C' },
    { name: 'Go to Wont do ', key: 'G then W' },
    { name: 'Go to Summary', key: 'G then B' },
    { name: 'Go to Trash', key: 'G then G' },
  ];
 calendarShortcuts = [
    { name: 'Add Task', key: 'Tab+N/N' },
    { name: 'Add Task Below', key: 'Enter' },
    { name: 'Add Subtask', key: 'Shift+Enter' },
    { name: 'Toggle All Groups', key: 'Set shortcut' },
    { name: 'Expand/Collapse all subtasks', key: 'Tab+E' },
    { name: 'List View', key: 'V then L' },
    { name: 'Kanban View', key: 'V then K' },
    { name: 'Timeline view', key: 'V then T' }
  ];
}
