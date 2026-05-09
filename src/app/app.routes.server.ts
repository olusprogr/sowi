import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'info', renderMode: RenderMode.Prerender },
  { path: 'umfrage', renderMode: RenderMode.Prerender },
  { path: 'impressum', renderMode: RenderMode.Prerender },
  { path: 'admin/login', renderMode: RenderMode.Prerender },
  { path: 'admin/register', renderMode: RenderMode.Prerender },
  { path: 'stats', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
