import type { ImageSourcePropType } from 'react-native';

const p1 = require('../../assets/photos/p1-golden-rooftops.jpg');
const p2 = require('../../assets/photos/p2-dawn-river.jpg');
const p3 = require('../../assets/photos/p3-warm-alley.jpg');
const p4 = require('../../assets/photos/p4-terrace-sunset.jpg');
const p5 = require('../../assets/photos/p5-blue-hour.jpg');
const p6 = require('../../assets/photos/p6-storm-bridge.jpg');

/** Placeholder photographs until members upload real ones (Day 9). */
const cover: Record<string, ImageSourcePropType> = {
  'senhora-do-monte': p1,
  'santa-luzia': p2,
  'tram-28': p3,
  'sao-pedro': p4,
  'rua-augusta': p5,
  'cristo-rei': p6,
  'tiled-stairwell': p3,
  'garage-rooftop': p4,
  'laundry-alley': p3,
};

export const coverPhoto = (spotId: string): ImageSourcePropType => cover[spotId] ?? p1;

/** Three "community shots" with the time they were taken. Sample. */
export const communityShots = (spotId: string): { source: ImageSourcePropType; time: string }[] => {
  const first = coverPhoto(spotId);
  return [
    { source: first, time: '18:52' },
    { source: p5, time: '19:21' },
    { source: p2, time: '07:44' },
  ];
};
