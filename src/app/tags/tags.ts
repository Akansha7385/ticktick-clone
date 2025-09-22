import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { TagsService } from '../services/tags.service';

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
  allTags: string[] = [];
  filteredTags: string[] = [];
  inputValue: string = '';

  constructor(private tagsService: TagsService) {
    this.tagsService.allTags$.subscribe(tags => {
      this.allTags = tags;
    });
  }

  showDialog() {
    this.display = true;
    // Clear previous selections when opening dialog
    this.selectedTags = [];
    this.inputValue = '';
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
    console.log('onTagSelect called with:', tag);

    if (tag.startsWith('+ Add "')) {
      const newTag = tag.replace('+ Add "', '').replace('"', '');
      console.log('Adding new tag from dropdown:', newTag);
      
      // Add the new tag to the global tags service first
      this.tagsService.addTag(newTag);
      
      // Then add it to selected tags
      if (!this.selectedTags.includes(newTag)) {
        this.selectedTags = [...this.selectedTags, newTag];
        console.log('Added to selectedTags:', newTag);
      }
    } else {
      // If it's an existing tag, just add it to selected tags
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags = [...this.selectedTags, tag];
        console.log('Added existing tag to selectedTags:', tag);
      }
    }
    
    // Clear the input field
    this.inputValue = '';
  }

  onTagUnselect(event: any) {
    // Handle tag unselection if needed
  }

  onEnterKey() {
    // When Enter is pressed, add the current input value as a tag if it's not empty
    if (this.inputValue && this.inputValue.trim() !== '') {
      const newTag = this.inputValue.trim();
      
      // Add to global service first
      this.tagsService.addTag(newTag);
      
      // Add to selected tags if not already present
      if (!this.selectedTags.includes(newTag)) {
        this.selectedTags = [...this.selectedTags, newTag];
      }
      
      // Clear the input field
      this.inputValue = '';
    }
  }

  removeTag(index: number) {
    this.selectedTags.splice(index, 1);
  }

  saveTags() {
    console.log('saveTags called');
    console.log('inputValue:', this.inputValue);
    console.log('selectedTags before:', this.selectedTags);
    
    // Check if there's an unselected tag in the input field
    if (this.inputValue && this.inputValue.trim() !== '') {
      const newTag = this.inputValue.trim();
      console.log('Processing new tag:', newTag);
      
      // Ensure it's not already in selectedTags
      if (!this.selectedTags.includes(newTag)) {
        // Always add to global service first (it will handle duplicates internally)
        console.log('Adding new tag to global service:', newTag);
        this.tagsService.addTag(newTag);
        
        // Then add to selected tags
        this.selectedTags = [...this.selectedTags, newTag];
        console.log('Added tag to selectedTags:', newTag);
      }
    }

    console.log('selectedTags after:', this.selectedTags);
    console.log('Emitting tags:', this.selectedTags);
    
    // Emit the selected tags to the parent component
    this.tagsSelected.emit(this.selectedTags);
    this.display = false;
    this.inputValue = ''; // Clear input after saving
  }

  cancel() {
    this.display = false;
  }
}
