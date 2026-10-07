import { formatTime, nextLightWindow } from './sun';
import type { City, Spot, Weather } from './types';

const FIRST_HOUR = 7;

/** Hour of day (0–23) in the city's time zone. */
export function cityHour(now: Date, city: City): number {
  return Number.parseInt(formatTime(now, city.timeZone).slice(0, 2), 10);
}

/** Minutes since midnight in the city's time zone. */
export function cityMinutes(date: Date, city: City): number {
  const [h = '0', m = '0'] = formatTime(date, city.timeZone).split(':');
  return Number.parseInt(h, 10) * 60 + Number.parseInt(m, 10);
}

export type CrowdInsight = {
  /** Index into typicalCrowd for "now", or -1 outside 07:00–23:00. */
  nowIndex: number;
  /** "Busier than usual for this hour" etc. */
  comparison: string;
  /** First hour after now when it is typically quiet, e.g. 20 → "Quieter after 20:00". */
  quieterAfter: number | undefined;
  /** Indexes of hours ahead that are typically quiet (drawn in blue). */
  quietIndexes: number[];
};

const QUIET = 30;

/**
 * Compares the live crowd level with the typical curve, Google-style:
 * "Busier than usual" and when it gets quiet again.
 */
export function crowdInsight(spot: Spot, typical: number[], now: Date, city: City): CrowdInsight {
  const hour = cityHour(now, city);
  const nowIndex = hour >= FIRST_HOUR && hour < FIRST_HOUR + typical.length ? hour - FIRST_HOUR : -1;
  const usual = nowIndex >= 0 ? (typical[nowIndex] ?? 0) : 0;
  const live = [15, 50, 85][spot.crowd] ?? 0;
  const comparison =
    live > usual + 15
      ? 'Busier than usual for this hour.'
      : live < usual - 15
        ? 'Quieter than usual for this hour.'
        : 'About as busy as usual for this hour.';

  const quietIndexes = typical
    .map((v, i) => ({ v, i }))
    .filter(({ v, i }) => i > nowIndex && v < QUIET)
    .map(({ i }) => i);
  const firstQuiet = nowIndex >= 0 ? quietIndexes[0] : undefined;
  const quieterAfter =
    spot.crowd > 0 && firstQuiet !== undefined ? FIRST_HOUR + firstQuiet : undefined;

  return { nowIndex, comparison, quieterAfter, quietIndexes };
}

export const crowdHours = (length: number) => Array.from({ length }, (_, i) => FIRST_HOUR + i);

export type Risk = 'safe' | 'caution' | 'risky';

export type WeatherAssessment = {
  risk: Risk;
  headline: string;
  reasons: string[];
};

/**
 * Turns a forecast into a go / be careful / skip it call. Thresholds are
 * deliberately conservative for exposed viewpoints.
 */
export function assessWeather(w: Weather): WeatherAssessment {
  const levels: Risk[] = ['safe', 'caution', 'risky'];
  const reasons: string[] = [];
  let level = 0;
  const raise = (to: Risk) => {
    level = Math.max(level, levels.indexOf(to));
  };

  if (w.gustKmh >= 60) {
    raise('risky');
    reasons.push(`Gusts up to ${w.gustKmh} km/h`);
  } else if (w.gustKmh >= 40) {
    raise('caution');
    reasons.push(`Gusts up to ${w.gustKmh} km/h`);
  }
  if (w.rainPct >= 70) {
    raise('risky');
    reasons.push(`Heavy rain likely (${w.rainPct}%)`);
  } else if (w.rainPct >= 40) {
    raise('caution');
    reasons.push(`Rain possible (${w.rainPct}%)`);
  }
  if (w.visibilityKm < 5) {
    raise('caution');
    reasons.push(`Visibility down to ${w.visibilityKm} km`);
  }

  const risk = levels[level] ?? 'safe';
  const headline =
    risk === 'risky' ? 'Risky right now' : risk === 'caution' ? 'Go with care' : 'Safe to go';
  return { risk, headline, reasons };
}

export type TimelineSegment = {
  kind: 'day' | 'golden' | 'blue' | 'night';
  /** 0–1 across the timeline. */
  from: number;
  to: number;
};

export type DayTimeline = {
  segments: TimelineSegment[];
  /** 0–1, or undefined when now is outside the window. */
  nowAt: number | undefined;
  ticks: { label: string; at: number }[];
};

/** The "When to shoot" strip: daylight → golden → blue → night, 16:00 to 22:00. */
export function dayTimeline(now: Date, city: City, fromHour = 16, toHour = 22): DayTimeline {
  const span = (toHour - fromHour) * 60;
  const at = (minutes: number) => Math.min(1, Math.max(0, (minutes - fromHour * 60) / span));
  const golden = nextLightWindow('golden-evening', now, city);
  const blue = nextLightWindow('blue-hour', now, city);
  const g0 = at(cityMinutes(golden.start, city));
  const g1 = at(cityMinutes(golden.end, city));
  const b1 = at(cityMinutes(blue.end, city));
  const nowMin = cityMinutes(now, city);
  return {
    segments: [
      { kind: 'day', from: 0, to: g0 },
      { kind: 'golden', from: g0, to: g1 },
      { kind: 'blue', from: g1, to: b1 },
      { kind: 'night', from: b1, to: 1 },
    ],
    nowAt: nowMin >= fromHour * 60 && nowMin <= toHour * 60 ? at(nowMin) : undefined,
    ticks: Array.from({ length: toHour - fromHour }, (_, i) => ({
      label: `${fromHour + i}:00`,
      at: i / (toHour - fromHour),
    })),
  };
}
