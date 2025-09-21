import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService } from '../services/task.service';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from '../services/category.service';
import { TagsService } from '../services/tags.service';
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
  allTags: string[] = [];
  selectedTag: string | null = null;
  showTagDialog = false;
  newTagName = '';

  constructor(
    private TaskService: TaskService,
    private CategoryService: CategoryService,
    private TagsService: TagsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.CategoryService.categoryListSubject.subscribe((res: any) => {
      this.categoryList = res;
    });

    this.TagsService.allTags$.subscribe((tags: string[]) => {
      this.allTags = tags;
    });

    this.TagsService.selectedTag$.subscribe((tag: string | null) => {
      this.selectedTag = tag;
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
      message: 'Are you sure you want to delete this category? This will remove the category and all its tasks.',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        try {
          this.CategoryService.removeNewCategory({ id: categoryId });
          this.messageService.add({
            severity: 'info',
            summary: 'Deleted',
            detail: 'Category deleted successfully!',
          });
        } catch (error) {
          console.error('Error deleting category:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete category. Please try again.',
          });
        }
      },
      reject: () => {
        // User cancelled, do nothing
      }
    });
  }

  selectTag(tag: string) {
    this.TagsService.selectTag(tag);
  }

  clearTagFilter() {
    this.TagsService.selectTag(null);
  }

  handleDeleteTag(tag: string) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the tag "${tag}"? This will remove the tag from all tasks.`,
      header: 'Delete Tag',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        try {
          this.TagsService.removeTag(tag);
          this.messageService.add({
            severity: 'info',
            summary: 'Deleted',
            detail: `Tag "${tag}" deleted successfully!`,
          });
        } catch (error) {
          console.error('Error deleting tag:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete tag. Please try again.',
          });
        }
      },
      reject: () => {
        // User cancelled, do nothing
      }
    });
  }

  addTag() {
    this.showTagDialog = true;
  }

  saveTag() {
    if (this.newTagName.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Tag name cannot be empty!',
      });
      return;
    }

    this.TagsService.addTag(this.newTagName.trim());

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tag added successfully!',
    });

    this.newTagName = '';
    this.showTagDialog = false;
  }
}
