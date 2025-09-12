import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SplitterModule } from 'primeng/splitter';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low' | 'none';
  dueDate?: string | null;
  description?: string;
}

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

  constructor(private route: ActivatedRoute) {}

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
  getDisplayDate(selectedDate: string | null | undefined): string {
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

}
