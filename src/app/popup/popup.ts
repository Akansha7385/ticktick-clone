  import { Component, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { MenuModule } from 'primeng/menu';
  import { ButtonModule } from 'primeng/button';
  import { MenuItem } from 'primeng/api';

  @Component({
    selector: 'app-popup',
    standalone: true,
    imports: [CommonModule, MenuModule, ButtonModule],
    templateUrl: './popup.html',
    styleUrl: './popup.scss'
  })
  export class Popup {
    @Input() customCategories: {id: number, name: string}[] = [];
    @Output() prioritySelected = new EventEmitter<'high' | 'medium' | 'low' | 'none'>();
    @Output() categorySelected = new EventEmitter<number>(); // ID of category
    @Output() openTags = new EventEmitter<void>();

    items: MenuItem[] = [];

    ngOnInit() {
      this.buildMenu();
    }

    ngOnChanges(changes: SimpleChanges) {
  if (changes['customCategories']) {
    this.buildMenu();
  }
}


    buildMenu() {
     const defaultCategoryIds = [1, 3];

const categoryItems = [
  { label: 'Inbox', icon: 'pi pi-inbox', command: () => this.setCategory(3) },
  { label: 'Today', icon: 'pi pi-calendar', command: () => this.setCategory(1) },
  ...this.customCategories
    .filter(cat => !defaultCategoryIds.includes(cat.id)) // exclude duplicates
    .map(cat => ({
      label: cat.name,
      icon: 'pi pi-folder',
      command: () => this.setCategory(cat.id)
    }))
];

      this.items = [
        {
          label: 'Priority',
          icon: 'pi pi-flag',
          items: [
            { label: 'High', icon: 'pi pi-flag-fill text-red-500', command: () => this.setPriority('high') },
            { label: 'Medium', icon: 'pi pi-flag-fill text-yellow-500', command: () => this.setPriority('medium') },
            { label: 'Low', icon: 'pi pi-flag-fill text-blue-500', command: () => this.setPriority('low') },
            { label: 'None', icon: 'pi pi-flag-fill text-black', command: () => this.setPriority('none') }
          ]
        },
        {
          label: 'Categories',
          icon: 'pi pi-folder',
          items: categoryItems
        },
        {
          label: 'Tags',
          icon: 'pi pi-tags',
          items: [
            { label: 'Add Tags', command: () => this.openTags.emit() }
          ]
        }
      ];
    }

    setPriority(priority: 'high' | 'medium' | 'low' | 'none') {
      this.prioritySelected.emit(priority);
    }

    setCategory(categoryId: number) {
      this.categorySelected.emit(categoryId);
    }
  }
