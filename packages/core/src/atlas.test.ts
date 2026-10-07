import SunCalc from 'suncalc';
import { describe, expect, it } from 'vitest';
import { leadFor, markStyle, spotLight } from './atlas';
import { lisbon, lisbonSpots } from './sample/lisbon';
import type { Spot } from './types';

const NOON = new Date('2026-10-07T11:00:00Z');
const t = SunCalc.getTimes(NOON, lisbon.lat, lisbon.lng);
const BEFORE_GOLDEN = new Date(t.goldenHour.getTime() - 37 * 60_000);

const rows = spotLight(lisbonSpots, BEFORE_GOLDEN, lisbon);
const row = (id: string) => {
  const r = rows.find((x) => x.spot.id === id);
  if (!r) throw new Error(`no spot ${id}`);
  return r;
};

describe('spotLight', () => {
  it('marks the evening golden-light spots as best before sunset', () => {
    const best = rows.filter((r) => r.best).map((r) => r.spot.id);
    expect(best).toEqual(['01', '03', '04']);
  });

  it('never marks a spot with a warning as best', () => {
    expect(row('07').best).toBe(false);
  });
});

describe('markStyle', () => {
  it('light lens: only best spots get a time', () => {
    expect(markStyle(row('01'), 'light', lisbon).meta).toMatch(/^\d\d:\d\d$/);
    expect(markStyle(row('02'), 'light', lisbon).meta).toBe('');
  });

  it('crowd lens: fill follows how busy it is', () => {
    expect(markStyle(row('01'), 'crowd', lisbon).fillPct).toBe(100);
    expect(markStyle(row('02'), 'crowd', lisbon).fillPct).toBe(50);
    expect(markStyle(row('04'), 'crowd', lisbon).fillPct).toBe(0);
    expect(markStyle(row('01'), 'crowd', lisbon).meta).toBe('~120');
  });

  it('safety lens: only warnings use the accent, everything else steps back', () => {
    const risky = markStyle(row('07'), 'safety', lisbon);
    expect(risky.glyphTone).toBe('accent');
    expect(risky.meta).toBe('Gusts 72 km/h');
    expect(markStyle(row('01'), 'safety', lisbon).opacity).toBeLessThan(1);
  });

  it('the accent never appears outside the safety lens', () => {
    for (const r of rows) {
      for (const lens of ['light', 'crowd'] as const) {
        const s = markStyle(r, lens, lisbon);
        expect([s.glyphTone, s.numberTone, s.metaTone]).not.toContain('accent');
      }
    }
  });
});

describe('leadFor', () => {
  it('light: the first spot with golden light next', () => {
    const lead = leadFor(rows, 'light', BEFORE_GOLDEN, lisbon);
    expect(lead.name).toBe('Senhora do Monte');
    expect(lead.kicker).toBe('01 / 07 · Best light next');
    expect(lead.line).toBe('Golden light in 37 minutes · busy now');
  });

  it('crowd: the quietest spot that is worth going to', () => {
    const lead = leadFor(rows, 'crowd', BEFORE_GOLDEN, lisbon);
    expect(lead.name).toBe('São Pedro de Alcântara');
    expect(lead.line).toBe('About 20 people now · golden light in 37 minutes');
  });

  it('safety: the spot to skip, in the accent colour', () => {
    const lead = leadFor(rows, 'safety', BEFORE_GOLDEN, lisbon);
    expect(lead.name).toBe('Cristo Rei');
    expect(lead.line).toBe('Not today: gusts 72 km/h');
    expect(lead.tone).toBe('accent');
  });

  it('safety with no warnings says all clear', () => {
    const safe: Spot[] = lisbonSpots.map(({ risk: _risk, ...s }) => s);
    const lead = leadFor(spotLight(safe, BEFORE_GOLDEN, lisbon), 'safety', BEFORE_GOLDEN, lisbon);
    expect(lead.kicker).toBe('All clear');
  });

  it('a tapped spot replaces the suggestion', () => {
    const lead = leadFor(rows, 'light', BEFORE_GOLDEN, lisbon, '05');
    expect(lead.kicker).toBe('05 / 07 · Baixa');
    expect(lead.name).toBe('Rua Augusta arch');
    expect(lead.line).toMatch(/^Blue hour in \d+ minutes · some people now$/);
  });
});
