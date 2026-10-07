import { fonts } from '@vantage/tokens';
import { memo } from 'react';
import Svg, { G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';
import {
  contoursMajor,
  contoursMinor,
  districtLabels,
  PLATE_HEIGHT,
  PLATE_WIDTH,
  river,
  riverLabel,
  streets,
} from './lisbonPlate';

type Props = { width: number; height: number };

/**
 * The ambient layer: a quiet, hand-drawn city plate. No pins, no clutter.
 * Scaled to cover the screen; spots are positioned with the same transform
 * (see usePlateFrame).
 */
export const CityPlate = memo(function CityPlate({ width, height }: Props) {
  const { palette, map } = useTheme();
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${PLATE_WIDTH} ${PLATE_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', left: 0, top: 0 }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Rect x={-200} y={-200} width={PLATE_WIDTH + 400} height={PLATE_HEIGHT + 400} fill={palette.ground} />
      <G fill="none" stroke={map.contour} strokeWidth={0.8}>
        <Path d={contoursMinor} />
      </G>
      <G fill="none" stroke={map.contourMajor} strokeWidth={1}>
        <Path d={contoursMajor} />
      </G>
      <G fill="none" stroke={map.street} strokeWidth={0.75} strokeLinecap="round">
        {streets.map((d) => (
          <Path key={d} d={d} />
        ))}
      </G>
      <Path d={river} fill={map.water} stroke={map.shore} strokeWidth={1} />
      <G fill={palette.label} fontFamily={fonts.serifItalic} fontSize={12.5}>
        {districtLabels.map((l) => (
          <SvgText key={l.text} x={l.x} y={l.y}>
            {l.text}
          </SvgText>
        ))}
      </G>
      <SvgText
        x={riverLabel.x}
        y={riverLabel.y}
        fill={palette.label}
        fontFamily={fonts.serifItalic}
        fontSize={15}
        letterSpacing={6}
      >
        {riverLabel.text}
      </SvgText>
    </Svg>
  );
});
