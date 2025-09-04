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
import { ViewChangeLog } from './view-change-log/view-change-log';
import { HelpCenter } from './help-center/help-center';
import { Completed } from './completed/completed';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'today', component: Today },
  { path: 'task-menu', component: TaskMenu },
  { path: 'tags', component: Tags },
   { path: 'inbox', component: Inbox },
   { path: 'next7Days', component: Next7Days },
   { path: 'welcome', component: Welcome },
   { path: 'work', component: Work },
   { path: 'view-change-log', component: ViewChangeLog },
   { path: 'help-center', component: HelpCenter },
   { path: 'completed', component: Completed },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
   { path: '**', component: Error }
];
