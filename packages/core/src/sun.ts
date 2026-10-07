import SunCalc from 'suncalc';
import type { City, LightKind } from './types';

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

export type LightWindow = { start: Date; end: Date; active: boolean };

type Times = ReturnType<typeof SunCalc.getTimes>;

function timesFor(date: Date, city: City): Times {
  return SunCalc.getTimes(date, city.lat, city.lng);
}

function windowOf(kind: LightKind, t: Times): { start: Date; end: Date } {
  switch (kind) {
    case 'golden-evening':
      return { start: t.goldenHour, end: t.sunset };
    case 'blue-hour':
      return { start: t.sunset, end: t.dusk };
    case 'sunrise':
      return { start: t.dawn, end: t.goldenHourEnd };
    case 'morning':
      return { start: t.goldenHourEnd, end: new Date(t.goldenHourEnd.getTime() + 2 * 60 * MINUTE) };
  }
}

/** The current or next window of good light of this kind. */
export function nextLightWindow(kind: LightKind, now: Date, city: City): LightWindow {
  const today = windowOf(kind, timesFor(now, city));
  if (now < today.end) return { ...today, active: now >= today.start };
  const tomorrow = windowOf(kind, timesFor(new Date(now.getTime() + DAY), city));
  return { ...tomorrow, active: false };
}

/** "18:25" in the city's own time zone, whatever the phone's time zone is. */
export function formatTime(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone,
    }).format(date);
  } catch {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}

/** "Wed 7 Oct" in the city's time zone. */
export function formatDay(date: Date, timeZone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone,
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    return `${get('weekday')} ${get('day')} ${get('month')}`;
  } catch {
    return date.toDateString().slice(0, 10);
  }
}

function sameCityDay(a: Date, b: Date, timeZone: string): boolean {
  return formatDay(a, timeZone) === formatDay(b, timeZone);
}

export function minutesUntil(date: Date, now: Date): number {
  return Math.max(0, Math.round((date.getTime() - now.getTime()) / MINUTE));
}

const lightLabel: Record<LightKind, string> = {
  'golden-evening': 'Golden light',
  'blue-hour': 'Blue hour',
  sunrise: 'Sunrise light',
  morning: 'Morning light',
};

/** "Golden light in 37 minutes", "Blue hour now, until 19:41", "Sunrise light tomorrow at 07:12". */
export function lightPhrase(kind: LightKind, w: LightWindow, now: Date, city: City): string {
  const label = lightLabel[kind];
  if (w.active) return `${label} now, until ${formatTime(w.end, city.timeZone)}`;
  const mins = minutesUntil(w.start, now);
  if (mins < 120) return `${label} in ${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  const at = formatTime(w.start, city.timeZone);
  return sameCityDay(w.start, now, city.timeZone) ? `${label} at ${at}` : `${label} tomorrow at ${at}`;
}

/** The masthead sentence, split so the time can be underlined and tapped. */
export type DaySentence = { before: string; time: string; after: string };

export function daySentence(now: Date, city: City): DaySentence {
  const tz = city.timeZone;
  const t = timesFor(now, city);
  const inMinutes = (d: Date) => {
    const m = minutesUntil(d, now);
    return m < 120 ? `, in ${m} ${m === 1 ? 'minute' : 'minutes'}.` : '.';
  };

  if (now < t.dawn) {
    return { before: 'Night. First light at ', time: formatTime(t.dawn, tz), after: '.' };
  }
  if (now < t.goldenHourEnd) {
    return { before: 'Morning light now, until ', time: formatTime(t.goldenHourEnd, tz), after: '.' };
  }
  if (now < t.goldenHour) {
    return { before: 'Golden hour at ', time: formatTime(t.goldenHour, tz), after: inMinutes(t.goldenHour) };
  }
  if (now < t.sunset) {
    return { before: 'Golden hour now, until sunset at ', time: formatTime(t.sunset, tz), after: '.' };
  }
  if (now < t.dusk) {
    return { before: 'Blue hour now, until ', time: formatTime(t.dusk, tz), after: '.' };
  }
  const tomorrow = timesFor(new Date(now.getTime() + DAY), city);
  return { before: 'Night. First light at ', time: formatTime(tomorrow.dawn, tz), after: '.' };
}
