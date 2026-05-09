import { Component, signal, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { CookieBannerComponent } from './cookie/cookie-banner';
import { FooterComponent } from './shared/footer';
import { AuthService } from './shared/auth.service';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, CookieBannerComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showCookie = signal(false);
  showNav = signal(false);
  private platformId = inject(PLATFORM_ID);
  auth = inject(AuthService);
  private theme = inject(ThemeService);

  constructor(private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) this.showCookie.set(true);
    }
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.showNav.set(false));
  }

  onCookieDone() { this.showCookie.set(false); }
  toggleNav() { this.showNav.update(v => !v); }
}
