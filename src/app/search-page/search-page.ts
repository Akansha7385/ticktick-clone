import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [DialogModule, FormsModule], // ✅ FIXED
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  closeDialog() {
    this.visibleChange.emit(false);
  }
}
