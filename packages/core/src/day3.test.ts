import SunCalc from 'suncalc';
import { describe, expect, it } from 'vitest';
import { buildAlerts, groupAlerts } from './alerts';
import { lisbon, lisbonSpots } from './sample/lisbon';
import { lisbonDetails } from './sample/lisbonDetails';
import { normalize, search } from './search';
import { assessWeather, cityHour, crowdInsight, dayTimeline } from './spot';
import type { Spot, Weather } from './types';

const NOON = new Date('2026-10-07T11:00:00Z'); // 12:00 in Lisbon
const t = SunCalc.getTimes(NOON, lisbon.lat, lisbon.lng);
const BEFORE_GOLDEN = new Date(t.goldenHour.getTime() - 37 * 60_000);
const detail = (id: string) => {
  const d = lisbonDetails[id];
  if (!d) throw new Error(id);
  return d;
};
const spot = (id: string): Spot => {
  const s = lisbonSpots.find((x) => x.id === id);
  if (!s) throw new Error(id);
  return s;
};

describe('sample details', () => {
  it('exist for every sample spot, with a full day of crowd data', () => {
    for (const s of lisbonSpots) {
      const d = lisbonDetails[s.id];
      expect(d, s.id).toBeDefined();
      expect(d?.typicalCrowd).toHaveLength(17);
      expect(d?.routes.length).toBeGreaterThan(0);
    }
  });
});

describe('assessWeather', () => {
  const calm: Weather = {
    tempC: 21,
    feelsC: 20,
    condition: 'Clear',
    windKmh: 12,
    gustKmh: 20,
    rainPct: 0,
    visibilityKm: 18,
    cloudPct: 10,
  };

  it('calls calm weather safe', () => {
    expect(assessWeather(calm)).toEqual({ risk: 'safe', headline: 'Safe to go', reasons: [] });
  });

  it('flags strong gusts as risky', () => {
    expect(assessWeather({ ...calm, gustKmh: 72 }).risk).toBe('risky');
  });

  it('flags moderate rain as caution', () => {
    const a = assessWeather({ ...calm, rainPct: 45 });
    expect(a.risk).toBe('caution');
    expect(a.reasons).toEqual(['Rain possible (45%)']);
  });

  it('never downgrades risky to caution', () => {
    expect(assessWeather({ ...calm, gustKmh: 72, visibilityKm: 3 }).risk).toBe('risky');
  });

  it('marks the sample Cristo Rei forecast risky', () => {
    expect(assessWeather(detail('cristo-rei').weather).risk).toBe('risky');
  });
});

describe('crowdInsight', () => {
  it('finds the current hour in the city time zone', () => {
    expect(cityHour(NOON, lisbon)).toBe(12);
    const i = crowdInsight(spot('senhora-do-monte'), detail('senhora-do-monte').typicalCrowd, NOON, lisbon);
    expect(i.nowIndex).toBe(5);
  });

  it('says when a busy spot gets quiet', () => {
    const evening = new Date('2026-10-07T17:30:00Z'); // 18:30 in Lisbon
    const i = crowdInsight(spot('senhora-do-monte'), detail('senhora-do-monte').typicalCrowd, evening, lisbon);
    expect(i.comparison).toBe('About as busy as usual for this hour.');
    expect(i.quieterAfter).toBe(22);
  });

  it('does not promise a quieter time for a spot that is already quiet', () => {
    const i = crowdInsight(spot('sao-pedro'), detail('sao-pedro').typicalCrowd, NOON, lisbon);
    expect(i.quieterAfter).toBeUndefined();
  });
});

describe('dayTimeline', () => {
  it('orders daylight, golden, blue and night', () => {
    const d = dayTimeline(BEFORE_GOLDEN, lisbon);
    expect(d.segments.map((s) => s.kind)).toEqual(['day', 'golden', 'blue', 'night']);
    for (const s of d.segments) expect(s.to).toBeGreaterThanOrEqual(s.from);
    expect(d.nowAt).toBeGreaterThan(0);
    expect(d.nowAt).toBeLessThan((d.segments[1]?.from ?? 0));
  });

  it('hides the now marker outside 16:00–22:00', () => {
    expect(dayTimeline(NOON, lisbon).nowAt).toBeUndefined();
  });
});

describe('search', () => {
  it('ignores accents and case', () => {
    expect(normalize('São Pedro')).toBe('sao pedro');
    expect(search('reykjavik', lisbonSpots).cities.map((c) => c.id)).toEqual(['reykjavik']);
    expect(search('SAO', lisbonSpots).spots.map((s) => s.spot.id)).toEqual(['sao-pedro']);
  });

  it('matches spots by area', () => {
    const ids = search('alfama', lisbonSpots).spots.map((s) => s.spot.id);
    expect(ids).toEqual(['santa-luzia', 'laundry-alley']);
  });

  it('returns nothing for an empty query', () => {
    expect(search('  ', lisbonSpots)).toEqual({ cities: [], spots: [] });
  });
});

describe('alerts', () => {
  const alerts = buildAlerts(BEFORE_GOLDEN, lisbon, lisbonSpots);

  it('computes the golden-hour alert from the real sun', () => {
    const light = alerts.find((a) => a.kind === 'light');
    expect(light?.title).toBe('Golden hour in 37 min');
  });

  it('newest first', () => {
    const times = alerts.map((a) => a.at.getTime());
    expect([...times].sort((a, b) => b - a)).toEqual(times);
  });

  it('groups by day and filters by kind', () => {
    const all = groupAlerts(alerts, 'all', BEFORE_GOLDEN, lisbon);
    expect(all.map((g) => g.label)).toEqual(['Today', 'Yesterday']);
    const closures = groupAlerts(alerts, 'closures', BEFORE_GOLDEN, lisbon).flatMap((g) => g.items);
    expect(closures.every((a) => a.kind === 'closure' || a.kind === 'reopened')).toBe(true);
  });

  it('has no golden-hour alert at noon', () => {
    expect(buildAlerts(NOON, lisbon, lisbonSpots).some((a) => a.kind === 'light')).toBe(false);
  });
});
