import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { Sidemenu } from '../sidemenu/sidemenu';
import { NgFor } from '@angular/common';
import { TaskMenu } from '../task-menu/task-menu';

interface Task {
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low'| 'none';
}

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    Sidebar,
    AutoCompleteModule,
    AccordionModule,
    CheckboxModule,
    Sidemenu,
    NgFor,
    TaskMenu,
  ],
  templateUrl: './today.html',
  styleUrl: './today.css'
})
export class Today {
  taskText: string = '';
  tasks: Task[] = [];
  message: string = '';
  selectedTask!: Task;

  constructor() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  addTask() {
    if (this.taskText.trim()) {
      this.tasks.push({ text: this.taskText.trim(), completed: false, priority: undefined });
      this.taskText = '';
      this.saveTasks();
    }
  }

  completeTask(task: Task) {
    this.message = `Task Completed: ${task.text}`;
    this.tasks = this.tasks.filter(t => t !== task);
    this.saveTasks();
    setTimeout(() => this.message = '', 2000);
  }

  onRightClick(event: MouseEvent, cm: any, task: Task) {
    this.selectedTask = task;
    cm.show(event);
    event.preventDefault();
  }

  deleteSelectedTask() {
    if (this.selectedTask) {
      this.tasks = this.tasks.filter(t => t !== this.selectedTask);
      this.saveTasks();
    }
  }

  setPriority(priority: 'high' | 'medium' | 'low' | 'none') {
    if (this.selectedTask) {
      this.selectedTask.priority = priority;
      this.saveTasks();
    }
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
