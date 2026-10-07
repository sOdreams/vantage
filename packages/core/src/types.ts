/** The three ways to read the map. Only one is shown at a time. */
export type Lens = 'light' | 'crowd' | 'safety';

/** 0 quiet, 1 moderate, 2 busy. Drawn as an empty, half or full circle. */
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
  /** Two-digit number shown on the map, e.g. "01". */
  id: string;
  name: string;
  area: string;
  /** Position on the city plate, in the 390 × 844 design frame. */
  x: number;
  y: number;
  /** Added by a member rather than a well-known spot. Shown in italics. */
  gem: boolean;
  light: LightKind;
  crowd: CrowdLevel;
  /** Rough head count right now. */
  people: number;
  /** A reason not to go today (closure, weather). Shown in the accent colour. */
  risk?: string;
  dek: string;
};

export type Tone = 'ink' | 'ink2' | 'dim' | 'accent';
