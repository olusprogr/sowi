import { Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatsService } from '../shared/stats.service';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  { id: 'q1',  text: 'Familie, Heimat und Traditionen sind mir sehr wichtig.',                      options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q2',  text: 'Ich passe mich gerne an Erwartungen an, um erfolgreich zu sein.',             options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q3',  text: 'Ich habe oft das Gefühl, dass ich es im Leben schwerer habe als andere.',     options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q4',  text: 'Marken, Trends und coole Produkte sind mir wichtig.',                         options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q5',  text: 'Ich lebe lieber im Hier und Jetzt, als langfristig zu planen.',               options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q6',  text: 'Umwelt- und Klimaschutz sind für mich zentrale Themen im Alltag.',            options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q7',  text: 'Ich möchte neue Wege gehen und mich von der Masse abheben.',                  options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q8',  text: 'Bildung, kritisches Denken und gesellschaftliche Verantwortung sind mir wichtig.', options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q9',  text: 'Erfolg, Status und Leistung treiben mich im Leben an.',                       options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
  { id: 'q10', text: 'Ich schätze ein ruhiges, geregeltes Leben mit klaren Strukturen.',            options: [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }] },
];

const MILIEU_MAP: Record<string, { name: string; farbe: string; desc: string; anteil: string }> = {
  traditionell:{ name: 'Traditionelles Milieu', farbe: '#7a7060', desc: 'Die ältere Generation mit kleinbürgerlichen Werten. Pflichtbewusstsein, Sparsamkeit, Bodenständigkeit.', anteil: '13 %' },
  adaptiv:     { name: 'Adaptiv-Pragmatisches Milieu', farbe: '#c0873d', desc: 'Junge flexible Mitte. Pragmatisch, anpassungsfähig, balancieren zwischen Leistung und Lebensqualität.', anteil: '12 %' },
  prekär:      { name: 'Prekäres Milieu', farbe: '#8b5e5e', desc: 'Gesellschaftlich Abgehängte. Suche nach Sicherheit, Ausgrenzungserfahrungen, soziale Benachteiligung.', anteil: '9 %' },
  hedonistisch:{ name: 'Konsum-Hedonistisches Milieu', farbe: '#c04a7a', desc: 'Spaß- und erlebnisorientierte Unterschicht und untere Mittelschicht. Leben im Moment, Ablehnung von Normen.', anteil: '15 %' },
  experimentalist:{ name: 'Experimentalistisches Milieu', farbe: '#d97706', desc: 'Unkonventionelle Kreative. Leben spontan im Hier und Jetzt, lieben Vielfalt und Selbstinszenierung.', anteil: '8 %' },
  sozial:      { name: 'Sozial-Ökologisches Milieu', farbe: '#3a8fbf', desc: 'Gesellschaftskritisch und nachhaltigkeitsorientiert. Starkes Gemeinschaftsgefühl und ökologisches Gewissen.', anteil: '7 %' },
  expeditiv:   { name: 'Expeditives Milieu', farbe: '#7b3fa0', desc: 'Kreative Avantgarde. Digitale Natives, die Unabhängigkeit, Selbstbestimmung und Ästhetik leben.', anteil: '9 %' },
  liberal:     { name: 'Liberal-Intellektuelles Milieu', farbe: '#2d7a4f', desc: 'Aufgeklärte Bildungselite mit postmateriellen Wurzeln. Politisch-kulturell engagiert, offen für Vielfalt.', anteil: '7 %' },
  performer_konservativ: { name: 'Performer / Konservativ-Etablierte', farbe: '#1a3a5c', desc: 'Leistungs- und statusorientierte Elite. Hohe Ansprüche, Erfolgsstreben, kulturelles Selbstbewusstsein.', anteil: '18 %' },
  buergerlich_traditionell: { name: 'Bürgerliche Mitte / Traditionelles Milieu', farbe: '#5a8fa0', desc: 'Sicherheitsorientiert und harmonieliebend. Klare Strukturen, geregeltes Leben, konventionelle Werte.', anteil: '26 %' },
};

const MILIEU_FOR_QUESTION: Record<string, string> = {
  q1: 'traditionell',
  q2: 'adaptiv',
  q3: 'prekär',
  q4: 'hedonistisch',
  q5: 'experimentalist',
  q6: 'sozial',
  q7: 'expeditiv',
  q8: 'liberal',
  q9: 'performer_konservativ',
  q10: 'buergerlich_traditionell',
};

function classifyMilieu(answers: Record<string, string>): string {
  const counts: Record<string, number> = {};
  const yesQuestions: string[] = [];
  for (const [qid, milieu] of Object.entries(MILIEU_FOR_QUESTION)) {
    if (answers[qid] === 'ja') {
      counts[milieu] = (counts[milieu] ?? 0) + 1;
      yesQuestions.push(qid);
    }
  }

  if (yesQuestions.length === 0) return 'buergerlich_traditionell';

  const max = Math.max(...Object.values(counts));
  const winners = Object.entries(counts).filter(([, n]) => n === max).map(([m]) => m);

  if (winners.length === 1) return winners[0];

  const tiebreakOrder = ['q1', 'q6', 'q7'];
  for (const qid of tiebreakOrder) {
    if (answers[qid] === 'ja') {
      const milieu = MILIEU_FOR_QUESTION[qid];
      if (winners.includes(milieu)) return milieu;
    }
  }

  return winners[0];
}

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survey.html',
  styleUrl: './survey.css'
})
export class SurveyComponent {
  questions = QUESTIONS;
  current = signal(0);
  answers = signal<Record<string, string>>({});
  done = signal(false);
  result = signal<typeof MILIEU_MAP[string] | null>(null);

  progress = computed(() => Math.round((Object.keys(this.answers()).length / QUESTIONS.length) * 100));
  private platformId = inject(PLATFORM_ID);
  private stats = inject(StatsService);

  constructor(private router: Router) {
    if (isPlatformBrowser(this.platformId) && !sessionStorage.getItem('verified')) {
      this.router.navigate(['/']);
    }
  }

  get q() { return this.questions[this.current()]; }

  select(value: string) {
    this.answers.update(a => ({ ...a, [this.q.id]: value }));
    setTimeout(() => {
      if (this.current() < QUESTIONS.length - 1) {
        this.current.update(n => n + 1);
      } else {
        const key = classifyMilieu(this.answers());
        const milieu = MILIEU_MAP[key];
        this.result.set(milieu);
        this.done.set(true);
        if (isPlatformBrowser(this.platformId)) {
          this.stats.submitSurvey({
            milieuKey: key,
            milieuName: milieu.name,
            answers: this.answers(),
            createdAt: new Date().toISOString(),
          }).subscribe({
            error: (err) => console.error('Failed to submit survey result', err),
          });
        }
      }
    }, 300);
  }

  isSelected(value: string) { return this.answers()[this.q?.id] === value; }

  back() { if (this.current() > 0) this.current.update(n => n - 1); }

  restart() {
    this.answers.set({});
    this.current.set(0);
    this.done.set(false);
    this.result.set(null);
  }
}
