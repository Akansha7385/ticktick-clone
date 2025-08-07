import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { NgFor } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Sidemenu } from '../sidemenu/sidemenu';


@Component({
  selector: 'app-today',
  standalone:true,
  imports: [InputTextModule, FormsModule, Sidebar, AutoCompleteModule, ButtonModule, AccordionModule,  CheckboxModule, Sidemenu],
  templateUrl: './today.html',
  styleUrl: './today.css'
})
export class Today {

 value:string = '';
  taskText: string = '';
  taskCategory: string = '';
  categoryOptions: string[] = ['Pinned', 'Completed'];
  filteredCategories: string[] = [];

  filterCategories(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCategories = this.categoryOptions.filter(option =>
      option.toLowerCase().includes(query)
    );
  }

  addTask() {
    console.log('Task:', this.taskText, 'Category:', this.taskCategory);
    // Add your logic to display or store the task
  }

   categories = [
    { key: 'pinned', name: ' Pinned' },
    { key: 'unpinned', name: ' Unpinned' },
    { key: 'completed', name: ' Completed' }
  ];

  selectedCategories: any[] = [];
  
}
