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
  dueDate?: string | null;
  list?: string | number;
  pinned?: boolean;
  description?: string;
  showSubtaskInput?: boolean;
  deleted?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  selectedCategory = new BehaviorSubject(3);

  // 🔹 Default Categories
 private defaultCategories = [
  { name: 'Inbox', id: 3 },
  { name: 'Today', id: 1 },
  { name: 'Next 7 Days', id: 2 },
  { name: 'Completed', id: 4 },
  { name: 'Trash', id: 5 }
];


  categoryList: any[] = [];
  categoryListSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    // 🔹 Load Categories from localStorage
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categoryList = JSON.parse(savedCategories);
      
      // Ensure all default categories are present (for new additions like Trash)
      this.defaultCategories.forEach(defaultCat => {
        if (!this.categoryList.find(cat => cat.id === defaultCat.id)) {
          this.categoryList.push(defaultCat);
        }
      });
    } else {
      this.categoryList = [...this.defaultCategories];
    }
    
    // Save the updated category list
    localStorage.setItem('categories', JSON.stringify(this.categoryList));
    this.categoryListSubject.next(this.categoryList);

    // 🔹 Load Tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasksSubject.next(JSON.parse(savedTasks));
    }
  }

  get tasks(): Task[] {
    return this.tasksSubject.value;
  }

  updateSelectedCategory(config: any) {
    this.selectedCategory.next(config.id);
  }

  addNewCategory(categoryConfig: any) {
    this.categoryList.push(categoryConfig);
    this.categoryListSubject.next(this.categoryList);

    // 🔹 Save updated list in localStorage
    localStorage.setItem('categories', JSON.stringify(this.categoryList));
  }
  getCategoryDetails(id: number) {
  return this.categoryList.find(item => item.id === id) || {};
}


removeNewCategory(categoryConfig: any) {
  const isDefault = this.defaultCategories.some(cat => cat.id === categoryConfig.id);
  if (isDefault) return;

  this.categoryList = this.categoryList.filter(item => item.id !== categoryConfig.id);
  this.categoryListSubject.next(this.categoryList);
  localStorage.setItem('categories', JSON.stringify(this.categoryList));
}


  // 🔹 Reset to default categories (optional helper)
  resetCategories() {
    this.categoryList = [...this.defaultCategories];
    this.categoryListSubject.next(this.categoryList);
    localStorage.setItem('categories', JSON.stringify(this.categoryList));
  }
  deleteCategory(categoryId: number) {
  this.categoryListSubject.next(
    this.categoryListSubject.getValue().filter(c => c.id !== categoryId)
  );
}
getTaskById(id: string): Task | undefined {
  return this.tasks.find(t => t.id === id);
} 


}
