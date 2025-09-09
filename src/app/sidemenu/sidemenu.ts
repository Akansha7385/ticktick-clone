// sidemenu.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SearchPage } from '../search-page/search-page';
import { NotificationPage } from '../notification-page/notification-page';
import { MoreComponent } from '../more/more';
import { Shortcut } from '../shortcut/shortcut';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule
  ],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.css',
})
export class Sidemenu {
  selectedIcon: string = 'pi-check';
  searchVisible = false;
  notificationVisible = false;
  moreVisible = false;
  shortcutVisible = false;

  openSearchDialog() {
    this.searchVisible = true;
  }

  onSearchClose() {
    this.searchVisible = false;
    if (this.selectedIcon === 'pi-search') this.selectedIcon = '';
  }

  openNotificationDialog() {
    this.notificationVisible = true;
  }

  onNotificationClose() {
    this.notificationVisible = false;
    if (this.selectedIcon === 'pi-bell') this.selectedIcon = '';
  }

  openMoreDialog() {
    this.moreVisible = true;
  }

  onMoreClose() {
    this.moreVisible = false;
    if (this.selectedIcon === 'pi-question-circle') this.selectedIcon = '';
  }

  openShortcutDialog() {
    this.shortcutVisible = true;
  }

  selectAndReload() {
    this.selectedIcon = 'pi-refresh';
    setTimeout(() => {
      location.reload();
    }, 150); 
  }
}
