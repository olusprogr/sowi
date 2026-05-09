import { Injectable, inject, signal, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'auto' | 'light' | 'dark';
const STORAGE_KEY = 'sowi_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  mode = signal<ThemeMode>(this.readMode());
  resolved = signal<'light' | 'dark'>('light');

  constructor() {
    if (!this.isBrowser) return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const m = this.mode();
      const dark = m === 'dark' || (m === 'auto' && mql.matches);
      const next = dark ? 'dark' : 'light';
      this.resolved.set(next);
      document.documentElement.dataset['theme'] = next;
    };

    effect(() => {
      this.mode();
      update();
    });

    mql.addEventListener('change', () => {
      if (this.mode() === 'auto') update();
    });
  }

  setMode(mode: ThemeMode) {
    this.mode.set(mode);
    if (this.isBrowser) localStorage.setItem(STORAGE_KEY, mode);
  }

  toggle() {
    const next: ThemeMode = this.resolved() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  private readMode(): ThemeMode {
    if (!this.isBrowser) return 'auto';
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'auto' || stored === 'light' || stored === 'dark') return stored;
    return 'auto';
  }
}
