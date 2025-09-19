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
  list?: 'inbox' | 'today' | 'next7Days' | 'work' | 'welcome' | 'completed' |'custom'|string;
  pinned?: boolean;
  description?: string;
  showSubtaskInput?: boolean;
  categoryId?: number;

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
  
  pinAllTasksOfCategory(categoryId: number) {
    const updated = this.tasks.map(t => {
      if (t.categoryId === categoryId) t.pinned = true;
      return t;
    });
    this.saveTasks(updated);
  }
  updateTask(updatedTask: Task) {
  const updatedTasks = this.tasks.map(task =>
    task.id === updatedTask.id ? { ...task, ...updatedTask } : task
  );
  this.saveTasks(updatedTasks);
}

completeTask(taskId: string) {
  const updatedTasks = this.tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, completed: true, list: 'completed' }; // move to completed
    }
    return task;
  });
  this.saveTasks(updatedTasks);
}

}
