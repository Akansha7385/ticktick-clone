import { Injectable } from '@angular/core';

export interface Task { 
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low' | 'none';
  subtasks?: Task[];
  showSubtaskInput?: boolean;
  type?: 'task' | 'note';  
  tags?: string[]; 
  dueDate?: string; 
  list?: 'inbox' | 'welcome' | 'work';
  pinned?: boolean;
  description?: string; 
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];

  constructor() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
    }
  }
  generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

completeTask(task: Task) {
  task.completed = true;
  this.updateTask(task);
}

setPriority(task: Task, priority: 'high' | 'medium' | 'low' | 'none') {
  task.priority = priority;
  this.updateTask(task);
}

pinTask(task: Task) {
  task.pinned = !task.pinned;
  this.updateTask(task);
}

addSubtask(parent: Task, subtaskText: string) {
  if (!parent.subtasks) parent.subtasks = [];
  parent.subtasks.push({
    id: this.generateId(),
    text: subtaskText,
    completed: false,
    priority: 'none',
    subtasks: [],
    type: 'task'
  });
  this.updateTask(parent);
}

  
}
