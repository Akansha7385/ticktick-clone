import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-sidebar',
  standalone:true,
  imports: [DrawerModule, ButtonModule, AvatarModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  visible: boolean = false;

  closeCallback(event: any): void {
    this.visible = false;
  }
}
