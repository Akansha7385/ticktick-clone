import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { TaskService } from '../services/task.service';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../services/category.service';
import { CategoryMenu } from "../category-menu/category-menu";


@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [CommonModule, ButtonModule, CategoryMenu],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() visible: boolean = false; 
  // visible = false;
  @Output()onSideBarToggle = new EventEmitter<void>();
  @Output()onCategoryUpdate = new EventEmitter<void>();
  @ViewChildren(CategoryMenu) categoryMenus!: QueryList<CategoryMenu>;

categoryList:any=[];
  constructor(private TaskService : TaskService, private CategoryService: CategoryService){
    this.CategoryService.categoryListSubject.subscribe((res:any)=>{
      this.categoryList = res;
    })
  }

  updateSelectedCategory(id:number){
    this.CategoryService.updateSelectedCategory({id:id});
  }
  toggleDrawer() {
    this.visible = !this.visible;
    this.onSideBarToggle.emit();
  }
  addCategory() {
  const categoryName = prompt("Enter new category name:");
  if (categoryName && categoryName.trim() !== "") {
    const newCategory = {
      id: Date.now(), 
      name: categoryName.trim()
    };
    this.CategoryService.addNewCategory(newCategory);
  }
}
  openCategoryMenu(event: Event, category: any) {
    const menu = this.categoryMenus.find(m => m.category.id === category.id);
    if (menu) {
      menu.toggle(event);
    }
  }

handleDeleteCategory(categoryId: number) {
  const confirmDelete = confirm('Are you sure you want to delete this category?');
  if (!confirmDelete) return;

  // 🔹 Update in CategoryService
  this.CategoryService.removeNewCategory({ id: categoryId });

  // 🔹 Update local categoryList from service
  this.CategoryService.categoryListSubject.subscribe(res => {
    this.categoryList = res;
  });
}


handlePinAllTasks(categoryId: number) {
  this.TaskService.pinAllTasksOfCategory(categoryId);
}


}
