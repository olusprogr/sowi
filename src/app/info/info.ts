import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const MILIEUS = [
  { name: 'Konservativ-Bürgerliche',         pct: '10 %', color: '#5a8fa0' },
  { name: 'Adaptiv-Pragmatische',            pct: '25 %', color: '#c0873d' },
  { name: 'Prekäre',                         pct: '9 %',  color: '#8b5e5e' },
  { name: 'Materialistische Hedonisten',     pct: '13 %', color: '#c04a7a' },
  { name: 'Experimentalistische Hedonisten', pct: '14 %', color: '#d97706' },
  { name: 'Sozialökologische',               pct: '15 %', color: '#3a8fbf' },
  { name: 'Expeditive',                      pct: '14 %', color: '#7b3fa0' },
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
