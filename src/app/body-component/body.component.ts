import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { TaskMenu } from '../task-menu/task-menu';
import { Tags } from '../tags/tags';
import { SplitterModule } from 'primeng/splitter';
import { DatePickerModule } from 'primeng/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { CategoryService } from '../services/category.service';
import { Popup } from '../popup/popup';
import { TooltipModule } from 'primeng/tooltip';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low' | 'none';
  subtasks?: Task[];
  showSubtaskInput?: boolean;
  type?: 'task' | 'note';
  tags?: string[];
  dueDate?: string | null;
  list?:
    | 'inbox'
    | 'today'
    | 'next7Days'
    | 'welcome'
    | 'work'
    | 'custom'
    | string;
  pinned?: boolean;
  description?: string;
  categoryId?: number;
}

@Component({
  selector: 'body-component',
  standalone: true,
  exportAs: 'BodyComponent',
  imports: [
    InputTextModule,
    FormsModule,
    Sidebar,
    CheckboxModule,
    TaskMenu,
    CommonModule,
    Tags,
    SplitterModule,
    DatePickerModule,
    DragDropModule,
    Popup,
    TooltipModule,
  ],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent {
  taskText: string = '';
  allTasks: Task[] = [];
  message: string = '';
  selectedTask: any = null;
  date: any = null;
  sidebarVisible: boolean = false;
  tasks: Task[] = [];
  selectedCategoryDetails: any = {};
  selectedPriority: 'high' | 'medium' | 'low' | 'none' = 'none';
  selectedCategory: 'inbox' | 'today' | 'next7Days' = 'inbox';
  showTags = false;
  allowAddTask = true;
  allowPriorityFeature = true;
  allowEditing = true;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  constructor(
    private TaskService: TaskService,
    private CategoryService: CategoryService
  ) {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.allTasks = JSON.parse(savedTasks);
    }
    this.CategoryService.selectedCategory.subscribe((id) => {
      this.getTasksByCategoryId(id);
    });

    // Subscribe to category list updates
    this.CategoryService.categoryListSubject.subscribe((cats) => {
      this.customCategories = cats; // include all default + user-added
    });
  }

  //popup s priority update krne k lie
  onPrioritySelect(priority: 'high' | 'medium' | 'low' | 'none') {
    this.selectedPriority = priority;
  }

  onCategorySelect(category: 'inbox' | 'today' | 'next7Days') {
    this.selectedCategory = category;
  }

  //task categorize based on id
  getTasksByCategoryId(id: number) {
    if (id === 1) {
      // Today
      this.tasks = this.allTasks.filter(
        (t) => !t.completed && t.list === 'today'
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    } else if (id === 2) {
      // Next 7 Days
      this.tasks = this.allTasks.filter(
        (t) => !t.completed && t.list === 'next7Days'
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    } else if (id === 3) {
      // Inbox
      this.tasks = this.allTasks.filter(
        (t) => !t.completed && t.list === 'inbox'
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    } else if (id === 4) {
      // Completed
      this.tasks = this.allTasks.filter((t) => t.completed);
      this.allowAddTask = false;
      this.allowPriorityFeature = false;
      this.allowEditing = false;
    } else {
      // Custom category
      this.tasks = this.allTasks.filter(
        (t) => !t.completed && t.categoryId === id
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    }

    this.selectedCategoryDetails = this.CategoryService.getCategoryDetails(id);
  }

  //for random id generation
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  addTask() {
    const invalidPattern = /[^a-zA-Z0-9\s]/; // sirf letters, numbers aur spaces allow

    if (!this.taskText.trim()) {
      return;
    }

    if (invalidPattern.test(this.taskText)) {
      this.message = 'Invalid characters not allowed!';
      setTimeout(() => (this.message = ''), 2000);
      return;
    }

    const newTask: Task = {
      id: this.generateId(),
      text: this.taskText.trim(),
      completed: false,
      priority: this.selectedPriority,
      subtasks: [],
      type: 'task',
      pinned: false,
      list: this.selectedCategory,
      categoryId: this.selectedCategoryDetails.id,
    };

    // Due date / category logic wahi rahega
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.selectedCategoryDetails.id == 1) {
      newTask.dueDate = today.toISOString();
      newTask.list = 'today';
    } else if (this.selectedCategoryDetails.id == 2) {
      const next7 = new Date();
      next7.setDate(today.getDate() + 7);
      next7.setHours(0, 0, 0, 0);
      newTask.dueDate = next7.toISOString();
      newTask.list = 'next7Days';
    } else if (this.selectedCategoryDetails.id == 3) {
      newTask.dueDate = null;
      newTask.list = 'inbox';
    } else {
      newTask.dueDate = null;
      newTask.list = 'custom';
    }

    this.allTasks.push(newTask);
    this.getTasksByCategoryId(this.selectedCategoryDetails.id);
    this.taskText = '';
    this.saveTasks();
  }

  duplicateTask() {
    if (!this.selectedTask) return;

    // Recursive function to duplicate subtasks
    const duplicateSubtasks = (subtasks?: Task[]): Task[] => {
      if (!subtasks) return [];
      return subtasks.map((sub) => ({
        ...sub,
        id: this.generateId(),
        subtasks: duplicateSubtasks(sub.subtasks), // recursively duplicate
      }));
    };

    const newTask: Task = {
      ...this.selectedTask,
      id: this.generateId(),
      text: this.selectedTask.text + ' (Copy)',
      subtasks: duplicateSubtasks(this.selectedTask.subtasks),
    };

    this.allTasks.push(newTask);
    this.getTasksByCategoryId(this.selectedCategoryDetails.id); // refresh the task list
    this.saveTasks();
    this.message = 'Task duplicated!';
    setTimeout(() => (this.message = ''), 2000);
  }

 completeTask(task: Task, parentTask?: Task) {
  task.completed = true;
  this.message = `Task Completed: ${task.text}`;

  // Only remove from current tasks if not viewing Completed category
  if (this.selectedCategoryDetails.id !== 4) {
    if (parentTask) {
      parentTask.subtasks = parentTask.subtasks?.filter(sub => sub.id !== task.id);
    } else {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }
  }

  this.saveTasks();
  setTimeout(() => (this.message = ''), 2000);
}


  //task menu on rightclick
  onRightClick(event: MouseEvent, cm: any, task: Task, menu: any) {
    this.selectedTask = task;
    menu.buildMenu(task.type ?? 'task');
    cm.show(event);
    event.preventDefault();
  }

  //for deleting the tasks
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

  //for setting priority
  setPriority(priority: 'high' | 'medium' | 'low' | 'none') {
    if (this.selectedTask) {
      this.selectedTask.priority = priority;
      this.saveTasks();
    }
  }

  //for adding subtassk and showing input field
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
      type: 'task',
    });
    task.showSubtaskInput = false;
    this.saveTasks();
  }

  //copy task link
  copyTaskLink() {
    if (!this.selectedTask) return;

    const link = `${window.location.origin}/task/${this.selectedTask.id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => alert('Task link copied!'))
      .catch((err) => console.error('Failed to copy link:', err));
  }

  //convert task to notes
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

  //convert notes to task
  convertNoteToTask() {
    if (this.selectedTask && this.selectedTask.type === 'note') {
      this.selectedTask.type = 'task';
      this.saveTasks();
      this.message = 'Note converted back to task!';
      setTimeout(() => (this.message = ''), 2000);
    }
  }

  get activeTasks(): Task[] {
    return this.tasks.filter((t) => t.type !== 'note');
  }

  get notes(): Task[] {
    return this.tasks.filter((t) => t.type === 'note');
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.allTasks));
  }

  showTagsDialog() {
    this.showTags = true;
  }

  //to update tags
  updateTaskTags(tags: string[]) {
    if (this.selectedTask) {
      this.selectedTask.tags = tags;
    } else {
      const tempTask: Task = {
        id: this.generateId(),
        text: this.taskText.trim() || 'Untitled Task',
        completed: false,
        priority: this.selectedPriority,
        list: this.selectedCategory,
        tags: tags,
      };
      this.allTasks.push(tempTask);
      this.getTasksByCategoryId(this.selectedCategoryDetails.id);
    }

    this.saveTasks();
    this.showTags = false;
  }

  //setting duedate
  setDueDate(date: Date) {
    if (this.selectedTask) {
      this.selectedTask.dueDate = date.toISOString(); // save as ISO string

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      const diffTime = selected.getTime() - today.getTime(); //selected date aur today ke beech ka time difference in milliseconds
      const diffDays = diffTime / (1000 * 3600 * 24); //difference days me convert karo

      if (diffDays === 0) {
        this.selectedTask.list = 'today'; //  aaj ke liye
      } else if (diffDays > 0 && diffDays <= 7) {
        this.selectedTask.list = 'next7Days'; //  next 7 din ke liye
      } else {
        this.selectedTask.list = 'inbox'; //  baki sab Inbox me
      }

      this.saveTasks();
    }
  }

  get hasPinned(): boolean {
    return this.tasks.some((t) => t.pinned);
  }

  get unpinnedTasks(): Task[] {
    return this.tasks.filter((t) => !t.pinned);
  }
  get pinnedTasks(): Task[] {
    return this.tasks.filter((t) => t.pinned);
  }

  //pin or unpin the selected task
  pinTask() {
    if (this.selectedTask) {
      this.selectedTask.pinned = !this.selectedTask.pinned;
      this.saveTasks();
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;

    if (task.completed) {
      // Remove from both displayed tasks and allTasks
      this.tasks = this.tasks.filter((t) => t.id !== task.id);
      this.message = `Task Completed: ${task.text}`;
    } else {
      // Undo completion
      this.tasks.push(task);
      this.allTasks.push(task);
    }

    this.message = task.completed
    ? `Task Completed: ${task.text}`
    : `Task marked as incomplete: ${task.text}`;

  setTimeout(() => (this.message = ''), 2000);
  }

  //display date
  getDisplayDate(selectedDate: string | null): string {
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
    const isToday = dateObj.toDateString() === today.toDateString();
    const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();
    const isYesterday = dateObj.toDateString() === yesterday.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    if (isYesterday) return 'Yesterday';

    // DD/MM/YY format
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(dateObj);
  }

  //change the priority in cycle
  cyclePriority() {
    if (!this.selectedTask) return;
    const order: ('high' | 'medium' | 'low' | 'none')[] = [
      'high',
      'medium',
      'low',
      'none',
    ];
    const currentIndex = order.indexOf(this.selectedTask.priority ?? 'none');
    const nextIndex = (currentIndex + 1) % order.length;
    this.selectedTask.priority = order[nextIndex];
    this.saveTasks();
  }

  //reordering of tasks
  dropTask(event: CdkDragDrop<Task[]>) {
    // Reorder directly in the dropped list
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Ab dono lists rebuild karo
    const pinned = this.tasks.filter((t) => t.pinned);
    const unpinned = this.tasks.filter((t) => !t.pinned);

    // Overwrite container list ke order ko maintain karte hue
    if (event.container.data.every((t) => t.pinned)) {
      // Pinned reorder hua
      this.tasks = [...event.container.data, ...unpinned];
    } else {
      // Unpinned reorder hua
      this.tasks = [...pinned, ...event.container.data];
    }

    this.saveTasks();
  }

  //reordering subtask with drag and drop
  dropSubtask(event: CdkDragDrop<Task[]>, parentTask: Task) {
    moveItemInArray(
      parentTask.subtasks!,
      event.previousIndex,
      event.currentIndex
    );
    this.saveTasks();
  }

  //moving tasks to different categories
  onMoveToList(list: string) {
    if (this.selectedTask) {
      this.selectedTask.list = list as Task['list']; //  cast to union
      this.saveTasks();
      this.message = `Task moved to ${list}`;
      setTimeout(() => (this.message = ''), 2000);
    }
  }
  selectTask(task: Task) {
    // find the actual task in allTasks by ID
    const originalTask = this.allTasks.find((t) => t.id === task.id);
    if (originalTask) {
      this.selectedTask = originalTask;
      this.date = originalTask.dueDate ? new Date(originalTask.dueDate) : null;
    }
  }

  onEnterSave(event: Event) {
    const input = event.target as HTMLInputElement;
    this.saveTasks();
    input.blur(); // focus hata do
  }

  customCategories: { id: number; name: string }[] = [];

  moveTaskToCategory(categoryId: number) {
    if (this.selectedTask) {
      this.selectedTask.categoryId = categoryId;
      const categoryDetails =
        this.CategoryService.getCategoryDetails(categoryId);
      this.selectedTask.list = categoryDetails?.name?.toLowerCase() || 'custom';
      this.getTasksByCategoryId(categoryId);
      this.saveTasks();
    } else {
      // Update placeholder for new task
      this.selectedCategoryDetails =
        this.CategoryService.getCategoryDetails(categoryId);
      this.selectedCategory =
        (this.selectedCategoryDetails?.name?.toLowerCase() as any) || 'inbox';
    }
  }
}
