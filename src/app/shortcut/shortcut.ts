import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-shortcut',
  standalone: true,
  imports: [DialogModule, ButtonModule, NgFor],
  templateUrl: './shortcut.html',
  styleUrl: './shortcut.css'
})
export class Shortcut {
  @Input() visible: boolean = false;
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
}
