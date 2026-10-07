import { formatDay, minutesUntil, nextLightWindow } from './sun';
import type { City, Spot } from './types';

export type AlertKind = 'closure' | 'weather' | 'light' | 'reopened' | 'gem';
export type AlertFilter = 'all' | 'closures' | 'weather' | 'light';

export type Alert = {
  id: string;
  kind: AlertKind;
  title: string;
  body: string;
  at: Date;
  spotId?: string;
};

const MIN = 60_000;

/**
 * The alerts feed. The golden-hour alert is computed from the real sun;
 * the others are SAMPLE items, timed relative to now so the feed stays fresh,
 * until closures and weather come from the server (Days 7–8).
 */
export function buildAlerts(now: Date, city: City, spots: Spot[]): Alert[] {
  const ago = (minutes: number) => new Date(now.getTime() - minutes * MIN);
  const alerts: Alert[] = [];

  const golden = nextLightWindow('golden-evening', now, city);
  const mins = minutesUntil(golden.start, now);
  if (golden.active || mins <= 120) {
    const evening = spots.filter((s) => s.light === 'golden-evening' && !s.risk);
    const busiest = [...evening].sort((a, b) => b.crowd - a.crowd)[0];
    const quietest = [...evening].sort((a, b) => a.crowd - b.crowd || b.rating - a.rating)[0];
    alerts.push({
      id: 'light-golden',
      kind: 'light',
      title: golden.active ? 'Golden hour now' : `Golden hour in ${mins} min`,
      body:
        busiest && quietest && busiest.id !== quietest.id
          ? `${busiest.name} is busy (~${busiest.people} people). ${quietest.name} is quiet.`
          : 'Good light at your saved spots.',
      at: now,
    });
  }

  for (const s of spots) {
    if (s.closure) {
      alerts.push({
        id: `closure-${s.id}`,
        kind: 'closure',
        title: `${s.name}: top platform closed`,
        body: 'Lift stopped because of high winds. Confirmed by the venue.',
        at: ago(35),
        spotId: s.id,
      });
    }
  }

  alerts.push(
    {
      id: 'weather-rain',
      kind: 'weather',
      title: 'Rain from 19:00 across the river',
      body: 'Strong gusts at exposed viewpoints in Almada. Shoot the city side instead.',
      at: ago(60),
      spotId: 'cristo-rei',
    },
    {
      id: 'reopened-santa-luzia',
      kind: 'reopened',
      title: 'Santa Luzia: scaffolding removed',
      body: 'The river view is clear again. Confirmed by 12 visitors.',
      at: ago(26 * 60),
      spotId: 'santa-luzia',
    },
    {
      id: 'gem-stairwell',
      kind: 'gem',
      title: 'New hidden gem near you',
      body: 'Tiled stairwell, Mouraria. Added by @rita.frames with 4 photos.',
      at: ago(31 * 60),
      spotId: 'tiled-stairwell',
    },
  );

  return alerts.sort((a, b) => b.at.getTime() - a.at.getTime());
}

const inFilter: Record<AlertFilter, AlertKind[]> = {
  all: ['closure', 'weather', 'light', 'reopened', 'gem'],
  closures: ['closure', 'reopened'],
  weather: ['weather'],
  light: ['light'],
};

export type AlertGroup = { label: string; items: Alert[] };

/** Filters, then groups into Today / Yesterday / Earlier in the city's time zone. */
export function groupAlerts(alerts: Alert[], filter: AlertFilter, now: Date, city: City): AlertGroup[] {
  const tz = city.timeZone;
  const today = formatDay(now, tz);
  const yesterday = formatDay(new Date(now.getTime() - 24 * 60 * MIN), tz);
  const groups: AlertGroup[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Earlier', items: [] },
  ];
  for (const a of alerts) {
    if (!inFilter[filter].includes(a.kind)) continue;
    const day = formatDay(a.at, tz);
    const group = day === today ? groups[0] : day === yesterday ? groups[1] : groups[2];
    group?.items.push(a);
  }
  return groups.filter((g) => g.items.length > 0);
}
