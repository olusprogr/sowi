import { Injectable, inject, signal, PLATFORM_ID, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';

const TOKEN_KEY = 'sowi_admin_token';

interface JwtPayload {
  sub: string;
  username: string;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private base = environment.apiUrl;

  private tokenSignal = signal<string | null>(this.readToken());

  isLoggedIn = computed(() => {
    const t = this.tokenSignal();
    if (!t) return false;
    const payload = this.decode(t);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  });

  username = computed(() => {
    const t = this.tokenSignal();
    if (!t) return null;
    return this.decode(t)?.username ?? null;
  });

  register(payload: { code: string; username: string; password: string }): Observable<{ _id: string; username: string }> {
    return this.http.post<{ _id: string; username: string }>(`${this.base}/admin/register`, payload);
  }

  login(payload: { username: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.base}/admin/login`, payload).pipe(
      tap((res) => this.setToken(res.token)),
    );
  }

  logout() {
    this.setToken(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private setToken(token: string | null) {
    this.tokenSignal.set(token);
    if (!isPlatformBrowser(this.platformId)) return;
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  private readToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) return null;
    const payload = this.decode(t);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return t;
  }

  private decode(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
