import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SearchPage } from "../search-page/search-page";

@Component({
  selector: 'app-sidemenu',
  imports: [ButtonModule, CommonModule, DialogModule, SearchPage],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.css'
})
export class Sidemenu {
selectedIcon: string = 'pi-check'; 

searchVisible: boolean = false;

  openSearchDialog() {
    this.searchVisible = true;
  }


}
