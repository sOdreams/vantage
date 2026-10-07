import { formatTime, type LightWindow, lightPhrase, nextLightWindow } from './sun';
import type { City, CrowdLevel, Lens, Spot, Tone } from './types';

export const crowdWords: Record<CrowdLevel, string> = { 0: 'Quiet', 1: 'Moderate', 2: 'Busy' };
const crowdNow: Record<CrowdLevel, string> = { 0: 'quiet now', 1: 'some people now', 2: 'busy now' };

/** How full the crowd glyph is drawn: empty, half, full. */
export const crowdFill: Record<CrowdLevel, number> = { 0: 0, 1: 50, 2: 100 };

/** Spots whose good light starts within this long of the earliest one are "best". */
const BEST_SPREAD_MS = 20 * 60_000;

export type SpotLight = { spot: Spot; window: LightWindow; best: boolean };

/** Works out each spot's next window of good light and which ones lead right now. */
export function spotLight(spots: Spot[], now: Date, city: City): SpotLight[] {
  const rows = spots.map((spot) => ({ spot, window: nextLightWindow(spot.light, now, city) }));
  const candidates = rows.filter((r) => !r.spot.risk);
  const earliest = Math.min(
    ...candidates.map((r) => (r.window.active ? now.getTime() : r.window.start.getTime())),
  );
  return rows.map((r) => ({
    ...r,
    best:
      !r.spot.risk &&
      (r.window.active || r.window.start.getTime() <= earliest + BEST_SPREAD_MS),
  }));
}

export type MarkStyle = {
  /** Diameter of the glyph in points. */
  size: number;
  /** 0–100: how much of the glyph is filled from the bottom. */
  fillPct: number;
  glyphTone: Tone;
  numberTone: Tone;
  /** Small caption under the number, e.g. "18:25", "~120", "Gusts 72 km/h". */
  meta: string;
  metaTone: Tone;
  opacity: number;
};

/** Progressive disclosure: each lens shows one kind of information and nothing else. */
export function markStyle(row: SpotLight, lens: Lens, city: City): MarkStyle {
  const { spot, window, best } = row;
  const base: MarkStyle = {
    size: 6,
    fillPct: 100,
    glyphTone: 'ink2',
    numberTone: 'ink2',
    meta: '',
    metaTone: 'ink2',
    opacity: 1,
  };

  switch (lens) {
    case 'light':
      if (!best) return base;
      return {
        ...base,
        size: 9,
        glyphTone: 'ink',
        numberTone: 'ink',
        meta: window.active ? 'Now' : formatTime(window.start, city.timeZone),
      };
    case 'crowd':
      return {
        ...base,
        size: 12,
        fillPct: crowdFill[spot.crowd],
        glyphTone: 'ink',
        numberTone: 'ink',
        meta: `~${spot.people}`,
      };
    case 'safety':
      if (spot.risk) {
        return {
          ...base,
          size: 10,
          glyphTone: 'accent',
          numberTone: 'accent',
          meta: spot.risk,
          metaTone: 'accent',
        };
      }
      return { ...base, glyphTone: 'dim', opacity: 0.55 };
  }
}

export type Lead = { spotId: string; kicker: string; name: string; line: string; tone: Tone };

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

function numbering(spot: Spot, total: number): string {
  return `${spot.id} / ${String(total).padStart(2, '0')}`;
}

function describe(row: SpotLight, lens: Lens, now: Date, city: City): { line: string; tone: Tone } {
  const { spot, window } = row;
  const light = lightPhrase(spot.light, window, now, city);
  if (spot.risk && lens !== 'crowd') {
    return { line: `Not today: ${lowerFirst(spot.risk)}`, tone: 'accent' };
  }
  if (lens === 'crowd') {
    return { line: `About ${spot.people} people now · ${lowerFirst(light)}`, tone: 'ink2' };
  }
  if (lens === 'safety') return { line: 'No warnings today', tone: 'ink2' };
  return { line: `${light} · ${crowdNow[spot.crowd]}`, tone: 'ink2' };
}

/**
 * The one spot named at the bottom of the screen. Either the one the user
 * tapped, or the best answer to the lens's question.
 */
export function leadFor(
  rows: SpotLight[],
  lens: Lens,
  now: Date,
  city: City,
  selectedId?: string,
): Lead {
  const total = rows.length;
  const selected = selectedId ? rows.find((r) => r.spot.id === selectedId) : undefined;
  if (selected) {
    return {
      spotId: selected.spot.id,
      kicker: `${numbering(selected.spot, total)} · ${selected.spot.area}`,
      name: selected.spot.name,
      ...describe(selected, lens, now, city),
    };
  }

  const startOf = (r: SpotLight) => (r.window.active ? now.getTime() : r.window.start.getTime());
  const first = rows[0];
  if (!first) throw new Error('leadFor needs at least one spot');

  if (lens === 'safety') {
    const risky = rows.find((r) => r.spot.risk);
    if (!risky) {
      return {
        spotId: first.spot.id,
        kicker: 'All clear',
        name: 'No warnings',
        line: 'Every spot on the map is fine to visit today',
        tone: 'ink2',
      };
    }
    return {
      spotId: risky.spot.id,
      kicker: `${numbering(risky.spot, total)} · Notice`,
      name: risky.spot.name,
      ...describe(risky, lens, now, city),
    };
  }

  if (lens === 'crowd') {
    const quiet = [...rows]
      .filter((r) => !r.spot.risk)
      .sort(
        (a, b) =>
          a.spot.crowd - b.spot.crowd ||
          Number(b.best) - Number(a.best) ||
          startOf(a) - startOf(b) ||
          a.spot.people - b.spot.people,
      )[0];
    const pick = quiet ?? first;
    return {
      spotId: pick.spot.id,
      kicker: `${numbering(pick.spot, total)} · Quietest worth going`,
      name: pick.spot.name,
      ...describe(pick, lens, now, city),
    };
  }

  const best = [...rows]
    .filter((r) => r.best)
    .sort((a, b) => startOf(a) - startOf(b) || a.spot.id.localeCompare(b.spot.id))[0];
  const pick = best ?? first;
  return {
    spotId: pick.spot.id,
    kicker: `${numbering(pick.spot, total)} · ${pick.window.active ? 'Best light now' : 'Best light next'}`,
    name: pick.spot.name,
    ...describe(pick, lens, now, city),
  };
}
