import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { Sidemenu } from '../sidemenu/sidemenu';
import { CommonModule, NgFor } from '@angular/common';
import { TaskMenu } from '../task-menu/task-menu';
import { Tags } from "../tags/tags";
import { SplitterModule } from 'primeng/splitter';
import { DatePicker } from 'primeng/datepicker';

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

@Component({
  selector: 'app-next7days',
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
    CommonModule,
    Tags,
    SplitterModule,
    DatePicker
],
  templateUrl: './next7-days.html',
  styleUrl: './next7-days.css',
})
export class Next7Days {
   taskText: string = '';
    tasks: Task[] = [];
    message: string = '';
    selectedTask: any = null;  
    date:any=null;
    sidebarVisible: boolean =false;

  
    
   toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  
    constructor() {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
      }
    }
  
    private generateId(): string {
      return Math.random().toString(36).substring(2, 9);
    }
  
    addTask() {
      if (this.taskText.trim()) {
        this.tasks.push({
          id: this.generateId(),
          text: this.taskText.trim(),
          completed: false,
          priority: 'none',
          subtasks: [],
          type: 'task',
        });
        this.taskText = '';
        this.saveTasks();
      }
    }
  
    completeTask(task: Task, parentTask?: Task) {
      this.message = `Task Completed: ${task.text}`;
      if (parentTask) {
        parentTask.subtasks = parentTask.subtasks?.filter(sub => sub !== task);
      } else {
        this.tasks = this.tasks.filter(t => t !== task);
      }
      this.saveTasks();
      setTimeout(() => (this.message = ''), 2000);
    }
  
    onRightClick(event: MouseEvent, cm: any, task: Task, menu: any) {
      this.selectedTask = task;
      menu.buildMenu(task.type ?? 'task');  
      cm.show(event);
      event.preventDefault();
    }
  
    deleteSelectedTask() {
      if (!this.selectedTask) return;
      this.removeTask(this.tasks, this.selectedTask);
      this.saveTasks();
    }
  
    private removeTask(list: Task[], taskToRemove: Task) {
      const index = list.indexOf(taskToRemove);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        for (let t of list) {
          if (t.subtasks) this.removeTask(t.subtasks, taskToRemove);
        }
      }
    }
  
    setPriority(priority: 'high' | 'medium' | 'low' | 'none') {
      if (this.selectedTask) {
        this.selectedTask.priority = priority;
        this.saveTasks();
      }
    }
  
    addSubtaskInput(task: Task) {
      task.showSubtaskInput = true;
    }
  
    addSubtask(task: Task, subtaskText: string) {
      if (!subtaskText.trim()) return;
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push({
        id: this.generateId(),
        text: subtaskText.trim(),
        completed: false,
        priority: 'none',
        subtasks: [],
        type: 'task'
      });
      task.showSubtaskInput = false;
      this.saveTasks();
    }
  
    copyTaskLink() {
      if (this.selectedTask) {
        const link = `${window.location.origin}/task/${this.selectedTask.id}`;
        navigator.clipboard.writeText(link).then(() => {
          this.message = 'Task link copied!';
          setTimeout(() => (this.message = ''), 2000);
        });
      }
    }
  
    convertTaskToNote() {
      if (this.selectedTask) {
        if (this.selectedTask.subtasks && this.selectedTask.subtasks.length > 0) {
          this.message = 'Cannot convert a task with subtasks into a note!';
          setTimeout(() => (this.message = ''), 2000);
          return;
        }
        this.selectedTask.type = 'note';
        this.selectedTask.subtasks = [];
        this.selectedTask.completed = false;
        this.saveTasks();
        this.message = 'Task converted to note!';
        setTimeout(() => (this.message = ''), 2000);
      }
    }
  
    convertNoteToTask() {
      if (this.selectedTask && this.selectedTask.type === 'note') {
        this.selectedTask.type = 'task';
        this.saveTasks();
        this.message = 'Note converted back to task!';
        setTimeout(() => (this.message = ''), 2000);
      }
    }
  
    get activeTasks(): Task[] {
      return this.tasks.filter(t => t.type !== 'note');
    }
  
    get notes(): Task[] {
      return this.tasks.filter(t => t.type === 'note');
    }
  
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  
    showTags = false;
  
    showTagsDialog() {
      this.showTags= true;
    }
  
    updateTaskTags(tags: string[]) {
    if (this.selectedTask) {
      this.selectedTask.tags = tags;
      this.saveTasks();
    }
    this.showTags = false;
  }
  
  setDueDate(date: string) {
    if (this.selectedTask) {
      this.selectedTask.dueDate = date;
      this.saveTasks();
    }
  }
  
  get hasPinned(): boolean {
    return this.tasks.some(t => t.pinned);
  }
  
  get pinnedTasks(): Task[] {
    return this.tasks.filter(t => t.pinned);
  }
  
  get unpinnedTasks(): Task[] {
    return this.tasks.filter(t => !t.pinned);
  }
  
  pinTask() {
    if (this.selectedTask) {
      this.selectedTask.pinned = !this.selectedTask.pinned;
      this.saveTasks();
    }
  }
  
  toggleTaskCompletion(task: Task) {
    if (task.completed) {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
      this.message = `Task Completed: ${task.text}`;
    } else {
      this.tasks.push(task);
    }
  
    this.saveTasks();
    setTimeout(() => (this.message = ''), 2000);
  }
  
  getDisplayDate(selectedDate: Date | null): string {
    if (!selectedDate) return '';
  
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
  
    const isToday = selectedDate.toDateString() === today.toDateString();
    const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();
  
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
  
    return new Intl.DateTimeFormat('en-GB').format(selectedDate); // dd/MM/yyyy
  }
  
  cyclePriority() {
  if (!this.selectedTask) return;
  const order: ('high' | 'medium' | 'low' | 'none')[] = ['high', 'medium', 'low', 'none'];
  const currentIndex = order.indexOf(this.selectedTask.priority ?? 'none');
  const nextIndex = (currentIndex + 1) % order.length;
  this.selectedTask.priority = order[nextIndex];
  this.saveTasks();
}
  
}
