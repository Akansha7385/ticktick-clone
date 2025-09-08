import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';
import { TaskService } from '../services/task.service';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../services/category.service';


@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [CommonModule,ButtonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() visible: boolean = false; 
  // visible = false;
  @Output()onSideBarToggle = new EventEmitter<void>();
  @Output()onCategoryUpdate = new EventEmitter<void>();
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

}
