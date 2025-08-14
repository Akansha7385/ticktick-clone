import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { Sidemenu } from '../sidemenu/sidemenu';
import { NgFor } from '@angular/common';

interface Task {
  text: string;
  completed: boolean;
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
    NgFor
  ],
  templateUrl: './today.html',
  styleUrl: './today.css'
})
export class Today {
  taskText: string = '';
  tasks: Task[] = [];
  message: string = ''; // for "Task Completed" message

  addTask() {
    if (this.taskText.trim()) {
      this.tasks.push({ text: this.taskText.trim(), completed: false });
      this.taskText = '';
    }
  }

  completeTask(task: Task) {
    this.message = `Task Completed: ${task.text}`;
    this.tasks = this.tasks.filter(t => t !== task);

    // Hide message after 2 seconds
    setTimeout(() => this.message = '', 2000);
  }
}
