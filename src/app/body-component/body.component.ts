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
import { TagsService } from '../services/tags.service';
import { Popup } from '../popup/popup';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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

export interface SectionPanel {
  label: string;
  tasks: Task[];
  showTaskInput: boolean;
  categoryId: number;
  taskText?: string;
}


import { PanelModule } from 'primeng/panel';
import { InplaceModule } from 'primeng/inplace';
import { AutoFocusModule } from 'primeng/autofocus';
import { PriorityColorPipe } from '../priority-color-pipe';
@Component({
  selector: 'body-component',
  standalone: true,
  exportAs: 'BodyComponent',
  imports: [
    InputTextModule,
    FormsModule,
    Sidebar,
    CheckboxModule,
    AutoFocusModule,
    PanelModule,
    TaskMenu,
    InplaceModule,
    CommonModule,
    Tags,
    SplitterModule,
    DatePickerModule,
    DragDropModule,
    Popup,
    TooltipModule,
    PriorityColorPipe,
  ],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent {
  taskText: string = ''; //jo input box me type hota hai.
  allTasks: Task[] = []; //sabhi tasks ka master array (localStorage me save).
  message: string = ''; //ui message
  selectedTask: any = null;//currently selected task
  date: any = null;//datepicker binding value. 
  sectionLabel: string = ''; //temp label
  sidebarVisible: boolean = false; //open/close flag.
  tasks: Task[] = []; //current displayed tasks
  selectedCategoryDetails: any = {}; //detail for current category
  selectedPriority: 'high' | 'medium' | 'low' | 'none' = 'none';//selected priority
  selectedCategory: 'inbox' | 'today' | 'next7Days' = 'inbox';//selected category
  showTags = false;//falg
  allowAddTask = true;
  allowPriorityFeature = true;
  allowEditing = true;
  showTaskInput: boolean = false;
  sectionTasks: Task[] = [];//section tasks
  sectionPanels: SectionPanel[] = [];
  panelCollapsed: boolean[] = []; 
  selectedTaskPanelIndex?: number;
  selectedSubtaskDueDate: Date | null = null;
  notSectionedPanel: SectionPanel | null = null;
  notSectionedPanelCollapsed: boolean = false;
  selectedTag: string | null = null;


  ngOnInit() {
    this.sectionPanels.forEach(() => this.panelCollapsed.push(true)); // start collapsed
  }

  //new section add karne ka method
 addSectionFromPopup() {
  this.sectionPanels.push({
    label: '',
    tasks: [],
    showTaskInput: false,
    categoryId: this.selectedCategoryDetails.id, 
  });
  this.saveSectionPanels();
  this.manageNotSectionedPanel();
}

// Method to manage Not Sectioned panel
manageNotSectionedPanel() {
  const hasSections = this.sectionPanels.some(panel => 
    panel.categoryId === this.selectedCategoryDetails.id && 
    this.selectedCategoryDetails.id !== 4
  );

  if (hasSections && !this.notSectionedPanel) {
    // Create Not Sectioned panel with current tasks
    this.notSectionedPanel = {
      label: 'Not Sectioned',
      tasks: [...this.tasks], // Move all current tasks to Not Sectioned
      showTaskInput: false,
      categoryId: this.selectedCategoryDetails.id
    };
    // Keep tasks in main list for normal display when no sections
    // this.tasks = []; // Don't clear main tasks list
  } else if (!hasSections && this.notSectionedPanel) {
    // Remove Not Sectioned panel - tasks are already in main list
    this.notSectionedPanel = null;
  }
}


  //localStorage me save krne ka method
  saveSectionPanels() {
    localStorage.setItem('sectionPanels', JSON.stringify(this.sectionPanels));
  }

  //update panel label
  updatePanelLabel(panel: any) {
    this.saveSectionPanels();
  }

  //sidebar input show/hide toggle.
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  //add task input show/hide toggle.
  toggleTaskInput() {
    this.showTaskInput = !this.showTaskInput;
  }

  constructor(
    private TaskService: TaskService,
    private CategoryService: CategoryService,
    private TagsService: TagsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.allTasks = JSON.parse(savedTasks);
      this.sectionTasks = this.allTasks.filter(
        (t) => t.list === 'custom' && !t.completed
      );
    }

    const savedPanels = localStorage.getItem('sectionPanels');
    if (savedPanels) {
      this.sectionPanels = JSON.parse(savedPanels);
    } else {
      this.sectionPanels = [];
    }

    this.CategoryService.selectedCategory.subscribe((id) => {
      this.getTasksByCategoryId(id);
    });

    // Subscribe to category list updates
    this.CategoryService.categoryListSubject.subscribe((cats) => {
      this.customCategories = cats;
    });

    // Subscribe to selected tag changes
    this.TagsService.selectedTag$.subscribe((tag) => {
      this.selectedTag = tag;
      this.applyTagFilter();
    });

    // Subscribe to all tags changes to refresh tasks when tags are deleted
    this.TagsService.allTags$.subscribe(() => {
      // Reload tasks from localStorage to reflect tag deletions
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        this.allTasks = JSON.parse(savedTasks);
        // Re-apply current filters
        if (this.selectedCategoryDetails && this.selectedCategoryDetails.id) {
          this.getTasksByCategoryId(this.selectedCategoryDetails.id);
        }
        // Force change detection
        this.cd.detectChanges();
      }
    });

    // Subscribe to tasks updated events (when tags are removed from tasks)
    this.TagsService.tasksUpdated$.subscribe(() => {
      // Reload tasks from localStorage to reflect tag deletions
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        this.allTasks = JSON.parse(savedTasks);
        // Re-apply current filters
        if (this.selectedCategoryDetails && this.selectedCategoryDetails.id) {
          this.getTasksByCategoryId(this.selectedCategoryDetails.id);
        }
        // Force change detection
        this.cd.detectChanges();
      }
    });

    // Update tags from existing tasks
    this.TagsService.updateTagsFromTasks(this.allTasks);

    // Subscribe to live task updates from TaskService for real-time synchronization
    this.TaskService.tasks$.subscribe(updatedTasks => {
      this.allTasks = updatedTasks;
      this.sectionTasks = this.allTasks.filter(
        (t) => t.list === 'custom' && !t.completed
      );
      
      // Re-apply current filters to refresh the display
      if (this.selectedCategoryDetails && this.selectedCategoryDetails.id) {
        this.getTasksByCategoryId(this.selectedCategoryDetails.id);
      }
      
      // Update tags from tasks
      this.TagsService.updateTagsFromTasks(this.allTasks);
      
      // Force change detection
      this.cd.detectChanges();
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
    let filteredTasks: Task[] = [];

    if (id === 1) {
      // Today
      filteredTasks = this.allTasks.filter(
        (t) => !t.completed && t.list === 'today'
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    } else if (id === 2) {
      // Next 7 Days
      filteredTasks = this.allTasks.filter(
        (t) => !t.completed && t.list === 'next7Days'
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    } else if (id === 3) {
      // Inbox
      filteredTasks = this.allTasks.filter(
        (t) => !t.completed && t.list === 'inbox'
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    } else if (id === 4) {
      // Completed
      filteredTasks = this.allTasks.filter((t) => t.completed);
      this.allowAddTask = false;
      this.allowPriorityFeature = false;
      this.allowEditing = false;
    } else {
      // Custom category
      filteredTasks = this.allTasks.filter(
        (t) => !t.completed && t.categoryId === id
      );
      this.allowAddTask = true;
      this.allowPriorityFeature = true;
      this.allowEditing = true;
    }

    // Apply tag filter if a tag is selected
    if (this.selectedTag) {
      filteredTasks = this.filterTasksByTag(filteredTasks, this.selectedTag);
    }

    // Filter out tasks with empty text or "Untitled Task", but allow tasks with tags
    filteredTasks = filteredTasks.filter(task => 
      (task.text && 
       task.text.trim() !== '' && 
       task.text.trim() !== 'Untitled Task') ||
      (task.tags && task.tags.length > 0)
    );

    this.tasks = filteredTasks;
    this.selectedCategoryDetails = this.CategoryService.getCategoryDetails(id);
    this.manageNotSectionedPanel();
  }

  //for random id generation
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  //invalid text 
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
      tags: this.selectedTag ? [this.selectedTag] : [],
    };

    // Due date 
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

    // Always add to allTasks array for persistence
    this.allTasks.push(newTask);
    
    // Check if we have sections and should also add to Not Sectioned panel
    const hasSections = this.sectionPanels.some(panel => 
      panel.categoryId === this.selectedCategoryDetails.id && 
      this.selectedCategoryDetails.id !== 4
    );

    if (hasSections && this.notSectionedPanel) {
      // Also add to Not Sectioned panel for display
      this.notSectionedPanel.tasks.push(newTask);
    }
    
    this.getTasksByCategoryId(this.selectedCategoryDetails.id);
    this.taskText = '';
    // Keep the selected tag so user stays in the filtered view
    // The tag will only be cleared when user explicitly clicks "Clear Filter" or selects a different tag
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

     if (this.selectedTaskPanelIndex !== undefined) {
    this.sectionPanels[this.selectedTaskPanelIndex].tasks.push(newTask);
    this.saveSectionPanels();
  } else {
    // Normal tasks
    this.allTasks.push(newTask);
    this.getTasksByCategoryId(this.selectedCategoryDetails.id);
    this.saveTasks();
  }
    this.message = 'Task duplicated!';
    setTimeout(() => (this.message = ''), 2000);
  }

  //markin task completed
  completeTask(task: Task, panelIndex?: number, parentTask?: Task) {
    task.completed = true;
    this.message = `Task Completed: ${task.text}`;

    // Agar Completed category me nahi hai, to remove karo
    if (this.selectedCategoryDetails.id !== 4) {
      if (parentTask) {
        // Subtask remove
        parentTask.subtasks = parentTask.subtasks?.filter(
          (sub) => sub.id !== task.id
        );
      } else if (panelIndex !== undefined) {
        // Section panel task remove
        this.sectionPanels[panelIndex].tasks = this.sectionPanels[
          panelIndex
        ].tasks.filter((t) => t.id !== task.id);
      } else {
        // Normal tasks remove
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
      }
    }

    this.saveTasks();

    // Message 2s ke liye show kare
    setTimeout(() => (this.message = ''), 2000);
  }

  //task menu on rightclick
  onRightClick(
    event: MouseEvent,
    cm: any,
    task: Task,
    menu: any,
    panelIndex?: number
  ) {
    this.selectedTask = task;
    this.selectedTaskPanelIndex = panelIndex;
    menu.buildMenu(task.type ?? 'task');
    cm.show(event);
    event.preventDefault();
  }

  //for deleting the tasks
  deleteSelectedTask() {
  if (!this.selectedTask) return;

  // Normal tasks
  this.removeTask(this.tasks, this.selectedTask);

  // Panel tasks
  this.sectionPanels.forEach(panel => {
    this.removeTask(panel.tasks, this.selectedTask);
  });

  // Unpinned / Pinned tasks
  this.removeTask(this.unpinnedTasks, this.selectedTask);
  this.removeTask(this.pinnedTasks, this.selectedTask);

  // Notes
  this.removeTask(this.notes, this.selectedTask);

  this.selectedTask = null;
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
    this.cd.detectChanges(); // ensure UI updates
  }
}


  // Add subtask for both normal tasks and section panel tasks
  addSubtask(task: Task, subtaskText: string, panelIndex?: number) {
    if (!subtaskText.trim()) return;

    if (panelIndex !== undefined) {
      const panelTask = this.sectionPanels[panelIndex].tasks.find(
        (t) => t.id === task.id
      );
      if (!panelTask) return;
      if (!panelTask.subtasks) panelTask.subtasks = [];
      panelTask.subtasks.push({
        id: this.generateId(),
        text: subtaskText.trim(),
        completed: false,
        priority: 'none',
        subtasks: [],
        type: 'task',
        tags: [],
      });
      panelTask.showSubtaskInput = false;
    } else {
      if (!task.subtasks) task.subtasks = [];
      task.subtasks.push({
        id: this.generateId(),
        text: subtaskText.trim(),
        completed: false,
        priority: 'none',
        subtasks: [],
        type: 'task',
        tags: [],
      });
      task.showSubtaskInput = false;
    }
    this.selectedSubtaskDueDate = null;
    this.saveTasks();
  }

  // Show subtask input for section panel tasks
  addSubtaskInput(task: Task, panelIndex?: number) {
    if (panelIndex !== undefined) {
      const panelTask = this.sectionPanels[panelIndex].tasks.find(
        (t) => t.id === task.id
      );
      if (panelTask) panelTask.showSubtaskInput = true;
    } else {
      task.showSubtaskInput = true;
    }
    this.saveTasks();
  }

  //copy task link
  copyTaskLink() {
    if (!this.selectedTask) return;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/task', this.selectedTask.id])
    );

    navigator.clipboard
      .writeText(`${window.location.origin}${url}`)
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
    localStorage.setItem('sectionPanels', JSON.stringify(this.sectionPanels));
    
    // Update tags from all tasks
    this.TagsService.updateTagsFromTasks(this.allTasks);
  }

  showTagsDialog() {
    this.showTags = true;
  }

  //to update tags
  updateTaskTags(tags: string[]) {
    console.log('updateTaskTags called with:', tags);
    console.log('selectedTask:', this.selectedTask);
    
    if (this.selectedTask) {
      // Update the selected task's tags
      this.selectedTask.tags = tags;
      
      // Also update the task in allTasks array to ensure consistency
      const taskIndex = this.allTasks.findIndex(task => task.id === this.selectedTask.id);
      if (taskIndex !== -1) {
        this.allTasks[taskIndex].tags = tags;
      }
      
      console.log('Updated task tags:', this.selectedTask);
    } else {
      // Create a new task with tags
      const tempTask: Task = {
        id: this.generateId(),
        text: this.taskText.trim() || '', // Allow empty text if only tags are added
        completed: false,
        priority: this.selectedPriority,
        list: this.selectedCategory,
        categoryId: this.selectedCategoryDetails.id,
        tags: tags,
      };
      this.allTasks.push(tempTask);
      this.taskText = ''; // Clear the input field
      console.log('Created new task with tags:', tempTask);
    }

    // Save tasks and refresh the display
    this.saveTasks();
    this.getTasksByCategoryId(this.selectedCategoryDetails.id);
    this.showTags = false;
  }

  // Manual refresh method for debugging
  refreshTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.allTasks = JSON.parse(savedTasks);
      if (this.selectedCategoryDetails && this.selectedCategoryDetails.id) {
        this.getTasksByCategoryId(this.selectedCategoryDetails.id);
      }
      this.cd.detectChanges();
    }
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

  // Helper methods for section panel tasks
  getPinnedTasksForPanel(panel: SectionPanel): Task[] {
    return panel.tasks.filter((t) => t.pinned && !t.completed);
  }

  getUnpinnedTasksForPanel(panel: SectionPanel): Task[] {
    return panel.tasks.filter((t) => !t.pinned && !t.completed);
  }

  hasPinnedTasksInPanel(panel: SectionPanel): boolean {
    return panel.tasks.some((t) => t.pinned);
  }

  //pin or unpin the selected task
  pinTask() {
    if (this.selectedTask) {
      this.selectedTask.pinned = !this.selectedTask.pinned;
      
      // If task is in a section panel, save section panels
      if (this.selectedTaskPanelIndex !== undefined) {
        this.saveSectionPanels();
      } else {
        // If task is in main tasks array, save tasks
        this.saveTasks();
      }
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
     dateObj.setHours(0, 0, 0, 0);
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
     
     this.sectionPanels.forEach(panel => {
    panel.tasks.forEach(task => {
      if (task.id === this.selectedTask.id) {
        task.priority = this.selectedTask.priority;
      }
      task.subtasks?.forEach(sub => {
        if (sub.id === this.selectedTask.id) sub.priority = this.selectedTask.priority;
      });
    });
  });
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

 selectTask(task: Task, event?: MouseEvent) {
  if (event && event.type !== 'dblclick') {
    return;
  }

  const findTaskRecursive = (list: Task[], taskId: string): Task | null => {
    for (let t of list) {
      if (t.id === taskId) return t;
      if (t.subtasks && t.subtasks.length > 0) {
        const found = findTaskRecursive(t.subtasks, taskId);
        if (found) return found;
      }
    }
    return null;
  };

  let originalTask = findTaskRecursive(this.allTasks, task.id);

  if (!originalTask) {
    for (let panel of this.sectionPanels) {
      const found = findTaskRecursive(panel.tasks, task.id);
      if (found) {
        originalTask = found;
        break;
      }
    }
  }

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

 moveTaskToCategory(categoryId: number, panelIndex?: number) {
  if (this.selectedTask) {
    this.selectedTask.categoryId = categoryId;
    const categoryDetails = this.CategoryService.getCategoryDetails(categoryId);
    this.selectedTask.list = categoryDetails?.name?.toLowerCase() || 'custom';

    // Agar panelIndex diya gaya hai, panel tasks array me update karein
    if (panelIndex !== undefined) {
      const panelTasks = this.sectionPanels[panelIndex].tasks;
      const index = panelTasks.indexOf(this.selectedTask);
      if (index > -1) panelTasks.splice(index, 1); // remove from panel
    } else {
      // Normal tasks ke liye
      const index = this.unpinnedTasks.indexOf(this.selectedTask);
      if (index > -1) this.unpinnedTasks.splice(index, 1);
    }

    this.getTasksByCategoryId(categoryId);
    this.saveTasks();
  } else {
    this.selectedCategoryDetails = this.CategoryService.getCategoryDetails(categoryId);
    this.selectedCategory = (this.selectedCategoryDetails?.name?.toLowerCase() as any) || 'inbox';
  }
}


  addTaskToSection(panelIndex: number) {
  const panel = this.sectionPanels[panelIndex];
  if (!panel.taskText?.trim()) return;

  const newTask: Task = {
    id: this.generateId(),
    text: panel.taskText.trim(),
    completed: false,
    priority: 'none',
    subtasks: [],
    type: 'task',
    pinned: false,
    list: 'custom',
    categoryId: this.selectedCategoryDetails.id,
    dueDate: null,
    tags: this.selectedTag ? [this.selectedTag] : [],
  };

  panel.tasks.push(newTask);
  this.allTasks.push(newTask);
  this.saveTasks();
  panel.taskText = ''; // input clear
}


  updatePanelTask(panelIndex: number, taskIndex: number, newText: string) {
  this.sectionPanels[panelIndex].tasks[taskIndex].text = newText;
  this.saveSectionPanels();  // localStorage update
}

updateTask(task: Task) {
  // agar text khali ho gaya toh ignore karo
  if (!task.text || !task.text.trim()) return;

  // changes ko localStorage me save karo
  this.saveTasks();
}
deletePanel(index: number) {
  this.sectionPanels.splice(index, 1);
  this.saveSectionPanels();
  this.manageNotSectionedPanel();
}

// Add task to Not Sectioned panel
addTaskToNotSectioned() {
  if (!this.notSectionedPanel?.taskText?.trim()) return;

  const newTask: Task = {
    id: this.generateId(),
    text: this.notSectionedPanel.taskText.trim(),
    completed: false,
    priority: this.selectedPriority,
    subtasks: [],
    type: 'task',
    pinned: false,
    list: this.selectedCategory,
    categoryId: this.selectedCategoryDetails.id,
    tags: this.selectedTag ? [this.selectedTag] : [],
  };

  // Due date logic
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

  // Always add to allTasks array for persistence
  this.allTasks.push(newTask);
  
  // Also add to Not Sectioned panel for display
  this.notSectionedPanel.tasks.push(newTask);
  
  this.notSectionedPanel.taskText = '';
  this.saveTasks();
}

// Update task text method
updateTaskText(task: Task) {
  if (!task.text || !task.text.trim()) return;
  
  // Update in allTasks array
  const taskIndex = this.allTasks.findIndex(t => t.id === task.id);
  if (taskIndex !== -1) {
    this.allTasks[taskIndex].text = task.text.trim();
  }
  
  // Update in notSectionedPanel if it exists
  if (this.notSectionedPanel) {
    const panelTaskIndex = this.notSectionedPanel.tasks.findIndex(t => t.id === task.id);
    if (panelTaskIndex !== -1) {
      this.notSectionedPanel.tasks[panelTaskIndex].text = task.text.trim();
    }
  }
  
  // Update in section panels
  this.sectionPanels.forEach(panel => {
    const panelTaskIndex = panel.tasks.findIndex(t => t.id === task.id);
    if (panelTaskIndex !== -1) {
      panel.tasks[panelTaskIndex].text = task.text.trim();
    }
  });
  
  this.saveTasks();
}

// Tag filtering methods
filterTasksByTag(tasks: Task[], tag: string): Task[] {
  return tasks.filter(task => {
    // Check if task has the tag
    if (task.tags && task.tags.some(t => t.toLowerCase() === tag.toLowerCase())) {
      return true;
    }
    
    // Check if any subtask has the tag
    if (task.subtasks && task.subtasks.some(subtask => 
      subtask.tags && subtask.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    )) {
      return true;
    }
    
    return false;
  });
}

applyTagFilter() {
  // Re-apply the current category filter with tag filtering
  if (this.selectedCategoryDetails && this.selectedCategoryDetails.id) {
    this.getTasksByCategoryId(this.selectedCategoryDetails.id);
  }
}

}
