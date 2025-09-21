import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private allTagsSubject = new BehaviorSubject<string[]>([]);
  allTags$ = this.allTagsSubject.asObservable();

  private selectedTagSubject = new BehaviorSubject<string | null>(null);
  selectedTag$ = this.selectedTagSubject.asObservable();

  private tasksUpdatedSubject = new BehaviorSubject<boolean>(false);
  tasksUpdated$ = this.tasksUpdatedSubject.asObservable();

  constructor() {
    // Load tags from localStorage
    const savedTags = localStorage.getItem('allTags');
    if (savedTags) {
      this.allTagsSubject.next(JSON.parse(savedTags));
    } else {
      // Initialize with default tags
      const defaultTags = ["work", "personal", "urgent", "study"];
      this.allTagsSubject.next(defaultTags);
      this.saveTagsToStorage();
    }
  }

  get allTags(): string[] {
    return this.allTagsSubject.value;
  }

  get selectedTag(): string | null {
    return this.selectedTagSubject.value;
  }

  // Add a new tag to the global list
  addTag(tag: string): void {
    if (!tag.trim()) return;
    
    const trimmedTag = tag.trim().toLowerCase();
    const currentTags = this.allTags;
    
    // Check if tag already exists (case insensitive)
    if (!currentTags.some(t => t.toLowerCase() === trimmedTag)) {
      const updatedTags = [...currentTags, tag.trim()];
      this.allTagsSubject.next(updatedTags);
      this.saveTagsToStorage();
    }
  }

  // Add multiple tags at once
  addTags(tags: string[]): void {
    const currentTags = this.allTags;
    const newTags: string[] = [];
    
    tags.forEach(tag => {
      const trimmedTag = tag.trim().toLowerCase();
      if (tag.trim() && !currentTags.some(t => t.toLowerCase() === trimmedTag)) {
        newTags.push(tag.trim());
      }
    });
    
    if (newTags.length > 0) {
      const updatedTags = [...currentTags, ...newTags];
      this.allTagsSubject.next(updatedTags);
      this.saveTagsToStorage();
    }
  }

  // Remove a tag from the global list and all tasks
  removeTag(tag: string): void {
    try {
      const currentTags = this.allTags;
      const updatedTags = currentTags.filter(t => t.toLowerCase() !== tag.toLowerCase());
      this.allTagsSubject.next(updatedTags);
      this.saveTagsToStorage();
      
      // Remove the tag from all tasks in localStorage
      this.removeTagFromAllTasks(tag);
    } catch (error) {
      console.error('Error removing tag:', error);
      throw error; // Re-throw to be caught by the calling method
    }
  }

  // Remove a tag from all tasks in localStorage
  private removeTagFromAllTasks(tag: string): void {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      const updatedTasks = this.removeTagFromTasks(tasks, tag);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      // Emit event to notify components that tasks have been updated
      this.tasksUpdatedSubject.next(true);
    }
  }

  // Recursively remove tag from tasks and subtasks
  private removeTagFromTasks(tasks: any[], tag: string): any[] {
    return tasks.map(task => {
      const updatedTask = { ...task };
      
      // Remove tag from current task
      if (updatedTask.tags && Array.isArray(updatedTask.tags)) {
        updatedTask.tags = updatedTask.tags.filter((t: string) => 
          t.toLowerCase() !== tag.toLowerCase()
        );
      }
      
      // Remove tag from subtasks recursively
      if (updatedTask.subtasks && Array.isArray(updatedTask.subtasks)) {
        updatedTask.subtasks = this.removeTagFromTasks(updatedTask.subtasks, tag);
      }
      
      return updatedTask;
    });
  }

  // Select a tag for filtering
  selectTag(tag: string | null): void {
    this.selectedTagSubject.next(tag);
  }

  // Get all unique tags from all tasks
  extractTagsFromTasks(tasks: any[]): string[] {
    const allTaskTags: string[] = [];
    
    const extractFromTask = (task: any) => {
      if (task.tags && Array.isArray(task.tags)) {
        allTaskTags.push(...task.tags);
      }
      if (task.subtasks && Array.isArray(task.subtasks)) {
        task.subtasks.forEach((subtask: any) => extractFromTask(subtask));
      }
    };
    
    tasks.forEach(task => extractFromTask(task));
    
    // Return unique tags
    return [...new Set(allTaskTags)];
  }

  // Update tags from tasks (call this when tasks are updated)
  updateTagsFromTasks(tasks: any[]): void {
    const taskTags = this.extractTagsFromTasks(tasks);
    this.addTags(taskTags);
  }

  private saveTagsToStorage(): void {
    localStorage.setItem('allTags', JSON.stringify(this.allTags));
  }

  // Manually trigger tasks update event
  triggerTasksUpdate(): void {
    this.tasksUpdatedSubject.next(true);
  }
}
