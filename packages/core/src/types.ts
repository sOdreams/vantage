/** The three ways to filter the map, as a segmented control. */
export type Filter = 'popular' | 'quiet' | 'gems';

/** 0 quiet, 1 moderate, 2 busy. Blue, yellow, red. */
export type CrowdLevel = 0 | 1 | 2;

/** When a spot photographs best. */
export type LightKind = 'golden-evening' | 'blue-hour' | 'sunrise' | 'morning';

export type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** IANA time zone, used to show times in the city's local time. */
  timeZone: string;
};

export type Spot = {
  id: string;
  name: string;
  area: string;
  /** Position on the drawn city map, in its 390 × 560 frame. */
  x: number;
  y: number;
  /** Added by a member rather than a well-known spot. Drawn as a diamond. */
  gem: boolean;
  light: LightKind;
  crowd: CrowdLevel;
  /** Rough head count right now. */
  people: number;
  /** Average member rating, 1–5. */
  rating: number;
  /** Short closure text, e.g. "Partly closed". Shown as a red badge. */
  closure?: string;
  /** A reason not to go today, e.g. "Gusts 72 km/h". */
  risk?: string;
};
