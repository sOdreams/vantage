import type { Fact, Review, Route, SpotDetails, Weather } from '../types';

/**
 * SAMPLE DATA for the spot pages. Coordinates are real; everything else
 * (counts, reviews, routes, weather) is illustrative until real data arrives:
 * weather on Day 7, crowds on Day 8, reviews and photos on Day 9.
 */

const clearEvening: Weather = {
  tempC: 21,
  feelsC: 20,
  condition: 'Clear',
  windKmh: 12,
  gustKmh: 20,
  rainPct: 0,
  visibilityKm: 18,
  cloudPct: 10,
};

/** Typical busyness 07:00–23:00 for a sunset viewpoint. */
const sunsetCurve = [5, 11, 18, 27, 34, 38, 40, 40, 41, 50, 76, 81, 86, 63, 41, 25, 14];
/** For a morning spot. */
const morningCurve = [30, 55, 62, 48, 40, 36, 34, 33, 30, 28, 26, 24, 20, 14, 10, 6, 4];
/** For a city-centre landmark. */
const centreCurve = [8, 15, 30, 45, 55, 62, 66, 64, 60, 58, 62, 70, 74, 60, 45, 30, 18];
/** For a hidden gem. */
const quietCurve = [4, 8, 10, 12, 12, 10, 9, 9, 10, 12, 16, 18, 15, 10, 6, 4, 2];

const openStatus = (note: string) => ({ title: 'Open now · 24 h', note });

const viewpointFacts = (extra: Fact[] = []): Fact[] => [
  { label: 'Entry', value: 'Free' },
  { label: 'Hours', value: 'Open 24 h' },
  { label: 'Tripod', value: 'Allowed', tone: 'good' },
  { label: 'Drone', value: 'No-fly zone', tone: 'bad' },
  ...extra,
];

const review = (
  initials: string,
  name: string,
  daysAgo: number,
  light: string,
  text: string,
  worthIt = true,
): Review => ({ initials, name, daysAgo, light, text, worthIt });

const walk = (title: string, note: string, minutes: number): Route => ({
  mode: 'walk',
  title,
  note,
  minutes,
});

export const lisbonDetails: Record<string, SpotDetails> = {
  'senhora-do-monte': {
    lat: 38.7193,
    lng: -9.1327,
    category: 'Viewpoint',
    ratingsCount: 3214,
    photoCount: 412,
    status: openStatus('Verified 2 h ago by 6 visitors · no works reported'),
    typicalCrowd: sunsetCurve,
    shotTip:
      '71% of top-rated shots here were taken between 18:30 and 19:30. Sunset light warms the castle walls and the rooftops below.',
    spotNote:
      'The cobblestone climb is steep and gets slippery after rain. Wear shoes with grip.',
    standHere: {
      text: 'North wall, left of the kiosk. Arrive 20 min before golden hour to get a gap at the wall.',
      confirmations: 38,
    },
    routes: [
      { mode: 'tram', title: 'Tram 28 to Graça', note: 'Then 6 min uphill on foot', minutes: 18 },
      { mode: 'bus', title: 'Bus to Graça stop', note: 'Less crowded than the tram', minutes: 21 },
      walk('Walk from Martim Moniz', 'Steep stairs, great views on the way', 15),
    ],
    facts: viewpointFacts([
      { label: 'Step-free', value: 'No, stairs' },
      { label: 'On site', value: 'Kiosk, benches' },
    ]),
    weather: clearEvening,
    worthIt: { pct: 94, votes: 1204 },
    reviews: [
      review(
        'AD',
        'Ana D.',
        2,
        'Golden hour',
        'Worth every step. Got there at 18:10 and still found a gap at the wall. Bring a zoom lens for the castle shots.',
      ),
      review(
        'MR',
        'Marco R.',
        5,
        'Sunrise',
        'Sunset is packed. Came back at sunrise instead: almost empty and the light on the river is gorgeous.',
      ),
    ],
  },
  'santa-luzia': {
    lat: 38.7118,
    lng: -9.1303,
    category: 'Viewpoint',
    ratingsCount: 2540,
    photoCount: 288,
    status: openStatus('Scaffolding removed yesterday · confirmed by 12 visitors'),
    typicalCrowd: morningCurve,
    shotTip:
      'Most top-rated shots were taken in the first hour after sunrise, when the tiles and the river catch low side light.',
    standHere: {
      text: 'Under the pergola, framing the river through the bougainvillea.',
      confirmations: 21,
    },
    routes: [
      { mode: 'tram', title: 'Tram 28 to Largo Portas do Sol', note: 'Stops right outside', minutes: 14 },
      walk('Walk from Baixa', 'Uphill through Alfama', 17),
    ],
    facts: viewpointFacts([
      { label: 'Step-free', value: 'Yes, from tram stop' },
      { label: 'On site', value: 'Café nearby' },
    ]),
    weather: clearEvening,
    worthIt: { pct: 91, votes: 860 },
    reviews: [
      review('JL', 'Joana L.', 1, 'Sunrise', 'Arrived at 07:30 and had the pergola to myself for twenty minutes.'),
    ],
  },
  'tram-28': {
    lat: 38.7116,
    lng: -9.1298,
    category: 'Street',
    ratingsCount: 1780,
    photoCount: 196,
    status: openStatus('Trams running normally · checked 1 h ago'),
    typicalCrowd: centreCurve,
    shotTip:
      'Shoot from the inside of the curve as the tram leans in; a 1/250 s shutter freezes it while low sun runs down the street.',
    standHere: {
      text: 'Inside of the bend by the railing, facing downhill.',
      confirmations: 17,
    },
    routes: [
      { mode: 'tram', title: 'Tram 28 to Portas do Sol', note: 'Ride it, then shoot it', minutes: 12 },
      walk('Walk from Baixa', 'Steep but short', 14),
    ],
    facts: [
      { label: 'Entry', value: 'Free' },
      { label: 'Tripod', value: 'Not practical', tone: 'bad' },
      { label: 'Step-free', value: 'Yes' },
      { label: 'Traffic', value: 'Watch the tram' },
    ],
    weather: clearEvening,
    worthIt: { pct: 86, votes: 512 },
    reviews: [
      review('TK', 'Tomás K.', 3, 'Golden hour', 'Waited three trams to get the lean right. Patience pays off.'),
    ],
  },
  'sao-pedro': {
    lat: 38.7154,
    lng: -9.1442,
    category: 'Viewpoint',
    ratingsCount: 1950,
    photoCount: 240,
    status: openStatus('Gardens open · checked 3 h ago'),
    typicalCrowd: quietCurve.map((v) => v * 3),
    shotTip:
      'The castle hill faces you directly, so the last half hour before sunset lights it from the side.',
    standHere: {
      text: 'Lower terrace, near the bust, with the castle centred.',
      confirmations: 14,
    },
    routes: [
      { mode: 'tram', title: 'Glória funicular', note: 'From Restauradores', minutes: 10 },
      walk('Walk from Chiado', 'Flat for most of the way', 12),
    ],
    facts: viewpointFacts([
      { label: 'Step-free', value: 'Yes, upper terrace' },
      { label: 'On site', value: 'Kiosk, benches' },
    ]),
    weather: clearEvening,
    worthIt: { pct: 92, votes: 640 },
    reviews: [
      review('LS', 'Lucía S.', 4, 'Golden hour', 'Much quieter than the famous viewpoints, and the castle view is better.'),
    ],
  },
  'rua-augusta': {
    lat: 38.7084,
    lng: -9.1365,
    category: 'Monument',
    ratingsCount: 4120,
    photoCount: 530,
    status: openStatus('Square open · arch viewpoint open until 21:00'),
    typicalCrowd: centreCurve,
    shotTip: 'At blue hour the arch lights come on while the sky still holds colour behind it.',
    routes: [
      { mode: 'metro', title: 'Metro to Baixa-Chiado', note: 'Then 5 min on foot', minutes: 12 },
      walk('Walk along Rua Augusta', 'Flat, busy at night', 8),
    ],
    facts: [
      { label: 'Entry', value: 'Free (square)' },
      { label: 'Tripod', value: 'Allowed', tone: 'good' },
      { label: 'Drone', value: 'No-fly zone', tone: 'bad' },
      { label: 'Step-free', value: 'Yes' },
    ],
    weather: clearEvening,
    worthIt: { pct: 88, votes: 970 },
    reviews: [
      review('PB', 'Pedro B.', 6, 'Blue hour', 'Low angle from the centre of the square, long exposure for the trams.'),
    ],
  },
  'cristo-rei': {
    lat: 38.6787,
    lng: -9.1713,
    category: 'Viewpoint',
    ratingsCount: 2108,
    photoCount: 305,
    status: {
      title: 'Top platform closed today',
      note: 'The lift to the upper platform is stopped because of high winds. The ground-level terrace and gardens are still open.',
      reports: [
        { when: '17:12', text: 'Venue: lift stopped, high winds' },
        { when: '16:40', text: '3 visitors: platform roped off' },
        { when: 'Yesterday', text: 'Open as normal' },
      ],
    },
    typicalCrowd: quietCurve.map((v) => v * 2),
    shotTip: 'From the upper platform the whole bridge and the city fit in one frame at sunset.',
    spotNote: 'The upper level is fully exposed. Gusts above 50 km/h make it unsafe to stand at the edge.',
    routes: [
      { mode: 'ferry', title: 'Ferry to Cacilhas', note: 'Then bus 101', minutes: 35 },
      { mode: 'bus', title: 'Bus over the bridge', note: 'From Praça de Espanha', minutes: 30 },
    ],
    facts: [
      { label: 'Entry', value: '€8 upper platform' },
      { label: 'Hours', value: '09:30–18:45' },
      { label: 'Tripod', value: 'Allowed', tone: 'good' },
      { label: 'Step-free', value: 'Yes, by lift' },
    ],
    weather: {
      tempC: 18,
      feelsC: 14,
      condition: 'Windy, rain later',
      windKmh: 48,
      gustKmh: 72,
      rainPct: 80,
      visibilityKm: 4,
      cloudPct: 85,
    },
    worthIt: { pct: 89, votes: 730 },
    reviews: [
      review('IN', 'Inês N.', 9, 'Sunset', 'The view of the bridge is unreal. Check the wind before going.'),
    ],
  },
  'tiled-stairwell': {
    lat: 38.7158,
    lng: -9.1352,
    category: 'Hidden gem',
    ratingsCount: 42,
    photoCount: 4,
    status: openStatus('Public stairway · added by @rita.frames last week'),
    typicalCrowd: quietCurve,
    shotTip: 'Morning light falls straight down the stairs for about an hour after the sun clears the roofs.',
    spotNote: 'The tiles are slick when wet.',
    routes: [walk('Walk from Martim Moniz', 'Up Rua dos Cavaleiros', 7)],
    facts: [
      { label: 'Entry', value: 'Free' },
      { label: 'Tripod', value: 'Narrow, be kind', tone: 'bad' },
    ],
    weather: clearEvening,
    worthIt: { pct: 97, votes: 31 },
    reviews: [
      review('RF', 'Rita F.', 7, 'Morning', 'Found it by accident. The blue tiles glow when the sun hits them.'),
    ],
  },
  'garage-rooftop': {
    lat: 38.7131,
    lng: -9.1461,
    category: 'Hidden gem',
    ratingsCount: 28,
    photoCount: 6,
    status: openStatus('Public car park roof · open until 22:00'),
    typicalCrowd: quietCurve,
    shotTip: 'Faces the river and the bridge; the sun sets almost behind it in autumn.',
    routes: [walk('Walk from Cais do Sodré', 'Lift to the top floor', 9)],
    facts: [
      { label: 'Entry', value: 'Free' },
      { label: 'Hours', value: 'Until 22:00' },
      { label: 'Tripod', value: 'Allowed', tone: 'good' },
    ],
    weather: clearEvening,
    worthIt: { pct: 90, votes: 19 },
    reviews: [review('DV', 'Duarte V.', 12, 'Sunset', 'No one else up there. Bring a long lens for the bridge.')],
  },
  'laundry-alley': {
    lat: 38.7112,
    lng: -9.1281,
    category: 'Hidden gem',
    ratingsCount: 35,
    photoCount: 9,
    status: openStatus('Residential street · please be quiet'),
    typicalCrowd: quietCurve.map((v) => v * 2),
    shotTip: 'Washing lines and tiles in soft morning light; overcast days work well too.',
    routes: [walk('Walk from Santa Luzia', 'Down the stairs into Alfama', 5)],
    facts: [
      { label: 'Entry', value: 'Free' },
      { label: 'Respect', value: 'People live here' },
    ],
    weather: clearEvening,
    worthIt: { pct: 84, votes: 22 },
    reviews: [review('CM', 'Clara M.', 2, 'Morning', 'Ask before photographing anyone at their door.')],
  },
};
