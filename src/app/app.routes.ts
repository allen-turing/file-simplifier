import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { environment } from '../environments/environment';

export const routes: Routes = environment.requireLogin ? [
  { path: '', component: Login },
  { path: 'home', component: Home },
] : [
  { path: '', component: Home },
  { path: 'home', component: Home },
];
      