import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SearchPage } from "../search-page/search-page";
import { NotificationPage } from '../notification-page/notification-page';
import { MoreComponent } from '../more/more'; // ✅ Import your MoreComponent
import { Shortcut } from '../shortcut/shortcut'; // ✅ Import Shortcut

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    SearchPage,
    NotificationPage,
    MoreComponent,   // ✅ Add here
    Shortcut         // ✅ Add here
  ],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.css'
})
export class Sidemenu {
  selectedIcon: string = 'pi-check'; 
  searchVisible: boolean = false;
  notificationVisible: boolean = false;
  moreVisible: boolean = false;
  shortcutVisible: boolean = false;

  openSearchDialog() {
    this.searchVisible = true;
  }

  openNotificationDialog() {
    this.notificationVisible = true;
  }

  openMoreDialog() {
    this.moreVisible = true;
  }

  openShortcutDialog() {
    this.shortcutVisible = true;
  }
}
