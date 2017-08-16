import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { DashboardComponent } from './dashboard';
import { NoContentComponent } from './no-content';
import { AuthGuard } from './core/auth-guard.service';
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard] },
  { path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    canLoad: [AuthGuard]},
  { path: 'home',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
