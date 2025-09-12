import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TaskDetail } from './task-detail/task-detail';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'task/:id', component: TaskDetail},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: Error },
];
