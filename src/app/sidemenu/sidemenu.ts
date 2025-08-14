import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SearchPage } from "../search-page/search-page";
import { NotificationPage } from '../notification-page/notification-page';
import { MoreComponent } from '../more/more';
import { Shortcut } from '../shortcut/shortcut';
import { Home } from '../home/home'; // ✅ Import Home component

@Component({
  selector: 'app-sidemenu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    SearchPage,
    NotificationPage,
    MoreComponent,
    Shortcut,
    Home // ✅ Add Home to imports
  ],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.css'
})
export class Sidemenu {
  selectedIcon: string = 'pi-check';
  searchVisible = false;
  notificationVisible = false;
  moreVisible = false;
  shortcutVisible = false;
  homeVisible = false; // ✅ Added

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

  openHomePage() { // ✅ Added
    this.homeVisible = true;
  }
}
