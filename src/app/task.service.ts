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
  pinned?: boolean;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  tasks$ = this.tasksSubject.asObservable();

  private loadTasks(): Task[] {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  }

  private saveTasks(tasks: Task[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(task: Task) {
    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTasks(tasks: Task[]) {
    this.saveTasks(tasks);
  }
}
