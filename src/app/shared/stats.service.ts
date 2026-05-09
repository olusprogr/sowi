import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface SurveyStatsPayload {
  milieuKey: string;
  milieuName: string;
  answers: Record<string, string>;
  createdAt: string;
  email: string | null;
}

export interface SurveyStatsRecord extends SurveyStatsPayload {
  _id: string;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  submitSurvey(payload: SurveyStatsPayload): Observable<{ _id: string }> {
    return this.http.post<{ _id: string }>(`${this.base}/stats`, payload);
  }

  listAll(): Observable<SurveyStatsRecord[]> {
    return this.http.get<SurveyStatsRecord[]>(`${this.base}/stats`);
  }
}
