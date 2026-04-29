import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const MILIEUS = [
  { name: 'Konservativ-Etabliert', pct: '10 %', color: '#1a3a5c' },
  { name: 'Liberal-Intellektuell', pct: '7 %',  color: '#2d7a4f' },
  { name: 'Performer',             pct: '8 %',  color: '#e8632a' },
  { name: 'Expeditiv',             pct: '9 %',  color: '#7b3fa0' },
  { name: 'Sozial-Ökologisch',     pct: '7 %',  color: '#3a8fbf' },
  { name: 'Adaptiv-Pragmatisch',   pct: '12 %', color: '#c0873d' },
  { name: 'Bürgerliche Mitte',     pct: '13 %', color: '#5a8fa0' },
  { name: 'Traditionell',          pct: '13 %', color: '#7a7060' },
  { name: 'Prekär',                pct: '9 %',  color: '#8b5e5e' },
  { name: 'Hedonistisch',          pct: '15 %', color: '#c04a7a' },
];

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.html',
  styleUrl: './info.css'
})
export class InfoComponent {
  milieus = MILIEUS;
  constructor(private router: Router) {}
  start() { this.router.navigate(['/umfrage']); }
}
