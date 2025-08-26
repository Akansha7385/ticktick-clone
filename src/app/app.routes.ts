import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Today } from './today/today';
import { TaskMenu } from './task-menu/task-menu';
import { Tags } from './tags/tags';
import { Error } from './error/error';
import { Inbox } from './inbox/inbox';
import { Welcome } from './welcome/welcome';
import { Next7Days } from './next7-days/next7-days';
import { Work } from './work/work';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'today', component: Today },
  { path: 'task-menu', component: TaskMenu },
  { path: 'tags', component: Tags },
   { path: 'inbox', component: Inbox },
   { path: 'welcome', component: Welcome },
   { path: 'next7Days', component: Next7Days },
   { path: 'welcome', component: Welcome },
   { path: 'work', component: Work },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
   { path: '**', component: Error }
];
