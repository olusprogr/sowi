import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'bildung',
    text: 'Welchen höchsten Schulabschluss strebst du an oder hast du bereits?',
    options: [
      { label: 'Hauptschulabschluss', value: 'haupt' },
      { label: 'Realschulabschluss', value: 'real' },
      { label: 'Abitur / Fachabitur', value: 'abi' },
      { label: 'Hochschulabschluss (Bachelor, Master, …)', value: 'hochschule' },
    ]
  },
  {
    id: 'werte',
    text: 'Welcher Aussage stimmst du am stärksten zu?',
    options: [
      { label: 'Tradition und Sicherheit sind mir das Wichtigste.', value: 'tradition' },
      { label: 'Ich strebe nach Status, Erfolg und Anerkennung.', value: 'status' },
      { label: 'Selbstverwirklichung und persönliche Freiheit sind mein Ziel.', value: 'selbst' },
      { label: 'Gemeinschaft, Solidarität und Gerechtigkeit leiten mich.', value: 'community' },
      { label: 'Spaß, Erlebnisse und das Hier und Jetzt zählen.', value: 'hedonismus' },
    ]
  },
  {
    id: 'freizeit',
    text: 'Wie verbringst du deine Freizeit am liebsten?',
    options: [
      { label: 'Zuhause – Familie, Garten, Fernsehen', value: 'zuhause' },
      { label: 'Sport, Fitness, Netzwerken', value: 'aktiv' },
      { label: 'Kultur, Kunst, Reisen', value: 'kultur' },
      { label: 'Ehrenamt, politisches Engagement', value: 'sozial' },
      { label: 'Ausgehen, Feiern, Gaming, Soziale Medien', value: 'digital' },
    ]
  },
  {
    id: 'konsum',
    text: 'Wie triffst du Kaufentscheidungen?',
    options: [
      { label: 'Ich achte vor allem auf den Preis.', value: 'preis' },
      { label: 'Marken und Qualität sind mir wichtig.', value: 'marke' },
      { label: 'Ich kaufe nachhaltig und ethisch.', value: 'nachhaltig' },
      { label: 'Ich kaufe was trendy und angesagt ist.', value: 'trend' },
      { label: 'Ich kaufe spontan, was mir gefällt.', value: 'spontan' },
    ]
  },
  {
    id: 'politik',
    text: 'Wie stehst du zu gesellschaftlichen Veränderungen?',
    options: [
      { label: 'Bewährtes bewahren – Veränderung macht mir Sorgen.', value: 'konservativ' },
      { label: 'Reformen ja, aber schrittweise und pragmatisch.', value: 'moderat' },
      { label: 'Progressiver Wandel – Gesellschaft muss sich öffnen.', value: 'progressiv' },
      { label: 'Radikaler Wandel ist nötig – das System muss sich ändern.', value: 'radikal' },
      { label: 'Ich interessiere mich kaum für Politik.', value: 'apolitisch' },
    ]
  },
  {
    id: 'technik',
    text: 'Wie gehst du mit neuen Technologien um?',
    options: [
      { label: 'Ich nutze sie nur wenn nötig und bleibe lieber beim Alten.', value: 'skeptisch' },
      { label: 'Ich nutze sie gezielt für Beruf und Effizienz.', value: 'pragmatisch' },
      { label: 'Ich experimentiere gerne und probiere Neues aus.', value: 'enthusiast' },
      { label: 'Ich hinterfrage kritisch den gesellschaftlichen Einfluss.', value: 'kritisch' },
    ]
  },
  {
    id: 'wohnen',
    text: 'Wo und wie möchtest du am liebsten wohnen?',
    options: [
      { label: 'Ländlich – Natur, Ruhe, eigenes Haus', value: 'land' },
      { label: 'Vorstadt – ruhig, aber mit guter Anbindung', value: 'vorstadt' },
      { label: 'Großstadt – zentral, urban, belebt', value: 'stadt' },
      { label: 'Flexibel – Hauptsache unkompliziert und günstig', value: 'flexibel' },
    ]
  },
];

const MILIEU_MAP: Record<string, { name: string; farbe: string; desc: string; anteil: string }> = {
  konservativ: { name: 'Konservativ-Etabliertes Milieu', farbe: '#1a3a5c', desc: 'Klassische Elite mit hohem Bildungsniveau. Geprägt von Traditionsbewusstsein, Pflichtgefühl und kulturellem Anspruch.', anteil: '10 %' },
  liberal:     { name: 'Liberal-Intellektuelles Milieu', farbe: '#2d7a4f', desc: 'Aufgeklärte Bildungselite mit postmateriellen Wurzeln. Politisch-kulturell engagiert, offen für Vielfalt.', anteil: '7 %' },
  performer:   { name: 'Milieu der Performer', farbe: '#e8632a', desc: 'Leistungsorientierte Globalisten. Hohe Ansprüche an sich selbst, technikaffin, international vernetzt.', anteil: '8 %' },
  expeditiv:   { name: 'Expeditives Milieu', farbe: '#7b3fa0', desc: 'Kreative Avantgarde. Digitale Natives, die Unabhängigkeit, Selbstbestimmung und Ästhetik leben.', anteil: '9 %' },
  sozial:      { name: 'Sozial-Ökologisches Milieu', farbe: '#3a8fbf', desc: 'Gesellschaftskritisch und nachhaltigkeitsorientiert. Starkes Gemeinschaftsgefühl und ökologisches Gewissen.', anteil: '7 %' },
  adaptiv:     { name: 'Adaptiv-Pragmatisches Milieu', farbe: '#c0873d', desc: 'Junge flexible Mitte. Pragmatisch, anpassungsfähig, balancieren zwischen Leistung und Lebensqualität.', anteil: '12 %' },
  buergerlich: { name: 'Bürgerliche Mitte', farbe: '#5a8fa0', desc: 'Der gesellschaftliche Mainstream. Sicherheitsorientiert, harmonieliebend, konventionell.', anteil: '13 %' },
  traditionell:{ name: 'Traditionelles Milieu', farbe: '#7a7060', desc: 'Die ältere Generation mit kleinbürgerlichen Werten. Pflichtbewusstsein, Sparsamkeit, Bodenständigkeit.', anteil: '13 %' },
  prekär:      { name: 'Prekäres Milieu', farbe: '#8b5e5e', desc: 'Gesellschaftlich Abgehängte. Suche nach Sicherheit, Ausgrenzungserfahrungen, soziale Benachteiligung.', anteil: '9 %' },
  hedonistisch:{ name: 'Hedonistisches Milieu', farbe: '#c04a7a', desc: 'Spaß- und erlebnisorientierte Unterschicht und untere Mittelschicht. Leben im Moment, Ablehnung von Normen.', anteil: '15 %' },
};

function classifyMilieu(answers: Record<string, string>): string {
  const s = (k: string, v: string) => answers[k] === v;
  if (s('bildung','hochschule') && (s('werte','status') || s('freizeit','aktiv')) && s('technik','enthusiast')) return 'performer';
  if (s('bildung','hochschule') && s('werte','community') && s('politik','progressiv')) return 'liberal';
  if (s('bildung','hochschule') && s('werte','selbst') && s('technik','enthusiast') && s('freizeit','digital')) return 'expeditiv';
  if (s('werte','community') && s('konsum','nachhaltig') && s('politik','progressiv')) return 'sozial';
  if (s('werte','tradition') && (s('bildung','hochschule') || s('bildung','abi')) && s('konsum','marke')) return 'konservativ';
  if (s('werte','tradition') && (s('bildung','haupt') || s('bildung','real'))) return 'traditionell';
  if (s('werte','hedonismus') && s('freizeit','digital') && s('politik','apolitisch')) return 'hedonistisch';
  if (s('politik','apolitisch') && s('konsum','preis') && s('wohnen','flexibel')) return 'prekär';
  if ((s('bildung','abi') || s('bildung','real')) && s('werte','status') && s('technik','pragmatisch')) return 'adaptiv';
  return 'buergerlich';
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

  constructor(private router: Router) {
    if (!sessionStorage.getItem('verified')) this.router.navigate(['/']);
  }

  get q() { return this.questions[this.current()]; }

  select(value: string) {
    this.answers.update(a => ({ ...a, [this.q.id]: value }));
    setTimeout(() => {
      if (this.current() < QUESTIONS.length - 1) {
        this.current.update(n => n + 1);
      } else {
        const key = classifyMilieu(this.answers());
        this.result.set(MILIEU_MAP[key]);
        this.done.set(true);
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
