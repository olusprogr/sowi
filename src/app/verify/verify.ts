import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css'
})
export class VerifyComponent {
  mode = signal<'choice' | 'email' | 'anon'>('choice');
  email = signal('');
  error = signal('');
  loading = signal(false);

  constructor(private router: Router) {}

  chooseEmail() { this.mode.set('email'); }
  chooseAnon() {
    sessionStorage.setItem('verified', 'anonym');
    this.router.navigate(['/info']);
  }

  submit() {
    const val = this.email().trim().toLowerCase();
    if (!val.endsWith('@stein.ms.de')) {
      this.error.set('Bitte nutze deine Schul-E-Mail (@stein.ms.de).');
      return;
    }
    if (!/^[^\s@]+@stein\.ms\.de$/.test(val)) {
      this.error.set('Ungültige E-Mail-Adresse.');
      return;
    }
    this.error.set('');
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
      sessionStorage.setItem('verified', val);
      this.router.navigate(['/info']);
    }, 800);
  }

  onInput(v: string) {
    this.email.set(v);
    if (this.error()) this.error.set('');
  }

  back() { this.mode.set('choice'); }
}
