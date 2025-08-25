import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, AutoCompleteModule],
  templateUrl: './tags.html',
  styleUrls: ['./tags.css']
})
export class Tags {
 @Input() display: boolean = false; 
  @Output() tagsSelected = new EventEmitter<string[]>(); 

  selectedTags: string[] = [];
  allTags: string[] = ["work", "personal", "urgent", "study"];
  filteredTags: string[] = [];

  showDialog() {
    this.display = true;
  }

  filterTags(event: any) {
    const query = event.query.toLowerCase();
    this.filteredTags = this.allTags.filter(tag => tag.toLowerCase().includes(query));

    // agar tag exist nahi karta to suggest naya add karne ka option
    if (!this.allTags.some(tag => tag.toLowerCase() === query) && query.trim()) {
      this.filteredTags = [...this.filteredTags, `+ Add "${event.query}"`];
    }
  }

  // jab user naya tag type kare to list me add karna
  onTagSelect(event: AutoCompleteSelectEvent) {
    const tag = event.value as string;

    if (tag.startsWith('+ Add "')) {
      const newTag = tag.replace('+ Add "', '').replace('"', '');
     this.selectedTags = [...this.selectedTags.filter(t => !t.startsWith('+ Add "')), newTag];
    }
  }

  saveTags() {
   this.tagsSelected.emit(this.selectedTags); 
    this.display = false;
  }

  cancel() {
    this.display = false;
  }
}
