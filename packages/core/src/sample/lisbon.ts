import type { City, Spot } from '../types';

/**
 * SAMPLE DATA. Place names are real Lisbon viewpoints; crowd levels,
 * head counts and warnings are illustrative until live data arrives (Day 8).
 */

export const lisbon: City = {
  id: 'lisbon',
  name: 'Lisbon',
  lat: 38.7223,
  lng: -9.1393,
  timeZone: 'Europe/Lisbon',
};

export const lisbonSpots: Spot[] = [
  {
    id: '01',
    name: 'Senhora do Monte',
    area: 'Graça',
    x: 292,
    y: 292,
    gem: false,
    light: 'golden-evening',
    crowd: 2,
    people: 120,
    dek: 'The highest balcony in the old city. At sunset the light rakes across the castle walls.',
  },
  {
    id: '02',
    name: 'Santa Luzia',
    area: 'Alfama',
    x: 276,
    y: 446,
    gem: false,
    light: 'sunrise',
    crowd: 1,
    people: 45,
    dek: 'Tiles, bougainvillea and the river, at their best when the morning sun is low.',
  },
  {
    id: '03',
    name: 'Tram 28 curve',
    area: 'Castelo',
    x: 222,
    y: 360,
    gem: false,
    light: 'golden-evening',
    crowd: 2,
    people: 80,
    dek: 'The yellow tram leaning into the bend while low light runs down the street.',
  },
  {
    id: '04',
    name: 'São Pedro de Alcântara',
    area: 'Bairro Alto',
    x: 106,
    y: 300,
    gem: false,
    light: 'golden-evening',
    crowd: 0,
    people: 20,
    dek: 'A garden terrace facing the castle hill, quieter than its famous neighbours.',
  },
  {
    id: '05',
    name: 'Rua Augusta arch',
    area: 'Baixa',
    x: 176,
    y: 500,
    gem: false,
    light: 'blue-hour',
    crowd: 1,
    people: 60,
    dek: 'The arch framing the square and the river as the city lights come on.',
  },
  {
    id: '06',
    name: 'Tiled stairwell',
    area: 'Mouraria',
    x: 196,
    y: 268,
    gem: true,
    light: 'morning',
    crowd: 0,
    people: 4,
    dek: 'A hidden flight of tiled steps, added by a member last week.',
  },
  {
    id: '07',
    name: 'Cristo Rei',
    area: 'Almada',
    x: 270,
    y: 612,
    gem: false,
    light: 'golden-evening',
    crowd: 0,
    people: 15,
    risk: 'Gusts 72 km/h',
    dek: 'The whole city and the bridge from across the river, when the wind allows.',
  },
];

/** A closure notice shown above the map. Sample. */
export const lisbonNotice = { spotId: '07', text: 'Cristo Rei: upper platform closed' };
