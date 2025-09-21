import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TaskService, Task } from '../services/task.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [DialogModule, FormsModule, CommonModule], 
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage {
@Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  

  query: string = '';
  results: Task[] = [];

  constructor(private taskService: TaskService, private router: Router) {}

  search() {
    this.results = this.taskService.searchTasks(this.query);
  }

closeDialog() {
  this.visible = false;            
  this.visibleChange.emit(false);   
}

toggleComplete(task: Task) {
  this.taskService.completeTask(task.id);      // mark as completed
  this.results = this.results.filter(t => t.id !== task.id); // remove from search results
}

openTaskInNewTab(task: Task) {
  const taskUrl = `/task/${task.id}`;
  window.open(taskUrl, '_blank');
}

}
