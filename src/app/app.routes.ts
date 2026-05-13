import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./verify/verify').then(m => m.VerifyComponent),
    title: 'Anmeldung · Jugend-Sinus-Milieus'
  },
  {
    path: 'info',
    loadComponent: () => import('./info/info').then(m => m.InfoComponent),
    title: 'Info · Jugend-Sinus-Milieus',
    canActivate: [authGuard]
  },
  {
    path: 'umfrage',
    loadComponent: () => import('./survey/survey').then(m => m.SurveyComponent),
    title: 'Umfrage · Jugend-Sinus-Milieus',
    canActivate: [authGuard]
  },
  {
    path: 'impressum',
    loadComponent: () => import('./impressum/impressum').then(m => m.ImpressumComponent),
    title: 'Impressum · Jugend-Sinus-Milieus'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login').then(m => m.AdminLoginComponent),
    title: 'Login · Jugend-Sinus-Milieus'
  },
  {
    path: 'admin/register',
    loadComponent: () => import('./admin/register').then(m => m.AdminRegisterComponent),
    title: 'Registrieren · Jugend-Sinus-Milieus'
  },
  {
    path: 'stats',
    loadComponent: () => import('./admin/stats').then(m => m.AdminStatsComponent),
    title: 'Stats · Jugend-Sinus-Milieus',
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: '' }
];
