import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, SplitterModule],
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css']
})
export class TaskDetail implements OnInit {
  taskId: string | null = null;
  task: Task | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');

      if (this.taskId) {
        // Fetch only the task with this ID from localStorage
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
          const allTasks: Task[] = JSON.parse(savedTasks);
          this.task = allTasks.find(t => t.id === this.taskId) || null;
        }
      }
    });
  }
  getDisplayDate(selectedDate: string | undefined): string {
  if (!selectedDate) return '';

  const dateObj = new Date(selectedDate);
  const today = new Date();
  const tomorrow = new Date();
  const yesterday = new Date();
  today.setHours(0, 0, 0, 0);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  if (dateObj.toDateString() === today.toDateString()) return 'Today';
  if (dateObj.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  if (dateObj.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(dateObj);
}

  getCreatedDate(): string {
    // Since createdAt is not in the Task interface, return a placeholder
    return 'Unknown';
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  toggleTaskStatus() {
    if (this.task) {
      if (!this.task.completed) {
        // Mark as completed - use the service method that handles list assignment
        this.taskService.completeTask(this.task.id);
        this.task.completed = true;
        this.task.list = 'completed';
      } else {
        // Mark as pending - manually update to inbox
        const updatedTask = { 
          ...this.task, 
          completed: false,
          list: 'inbox'
        };
        this.taskService.updateTask(updatedTask);
        this.task = updatedTask;
      }
    }
  }

}
