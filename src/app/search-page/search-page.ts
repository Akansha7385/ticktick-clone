import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TaskService, Task } from '../services/task.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [DialogModule, FormsModule, CommonModule, NgFor], 
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
@Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  query: string = '';
  results: Task[] = [];

  constructor(private taskService: TaskService) {}

  search() {
    this.results = this.taskService.searchTasks(this.query);
  }

  closeDialog() {
    this.visible = false;
  }
}
