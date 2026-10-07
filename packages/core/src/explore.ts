import { bestWindowText, type LightWindow, nextLightWindow } from './sun';
import type { City, CrowdLevel, Filter, Spot } from './types';

export const crowdLabel: Record<CrowdLevel, string> = { 0: 'Quiet', 1: 'Moderate', 2: 'Busy' };

/** Text used in cards: "Quiet now", "Moderate", "Busy now". */
export const crowdNow: Record<CrowdLevel, string> = { 0: 'Quiet now', 1: 'Moderate', 2: 'Busy now' };

/** How many of the four crowd bars are lit. */
export const crowdBars: Record<CrowdLevel, number> = { 0: 1, 1: 2, 2: 3 };

export type ExploreSpot = {
  spot: Spot;
  window: LightWindow;
  /** "Best 18:37–19:12" etc. */
  best: string;
  /** Hidden by the current filter: drawn faded on the map, left out of the list. */
  dimmed: boolean;
};

export type ExploreView = {
  /** Spots in the bottom sheet, in order. */
  list: ExploreSpot[];
  /** Every spot, for the map. */
  all: ExploreSpot[];
  /** The top pick, drawn larger with a label. Undefined if the list is empty. */
  featuredId: string | undefined;
  title: string;
  subtitle: string;
};

function matches(spot: Spot, filter: Filter): boolean {
  switch (filter) {
    case 'popular':
      return true;
    case 'quiet':
      return spot.crowd === 0 && !spot.risk;
    case 'gems':
      return spot.gem;
  }
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Everything the Explore screen shows, worked out in one place so it can be
 * tested without a phone.
 */
export function exploreView(spots: Spot[], filter: Filter, now: Date, city: City): ExploreView {
  const all = spots.map((spot) => {
    const window = nextLightWindow(spot.light, now, city);
    return { spot, window, best: bestWindowText(window, now, city), dimmed: !matches(spot, filter) };
  });

  const startOf = (s: ExploreSpot) => (s.window.active ? now.getTime() : s.window.start.getTime());

  // Best light first; ties go to the better-rated spot; spots with a warning go last.
  const list = all
    .filter((s) => !s.dimmed)
    .sort(
      (a, b) =>
        Number(Boolean(a.spot.risk)) - Number(Boolean(b.spot.risk)) ||
        startOf(a) - startOf(b) ||
        b.spot.rating - a.spot.rating,
    );

  const top = list[0];
  const featuredId = top && !top.spot.risk ? top.spot.id : undefined;

  const n = list.length;
  const text = {
    popular: {
      title: plural(n, 'spot in view', 'spots in view'),
      subtitle: 'Sorted by best light right now',
    },
    quiet: {
      title: plural(n, 'quiet spot nearby', 'quiet spots nearby'),
      subtitle: 'Few people right now, best light first',
    },
    gems: {
      title: plural(n, 'hidden gem', 'hidden gems'),
      subtitle: 'Found by photographers, best light first',
    },
  }[filter];

  return { list, all, featuredId, ...text };
}
