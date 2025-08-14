import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Shortcut } from './shortcut/shortcut';

export const routes: Routes = [
    {
        path: 'home',
        component:Home,
    },
    {
        path:'shortcut',
        component:Shortcut,
    },
    { 
        path: '',
        redirectTo: 'home', 
        pathMatch: 'full' 
    } 

];
