import type { Spot } from './types';

export type CityResult = {
  kind: 'city';
  id: string;
  name: string;
  country: string;
  spots: number;
  /** Only cities with data in the app can be opened today. */
  available: boolean;
};

export type SpotResult = { kind: 'spot'; spot: Spot };

/** SAMPLE: the cities the search knows. Only Lisbon has spots in the app so far. */
export const knownCities: CityResult[] = [
  { kind: 'city', id: 'lisbon', name: 'Lisbon', country: 'Portugal', spots: 9, available: true },
  { kind: 'city', id: 'barcelona', name: 'Barcelona', country: 'Spain', spots: 0, available: false },
  { kind: 'city', id: 'porto', name: 'Porto', country: 'Portugal', spots: 0, available: false },
  { kind: 'city', id: 'kyoto', name: 'Kyoto', country: 'Japan', spots: 0, available: false },
  { kind: 'city', id: 'reykjavik', name: 'Reykjavík', country: 'Iceland', spots: 0, available: false },
];

/** Lower-case and strip accents, so "sao" finds "São" and "reykjavik" finds "Reykjavík". */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Matches cities by name or country, and spots by name or area. */
export function search(
  query: string,
  spots: Spot[],
  cities: CityResult[] = knownCities,
): { cities: CityResult[]; spots: SpotResult[] } {
  const q = normalize(query);
  if (!q) return { cities: [], spots: [] };
  const words = q.split(/\s+/);
  const hit = (text: string) => {
    const t = normalize(text);
    return words.every((w) => t.includes(w));
  };
  return {
    cities: cities.filter((c) => hit(`${c.name} ${c.country}`)),
    spots: spots
      .filter((s) => hit(`${s.name} ${s.area}`))
      .sort((a, b) => b.rating - a.rating)
      .map((spot) => ({ kind: 'spot' as const, spot })),
  };
}
