import { Component, signal, output, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.css'
})
export class CookieBannerComponent {
  accepted = output<void>();
  showDetails = signal(false);
  private platformId = inject(PLATFORM_ID);

  accept() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie-consent', 'accepted');
    }
    this.accepted.emit();
  }

  decline() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie-consent', 'declined');
    }
    this.accepted.emit();
  }

  toggle() { this.showDetails.update(v => !v); }
}
