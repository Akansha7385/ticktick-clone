import { Component, EventEmitter, Input, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Menu, MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [MenuModule],
  templateUrl: './category-menu.html',
  styleUrls: ['./category-menu.css']
})
export class CategoryMenu implements OnChanges {
  @ViewChild('menu') menu!: Menu;
  @Input() category: any; // current category
  @Output() deleteCategory = new EventEmitter<number>();
  @Output() pinAllTasks = new EventEmitter<number>();

  items: MenuItem[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] && this.category) {
      this.items = [
        {
          label: 'Pin All Tasks',
          icon: 'pi pi-thumbtack',
          command: () => this.pinAllTasks.emit(this.category.id)
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => this.deleteCategory.emit(this.category.id)
        }
      ];
    }
  }

  toggle(event: Event) {
    this.menu.toggle(event);
  }
}
