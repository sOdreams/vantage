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

export type Weather = {
  tempC: number;
  feelsC: number;
  condition: string;
  windKmh: number;
  gustKmh: number;
  /** Chance of rain over the next few hours, 0–100. */
  rainPct: number;
  visibilityKm: number;
  cloudPct: number;
};

export type Route = {
  mode: 'tram' | 'bus' | 'walk' | 'metro' | 'ferry';
  title: string;
  note: string;
  minutes: number;
};

export type Fact = { label: string; value: string; tone?: 'good' | 'bad' };

export type Review = {
  initials: string;
  name: string;
  daysAgo: number;
  light: string;
  text: string;
  worthIt: boolean;
};

export type StatusReport = { when: string; text: string };

export type SpotDetails = {
  lat: number;
  lng: number;
  category: string;
  ratingsCount: number;
  photoCount: number;
  /** Shown in the green or red status card under the title. */
  status: { title: string; note: string; reports?: StatusReport[] };
  /** Typical busyness from 07:00 to 23:00, one value per hour, 0–100. */
  typicalCrowd: number[];
  shotTip: string;
  spotNote?: string;
  standHere?: { text: string; confirmations: number };
  routes: Route[];
  facts: Fact[];
  weather: Weather;
  worthIt: { pct: number; votes: number };
  reviews: Review[];
};
