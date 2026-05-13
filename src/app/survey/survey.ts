import { Component, signal, computed, PLATFORM_ID, DestroyRef, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatsService } from '../shared/stats.service';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string }[];
}

const YESNO_OPTIONS = [{ label: 'Ja', value: 'ja' }, { label: 'Nein', value: 'nein' }];
const IMPORTANCE_OPTIONS = [
  { label: 'wichtig',         value: 'wichtig' },
  { label: 'eher wichtig',    value: 'eher_wichtig' },
  { label: 'neutral',         value: 'neutral' },
  { label: 'eher unwichtig',  value: 'eher_unwichtig' },
  { label: 'unwichtig',       value: 'unwichtig' },
];
const AGREEMENT_OPTIONS = [
  { label: 'trifft zu',            value: 'trifft_zu' },
  { label: 'trifft eher zu',       value: 'trifft_eher_zu' },
  { label: 'neutral',              value: 'neutral' },
  { label: 'trifft eher nicht zu', value: 'trifft_eher_nicht_zu' },
  { label: 'trifft nicht zu',      value: 'trifft_nicht_zu' },
];

const QUESTIONS: Question[] = [
  { id: 'q1',  text: 'Familie, Heimat und Traditionen sind mir sehr wichtig.',                      options: YESNO_OPTIONS },
  { id: 'q2',  text: 'Ich passe mich gerne an Erwartungen an, um erfolgreich zu sein.',             options: YESNO_OPTIONS },
  { id: 'q3',  text: 'Ich habe oft das Gefühl, dass ich es im Leben schwerer habe als andere.',     options: YESNO_OPTIONS },
  { id: 'q4',  text: 'Marken, Trends und coole Produkte sind mir wichtig.',                         options: YESNO_OPTIONS },
  { id: 'q5',  text: 'Ich lebe lieber im Hier und Jetzt, als langfristig zu planen.',               options: YESNO_OPTIONS },
  { id: 'q6',  text: 'Umwelt- und Klimaschutz sind für mich zentrale Themen im Alltag.',            options: YESNO_OPTIONS },
  { id: 'q7',  text: 'Ich möchte neue Wege gehen und mich von der Masse abheben.',                  options: YESNO_OPTIONS },
  { id: 'q8',  text: 'Bildung, kritisches Denken und gesellschaftliche Verantwortung sind mir wichtig.', options: YESNO_OPTIONS },
  { id: 'q9',  text: 'Erfolg, Status und Leistung treiben mich im Leben an.',                       options: YESNO_OPTIONS },
  { id: 'q10', text: 'Ich schätze ein ruhiges, geregeltes Leben mit klaren Strukturen.',            options: YESNO_OPTIONS },
  { id: 'q11', text: 'Ich bin Mitglied in einem Verein und das Vereinsleben ist mir …',             options: IMPORTANCE_OPTIONS },
  { id: 'q12', text: 'Das Wohl der Gemeinschaft ist mir wichtig.',                                  options: AGREEMENT_OPTIONS },
  { id: 'q13', text: 'Ich passe mich schnell neuen Trends an.',                                     options: AGREEMENT_OPTIONS },
  { id: 'q14', text: 'Gute Schulnoten sind mir …',                                                  options: IMPORTANCE_OPTIONS },
  { id: 'q15', text: 'Ich bin ein kreativer Mensch und grenze mich durch meinen eigenen Stil von der Masse ab.', options: AGREEMENT_OPTIONS },
  { id: 'q16', text: 'Ich hatte schwierige Startbedingungen, aber mache dennoch das Beste daraus.', options: AGREEMENT_OPTIONS },
  { id: 'q17', text: 'Ich probiere gerne neue Sachen aus, auch wenn diese gefährlich erscheinen.',  options: AGREEMENT_OPTIONS },
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
  q11: 'traditionell',
  q12: 'sozial',
  q13: 'hedonistisch',
  q14: 'performer_konservativ',
  q15: 'expeditiv',
  q16: 'adaptiv',
  q17: 'experimentalist',
};

function scoreFor(value: string | undefined): number {
  switch (value) {
    case 'ja':
      return 1;
    case 'wichtig':
    case 'trifft_zu':
      return 2;
    case 'eher_wichtig':
    case 'trifft_eher_zu':
      return 1;
    default:
      return 0;
  }
}

const SURVEY_COOKIE = 'sinus_survey_done';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const MIN_QUESTION_TIME_MS = 2000;

function setCompletionCookie(): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(new Date().toISOString());
  document.cookie = `${SURVEY_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function hasCompletionCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith(`${SURVEY_COOKIE}=`));
}

function classifyMilieu(answers: Record<string, string>): string {
  const counts: Record<string, number> = {};
  let totalScore = 0;

  for (const [qid, milieu] of Object.entries(MILIEU_FOR_QUESTION)) {
    const score = scoreFor(answers[qid]);
    if (score > 0) {
      counts[milieu] = (counts[milieu] ?? 0) + score;
      totalScore += score;
    }
  }

  if (totalScore === 0) return 'buergerlich_traditionell';

  const max = Math.max(...Object.values(counts));
  const winners = Object.entries(counts).filter(([, n]) => n === max).map(([m]) => m);

  if (winners.length === 1) return winners[0];

  const tiebreakOrder = ['q1', 'q6', 'q7', 'q12', 'q15'];
  for (const qid of tiebreakOrder) {
    if (scoreFor(answers[qid]) > 0) {
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
  alreadyParticipated = signal(false);
  deviceBlocked = signal(false);

  tooFastWarning = signal(false);
  tabLeftWarning = signal(false);

  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private stats = inject(StatsService);
  private submitted = false;
  private questionStartedAt = 0;
  private tooFastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private router: Router) {
    if (!isPlatformBrowser(this.platformId)) return;

    const verified = sessionStorage.getItem('verified');
    if (!verified) {
      this.router.navigate(['/']);
      return;
    }

    if (hasCompletionCookie()) {
      this.deviceBlocked.set(true);
      return;
    }

    if (verified !== 'anonym') {
      this.stats.checkEmailExists(verified).subscribe({
        next: (res) => this.alreadyParticipated.set(res.exists),
        error: () => {},
      });
    }

    this.questionStartedAt = Date.now();

    const onVisibility = () => {
      if (this.done() || this.deviceBlocked()) return;
      if (document.hidden) {
        const qid = this.q?.id;
        if (qid && this.answers()[qid] !== undefined) {
          this.answers.update(a => {
            const next = { ...a };
            delete next[qid];
            return next;
          });
        }
        this.tabLeftWarning.set(true);
      } else {
        this.questionStartedAt = Date.now();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (this.tooFastTimer) clearTimeout(this.tooFastTimer);
    });
  }

  get q() { return this.questions[this.current()]; }

  select(value: string) {
    if (this.deviceBlocked() || this.done()) return;

    const elapsed = Date.now() - this.questionStartedAt;
    if (elapsed < MIN_QUESTION_TIME_MS) {
      this.tooFastWarning.set(true);
      if (this.tooFastTimer) clearTimeout(this.tooFastTimer);
      this.tooFastTimer = setTimeout(() => this.tooFastWarning.set(false), 1800);
      return;
    }

    this.tooFastWarning.set(false);
    this.tabLeftWarning.set(false);
    this.answers.update(a => ({ ...a, [this.q.id]: value }));

    setTimeout(() => {
      if (this.current() < QUESTIONS.length - 1) {
        this.current.update(n => n + 1);
        this.questionStartedAt = Date.now();
      } else {
        if (this.submitted) return;
        this.submitted = true;
        const key = classifyMilieu(this.answers());
        const milieu = MILIEU_MAP[key];
        this.result.set(milieu);
        this.done.set(true);
        if (isPlatformBrowser(this.platformId)) {
          setCompletionCookie();
          const verified = sessionStorage.getItem('verified');
          const isAnonym = verified === 'anonym' || !verified;
          const email = isAnonym ? null : verified;
          this.stats.submitSurvey({
            milieuKey: key,
            milieuName: milieu.name,
            answers: this.answers(),
            createdAt: new Date().toISOString(),
            email,
            isAnonym,
          }).subscribe({
            error: (err) => console.error('Failed to submit survey result', err),
          });
        }
      }
    }, 300);
  }

  isSelected(value: string) { return this.answers()[this.q?.id] === value; }

  back() {
    if (this.current() > 0) {
      this.current.update(n => n - 1);
      this.questionStartedAt = Date.now();
      this.tabLeftWarning.set(false);
      this.tooFastWarning.set(false);
    }
  }
}
