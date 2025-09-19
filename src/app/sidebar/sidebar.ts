import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from '../services/task.service';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../services/category.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  providers: [MessageService, ConfirmationService],
})
export class Sidebar {
  @Input() visible: boolean = false;
  // visible = false;
  @Output() onSideBarToggle = new EventEmitter<void>();
  @Output() onCategoryUpdate = new EventEmitter<void>();

  categoryList: any = [];
  showCategoryDialog = false;
  newCategoryName = '';

  constructor(
    private TaskService: TaskService,
    private CategoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.CategoryService.categoryListSubject.subscribe((res: any) => {
      this.categoryList = res;
    });
  }

  updateSelectedCategory(id: number) {
    this.CategoryService.updateSelectedCategory({ id: id });
  }
  toggleDrawer() {
    this.visible = !this.visible;
    this.onSideBarToggle.emit();
  }
  addCategory() {
    this.showCategoryDialog = true;
  }

  saveCategory() {
    if (this.newCategoryName.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Category name cannot be empty!',
      });
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: this.newCategoryName.trim(),
    };
    this.CategoryService.addNewCategory(newCategory);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Category added successfully!',
    });

    this.newCategoryName = '';
    this.showCategoryDialog = false;
  }

  handleDeleteCategory(categoryId: number) {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.CategoryService.removeNewCategory({ id: categoryId });
        this.messageService.add({
          severity: 'info',
          summary: 'Deleted',
          detail: 'Category deleted successfully!',
        });
      },
    });
  }
}
