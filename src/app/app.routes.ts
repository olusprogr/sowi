import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./verify/verify').then(m => m.VerifyComponent),
    title: 'Anmeldung · Sinus-Milieus'
  },
  {
    path: 'info',
    loadComponent: () => import('./info/info').then(m => m.InfoComponent),
    title: 'Info · Sinus-Milieus',
    canActivate: [authGuard]
  },
  {
    path: 'umfrage',
    loadComponent: () => import('./survey/survey').then(m => m.SurveyComponent),
    title: 'Umfrage · Sinus-Milieus',
    canActivate: [authGuard]
  },
  {
    path: 'impressum',
    loadComponent: () => import('./impressum/impressum').then(m => m.ImpressumComponent),
    title: 'Impressum · Sinus-Milieus'
  },
  { path: '**', redirectTo: '' }
];
