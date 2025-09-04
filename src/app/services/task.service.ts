// task.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low' | 'none';
  subtasks?: Task[];
  type?: 'task' | 'note';
  tags?: string[];
  dueDate?: string;
  list?: 'inbox' | 'today' | 'next7Days' | 'work' | 'welcome';
  pinned?: boolean;
  description?: string;
  showSubtaskInput?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      this.tasksSubject.next(JSON.parse(saved));
    }
  }

  get tasks(): Task[] {
    return this.tasksSubject.value;
  }

  saveTasks(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  addTask(task: Task) {
    const updated = [...this.tasks, task];
    this.saveTasks(updated);
  }

  searchTasks(query: string): Task[] {
    return this.tasks.filter(t => t.text.toLowerCase().includes(query.toLowerCase()));
  }
}
