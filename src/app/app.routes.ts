import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Today } from './today/today';
import { TaskMenu } from './task-menu/task-menu';
import { Tags } from './tags/tags';
import { Error } from './error/error';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'today', component: Today },
  { path: 'task-menu', component: TaskMenu },
  { path: 'tags', component: Tags },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
   { path: '**', component: Error }
];
