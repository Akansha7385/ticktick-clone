import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';


@Component({
  selector: 'app-tags',
  imports: [CommonModule, DialogModule, ButtonModule, FormsModule, AutoCompleteModule],
  templateUrl: './tags.html',
  styleUrl: './tags.css'
})
export class Tags {
  display: boolean = false;

  selectedTags: string[] = [];
  allTags: string[] = ["work", "personal", "urgent", "dwq", "study"];
  filteredTags: string[] = [];

  showDialog() {
    this.display = true;
  }

  filterTags(event: any) {
    let query = event.query.toLowerCase();
    this.filteredTags = this.allTags.filter(tag => tag.toLowerCase().includes(query));
  }

  saveTags() {
    console.log("Selected Tags:", this.selectedTags);
    this.display = false;
  }

  cancel() {
    this.display = false;
  }

}
