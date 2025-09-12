import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TaskMenu } from './task-menu/task-menu';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'task/:id', component: TaskMenu },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
   { path: '**', component: Error }
];
