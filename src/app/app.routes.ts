import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./verify/verify').then(m => m.VerifyComponent) },
  { path: 'umfrage', loadComponent: () => import('./survey/survey').then(m => m.SurveyComponent) },
  { path: '**', redirectTo: '' }
];
