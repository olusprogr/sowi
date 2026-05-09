import { Component, inject, signal, computed, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { StatsService, SurveyStatsRecord } from '../shared/stats.service';
import { AuthService } from '../shared/auth.service';

interface ChartEntry { name: string; value: number; }
interface SeriesEntry { name: string; series: ChartEntry[]; }

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <section class="stats-shell">
      <header class="stats-head">
        <h1>Auswertung</h1>
        <button (click)="logout()">Logout</button>
      </header>

      @if (loading()) { <p>Lade…</p> }
      @if (error()) { <p class="err">{{ error() }}</p> }

      @if (!loading() && !error()) {
        <p class="meta">Insgesamt {{ records().length }} Einträge.</p>

        <div class="chart-card">
          <h2>Verteilung der Milieus</h2>
          @if (isBrowser && milieuData().length > 0) {
            <div class="chart-wrap">
              <ngx-charts-bar-vertical
                [results]="milieuData()"
                [xAxis]="true"
                [yAxis]="true"
                [showXAxisLabel]="false"
                [showYAxisLabel]="true"
                yAxisLabel="Anzahl"
                [yAxisTickFormatting]="intFormat"
                [scheme]="colorScheme">
              </ngx-charts-bar-vertical>
            </div>
          } @else {
            <p class="empty">Keine Daten.</p>
          }
        </div>

        <div class="chart-card">
          <h2>Submissions pro Tag</h2>
          @if (isBrowser && timelineData().length > 0 && timelineData()[0].series.length > 0) {
            <div class="chart-wrap">
              <ngx-charts-line-chart
                [results]="timelineData()"
                [xAxis]="true"
                [yAxis]="true"
                [showXAxisLabel]="true"
                [showYAxisLabel]="true"
                xAxisLabel="Datum"
                yAxisLabel="Anzahl"
                [autoScale]="true"
                [yAxisTickFormatting]="intFormat"
                [scheme]="colorScheme">
              </ngx-charts-line-chart>
            </div>
          } @else {
            <p class="empty">Keine Daten.</p>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .stats-shell{max-width:920px;margin:2rem auto;padding:0 1rem;display:flex;flex-direction:column;gap:1.25rem}
    .stats-head{display:flex;justify-content:space-between;align-items:center;gap:.75rem;flex-wrap:wrap}
    h1{margin:0;color:var(--c-primary);font-size:1.5rem}
    h2{margin:0 0 .75rem;font-size:1rem;color:var(--c-primary)}
    button{padding:.5rem 1rem;background:transparent;color:var(--c-primary);border:1px solid var(--c-primary);border-radius:8px;cursor:pointer;font-weight:600}
    button:hover{background:var(--c-primary);color:var(--c-surface)}
    .meta{color:var(--c-muted);font-size:.9rem;margin:0}
    .chart-card{background:var(--c-surface);border:1px solid var(--c-border);border-radius:14px;padding:1.25rem}
    .chart-wrap{width:100%;height:360px;min-width:0}
    :host ::ng-deep .ngx-charts-outer{width:100% !important}
    :host ::ng-deep .ngx-charts text{fill:var(--c-text)}
    :host ::ng-deep .ngx-charts .gridline-path{stroke:var(--c-border)}
    .err{color:var(--c-danger)}
    .empty{color:var(--c-muted);font-size:.9rem}
    @media (max-width: 640px){
      .stats-shell{margin:1rem auto;padding:0 .75rem;gap:1rem}
      h1{font-size:1.2rem}
      .chart-card{padding:.85rem}
      .chart-wrap{height:280px}
      h2{font-size:.95rem}
    }
  `]
})
export class AdminStatsComponent implements OnInit {
  private statsApi = inject(StatsService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);
  records = signal<SurveyStatsRecord[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  colorScheme: any = {
    domain: ['#1a3a5c', '#e8632a', '#2d7a4f', '#7b3fa0', '#c0873d', '#3a8fbf', '#8b5e5e', '#c04a7a', '#d97706', '#5a8fa0'],
  };

  intFormat = (val: number) => Number.isInteger(val) ? val.toString() : '';

  milieuData = computed<ChartEntry[]>(() => {
    const counts: Record<string, number> = {};
    for (const r of this.records()) {
      const name = r.milieuName || r.milieuKey || 'Unbekannt';
      counts[name] = (counts[name] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  });

  timelineData = computed<SeriesEntry[]>(() => {
    const counts: Record<string, number> = {};
    for (const r of this.records()) {
      const day = (r.createdAt || '').slice(0, 10);
      if (!day) continue;
      counts[day] = (counts[day] ?? 0) + 1;
    }
    const series = Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, value]) => ({ name, value }));
    return [{ name: 'Submissions', series }];
  });

  ngOnInit() {
    if (!this.isBrowser) return;
    this.statsApi.listAll().subscribe({
      next: (data) => {
        this.records.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/admin/login']);
          return;
        }
        this.error.set(err?.error?.error || 'Fehler beim Laden der Statistik.');
      },
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
