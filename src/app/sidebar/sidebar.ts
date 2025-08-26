import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [DrawerModule, ButtonModule, AvatarModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  visible: boolean = false;

  closeCallback(event: any): void {
    this.visible = false;
  }
}
