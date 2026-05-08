import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="dot" style="background:#1a3a5c"></span>
          <span class="dot" style="background:#e8632a"></span>
          <span class="dot" style="background:#2d7a4f"></span>
          <span>Sinus-Milieus Umfrage</span>
        </div>
        <nav class="footer-links">
          <a routerLink="/">Start</a>
          <a routerLink="/info">Info</a>
          <a routerLink="/impressum">Impressum &amp; Datenschutz</a>
        </nav>
        <p class="footer-copy">© 2026 Schulprojekt Sozialwissenschaften · Freiherr-vom-Stein-Gymnasium Münster</p>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer{background:#fff;border-top:1px solid var(--c-border);padding:2rem 1.5rem 1.5rem;margin-top:auto}
    .footer-inner{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:.85rem;align-items:center;text-align:center}
    .footer-brand{display:flex;align-items:center;gap:.35rem;font-weight:700;font-size:.875rem;color:var(--c-primary)}
    .dot{width:9px;height:9px;border-radius:50%;display:inline-block}
    .footer-links{display:flex;flex-wrap:wrap;gap:.25rem 1.5rem;justify-content:center}
    .footer-links a{color:var(--c-muted);font-size:.8rem;text-decoration:none;transition:color .15s}
    .footer-links a:hover{color:var(--c-primary)}
    .footer-copy{font-size:.75rem;color:var(--c-muted)}
  `]
})
export class FooterComponent {}
