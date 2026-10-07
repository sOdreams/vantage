import SunCalc from 'suncalc';
import { describe, expect, it } from 'vitest';
import { lisbon } from './sample/lisbon';
import {
  bestWindowText,
  formatDay,
  formatTime,
  lightChip,
  lightPhrase,
  nextLightWindow,
} from './sun';

// 7 Oct 2026, 12:00 in Lisbon (UTC+1 in October).
const NOON = new Date('2026-10-07T11:00:00Z');
const t = SunCalc.getTimes(NOON, lisbon.lat, lisbon.lng);
const at = (d: Date, minutes: number) => new Date(d.getTime() + minutes * 60_000);

describe('formatting in the city time zone', () => {
  it('shows Lisbon time, not UTC', () => {
    expect(formatTime(new Date('2026-10-07T17:25:00Z'), 'Europe/Lisbon')).toBe('18:25');
    expect(formatTime(new Date('2026-10-07T17:25:00Z'), 'Europe/Madrid')).toBe('19:25');
  });

  it('formats the day', () => {
    expect(formatDay(NOON, 'Europe/Lisbon')).toBe('Wed 7 Oct');
  });

  it('puts Lisbon sunset on 7 Oct around 19:10 local time', () => {
    const local = formatTime(t.sunset, 'Europe/Lisbon');
    expect(local >= '19:00' && local <= '19:20').toBe(true);
  });
});

describe('nextLightWindow', () => {
  it('returns today’s evening window before it starts', () => {
    const w = nextLightWindow('golden-evening', NOON, lisbon);
    expect(w.active).toBe(false);
    expect(w.start.getTime()).toBe(t.goldenHour.getTime());
  });

  it('is active during golden hour', () => {
    const w = nextLightWindow('golden-evening', at(t.goldenHour, 10), lisbon);
    expect(w.active).toBe(true);
  });

  it('rolls over to tomorrow once the window has passed', () => {
    const w = nextLightWindow('golden-evening', at(t.sunset, 5), lisbon);
    expect(w.active).toBe(false);
    expect(w.start.getTime()).toBeGreaterThan(t.sunset.getTime() + 20 * 3600_000);
  });
});

describe('lightPhrase', () => {
  it('counts down in minutes when close', () => {
    const now = at(t.goldenHour, -37);
    const w = nextLightWindow('golden-evening', now, lisbon);
    expect(lightPhrase('golden-evening', w, now, lisbon)).toBe('Golden light in 37 minutes');
  });

  it('gives a clock time when further away', () => {
    const w = nextLightWindow('golden-evening', NOON, lisbon);
    expect(lightPhrase('golden-evening', w, NOON, lisbon)).toBe(
      `Golden light at ${formatTime(t.goldenHour, lisbon.timeZone)}`,
    );
  });

  it('says now while the light is good', () => {
    const now = at(t.sunset, 5);
    const w = nextLightWindow('blue-hour', now, lisbon);
    expect(lightPhrase('blue-hour', w, now, lisbon)).toBe(
      `Blue hour now, until ${formatTime(t.dusk, lisbon.timeZone)}`,
    );
  });

  it('says tomorrow after the window', () => {
    const now = at(t.sunset, 30);
    const w = nextLightWindow('golden-evening', now, lisbon);
    expect(lightPhrase('golden-evening', w, now, lisbon)).toMatch(/^Golden light tomorrow at \d\d:\d\d$/);
  });
});

describe('lightChip', () => {
  it('counts down to golden hour', () => {
    expect(lightChip(at(t.goldenHour, -37), lisbon)).toEqual({
      text: 'Golden hour in 37 min',
      active: false,
    });
  });

  it('gives a clock time when golden hour is hours away', () => {
    expect(lightChip(NOON, lisbon).text).toBe(
      `Golden hour ${formatTime(t.goldenHour, lisbon.timeZone)}`,
    );
  });

  it('is active during golden and blue hour', () => {
    expect(lightChip(at(t.goldenHour, 5), lisbon)).toEqual({ text: 'Golden hour now', active: true });
    expect(lightChip(at(t.sunset, 5), lisbon)).toEqual({ text: 'Blue hour now', active: true });
  });

  it('points to the next sunrise at night', () => {
    expect(lightChip(at(t.dusk, 60), lisbon).text).toMatch(/^Sunrise \d\d:\d\d$/);
  });
});

describe('bestWindowText', () => {
  it('gives the range today', () => {
    const w = nextLightWindow('golden-evening', NOON, lisbon);
    const tz = lisbon.timeZone;
    expect(bestWindowText(w, NOON, lisbon)).toBe(
      `Best ${formatTime(t.goldenHour, tz)}–${formatTime(t.sunset, tz)}`,
    );
  });

  it('says now while it lasts', () => {
    const now = at(t.goldenHour, 5);
    const w = nextLightWindow('golden-evening', now, lisbon);
    expect(bestWindowText(w, now, lisbon)).toBe(`Best now until ${formatTime(t.sunset, lisbon.timeZone)}`);
  });
});
