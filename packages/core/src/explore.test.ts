import SunCalc from 'suncalc';
import { describe, expect, it } from 'vitest';
import { exploreView } from './explore';
import { lisbon, lisbonSpots } from './sample/lisbon';

const NOON = new Date('2026-10-07T11:00:00Z');
const t = SunCalc.getTimes(NOON, lisbon.lat, lisbon.lng);
const BEFORE_GOLDEN = new Date(t.goldenHour.getTime() - 37 * 60_000);

const ids = (xs: { spot: { id: string } }[]) => xs.map((x) => x.spot.id);

describe('exploreView: popular', () => {
  const v = exploreView(lisbonSpots, 'popular', BEFORE_GOLDEN, lisbon);

  it('lists every spot', () => {
    expect(v.list).toHaveLength(lisbonSpots.length);
    expect(v.title).toBe('9 spots in view');
  });

  it('puts the best-rated golden-hour spot first and features it', () => {
    expect(v.list[0]?.spot.id).toBe('senhora-do-monte');
    expect(v.featuredId).toBe('senhora-do-monte');
  });

  it('sorts golden hour before blue hour before tomorrow morning', () => {
    const order = ids(v.list);
    expect(order.indexOf('sao-pedro')).toBeLessThan(order.indexOf('rua-augusta'));
    expect(order.indexOf('rua-augusta')).toBeLessThan(order.indexOf('santa-luzia'));
  });

  it('puts the spot with a warning last', () => {
    expect(v.list.at(-1)?.spot.id).toBe('cristo-rei');
  });

  it('shows the real light window', () => {
    expect(v.list[0]?.best).toMatch(/^Best \d\d:\d\d–\d\d:\d\d$/);
    const sunrise = v.list.find((s) => s.spot.id === 'santa-luzia');
    expect(sunrise?.best).toMatch(/^Best tomorrow \d\d:\d\d–\d\d:\d\d$/);
  });
});

describe('exploreView: quiet now', () => {
  const v = exploreView(lisbonSpots, 'quiet', BEFORE_GOLDEN, lisbon);

  it('keeps only quiet spots without warnings', () => {
    expect(v.list.every((s) => s.spot.crowd === 0 && !s.spot.risk)).toBe(true);
    expect(ids(v.list)).not.toContain('cristo-rei');
    expect(v.title).toBe(`${v.list.length} quiet spots nearby`);
  });

  it('dims the busy ones on the map instead of hiding them', () => {
    const busy = v.all.find((s) => s.spot.id === 'senhora-do-monte');
    expect(busy?.dimmed).toBe(true);
    expect(v.all).toHaveLength(lisbonSpots.length);
  });

  it('features the best quiet spot', () => {
    expect(v.featuredId).toBe('sao-pedro');
  });
});

describe('exploreView: hidden gems', () => {
  it('lists only gems', () => {
    const v = exploreView(lisbonSpots, 'gems', BEFORE_GOLDEN, lisbon);
    expect(v.list.every((s) => s.spot.gem)).toBe(true);
    expect(v.title).toBe('3 hidden gems');
  });
});

describe('exploreView: edge cases', () => {
  it('handles an empty list', () => {
    const v = exploreView([], 'popular', BEFORE_GOLDEN, lisbon);
    expect(v.featuredId).toBeUndefined();
    expect(v.title).toBe('0 spots in view');
  });

  it('never features a spot with a warning', () => {
    const only = lisbonSpots.filter((s) => s.id === 'cristo-rei');
    expect(exploreView(only, 'popular', BEFORE_GOLDEN, lisbon).featuredId).toBeUndefined();
  });
});
