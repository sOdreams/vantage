import SunCalc from 'suncalc';
import { describe, expect, it } from 'vitest';
import { lisbon } from './sample/lisbon';
import { daySentence, formatDay, formatTime, lightPhrase, nextLightWindow } from './sun';

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

describe('daySentence', () => {
  it('leads to golden hour in the afternoon', () => {
    const s = daySentence(at(t.goldenHour, -37), lisbon);
    expect(s).toEqual({
      before: 'Golden hour at ',
      time: formatTime(t.goldenHour, lisbon.timeZone),
      after: ', in 37 minutes.',
    });
  });

  it('drops the countdown when golden hour is hours away', () => {
    expect(daySentence(NOON, lisbon).after).toBe('.');
  });

  it('covers blue hour and night', () => {
    expect(daySentence(at(t.sunset, 5), lisbon).before).toBe('Blue hour now, until ');
    expect(daySentence(at(t.dusk, 60), lisbon).before).toBe('Night. First light at ');
  });
});
