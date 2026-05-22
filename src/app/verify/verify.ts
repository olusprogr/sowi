import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [],
  templateUrl: './verify.html',
  styleUrl: './verify.css'
})
export class VerifyComponent {
  constructor(private router: Router) {}

  start() {
    sessionStorage.setItem('verified', 'anonym');
    this.router.navigate(['/info']);
  }
}
