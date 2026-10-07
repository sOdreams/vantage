import { useWindowDimensions } from 'react-native';
import { PLATE_HEIGHT, PLATE_WIDTH } from './lisbonPlate';

export type PlateFrame = {
  width: number;
  height: number;
  /** Converts a point in the 390 × 844 plate to screen points. */
  project: (x: number, y: number) => { x: number; y: number };
};

/** Same maths as SVG preserveAspectRatio="xMidYMid slice": cover and centre. */
export function usePlateFrame(): PlateFrame {
  const { width, height } = useWindowDimensions();
  const scale = Math.max(width / PLATE_WIDTH, height / PLATE_HEIGHT);
  const ox = (width - PLATE_WIDTH * scale) / 2;
  const oy = (height - PLATE_HEIGHT * scale) / 2;
  return {
    width,
    height,
    project: (x, y) => ({ x: ox + x * scale, y: oy + y * scale }),
  };
}
