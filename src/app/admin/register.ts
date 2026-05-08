import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <h1>Admin Registrierung</h1>
      <form (submit)="$event.preventDefault(); submit()">
        <label>Zugangscode
          <input type="text" [(ngModel)]="code" name="code" required />
        </label>
        <label>Username
          <input type="text" [(ngModel)]="username" name="username" autocomplete="username" required />
        </label>
        <label>Passwort
          <input type="password" [(ngModel)]="password" name="password" autocomplete="new-password" minlength="8" required />
        </label>
        <button type="submit" [disabled]="loading()">{{ loading() ? 'Registrieren…' : 'Account anlegen' }}</button>
      </form>
      @if (error()) { <p class="err">{{ error() }}</p> }
      @if (success()) { <p class="ok">Account angelegt. <a routerLink="/admin/login">Zum Login</a></p> }
      <p class="hint">Bereits Account? <a routerLink="/admin/login">Login</a></p>
    </section>
  `,
  styles: [`
    .auth-shell{max-width:380px;margin:3rem auto;padding:1.75rem;background:#fff;border:1px solid var(--c-border);border-radius:14px;display:flex;flex-direction:column;gap:1rem}
    h1{margin:0;font-size:1.25rem;color:var(--c-primary)}
    form{display:flex;flex-direction:column;gap:.85rem}
    label{display:flex;flex-direction:column;gap:.3rem;font-size:.85rem;color:var(--c-muted)}
    input{padding:.55rem .7rem;border:1px solid var(--c-border);border-radius:8px;font-size:.95rem;font-family:inherit}
    button{padding:.65rem;background:var(--c-primary);color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer}
    button:disabled{opacity:.6;cursor:wait}
    .err{color:#b3261e;font-size:.85rem;margin:0}
    .ok{color:#2d7a4f;font-size:.85rem;margin:0}
    .hint{font-size:.8rem;color:var(--c-muted);margin:0;text-align:center}
    .hint a{color:var(--c-primary)}
  `]
})
export class AdminRegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  code = '';
  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  submit() {
    this.error.set(null);
    this.success.set(false);
    if (!this.code || !this.username || !this.password) {
      this.error.set('Bitte alle Felder ausfüllen.');
      return;
    }
    this.loading.set(true);
    this.auth.register({ code: this.code, username: this.username, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.auth.login({ username: this.username, password: this.password }).subscribe({
          next: () => this.router.navigate(['/stats']),
          error: () => {
            this.success.set(true);
          },
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.error || 'Registrierung fehlgeschlagen.');
      },
    });
  }
}
