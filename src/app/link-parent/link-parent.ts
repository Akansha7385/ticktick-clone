import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-link-parent',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ListboxModule, FormsModule],
  templateUrl: './link-parent.html',
  styleUrl: './link-parent.css'
})
export class LinkParentComponent {
 visible: boolean = false;
  searchText: string = '';
  selectedItem: any;

  items: any[] = [
    { label: 'ewfea', value: 'ewfea' },
    { label: 'hb', value: 'hb' },
    { label: 'No Title', value: 'No Title' },
    { label: 'sf', value: 'sf' },
    { label: 'ok', value: 'ok' },
    { label: 'dddf', value: 'dddf' },
    { label: 'hgfh', value: 'hgfh' },
    { label: 'reay', value: 'reay' },
    { label: 'mmmmmoree', value: 'mmmmmoree' }
  ];

  get filteredItems() {
    return this.items.filter(i =>
      i.label.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  openDialog() {
    this.visible = true;
  }
}
