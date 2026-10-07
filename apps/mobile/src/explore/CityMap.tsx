import { fonts } from '@vantage/tokens';
import { memo } from 'react';
import Svg, { Ellipse, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

/** The drawn map's own frame. Spot x/y values are in this frame. */
export const MAP_WIDTH = 390;
export const MAP_HEIGHT = 560;

const minorRoads = [
  'M20 160 L120 180 L200 170',
  'M40 330 L120 320 L190 350',
  'M200 240 L260 260 L330 250',
  'M230 370 L300 350 L370 360',
  'M100 120 L130 220',
  'M260 140 L240 220',
  'M20 520 L140 506 L260 520 L390 508',
  'M90 500 L110 560',
];

const majorRoads = [
  'M150 40 L172 230 L182 360',
  'M0 414 C90 404 170 408 240 398 C310 388 350 394 390 386',
  'M182 360 C220 330 250 300 290 230 L330 90',
  'M60 180 C90 250 120 320 150 400',
  'M310 230 C334 280 350 330 362 392',
  'M10 296 C100 286 200 296 390 276',
];

const districts = [
  { text: 'BAIRRO ALTO', x: 24, y: 240 },
  { text: 'BAIXA', x: 110, y: 374 },
  { text: 'ALFAMA', x: 282, y: 406 },
  { text: 'GRAÇA', x: 344, y: 222 },
];

/**
 * A simplified drawing of central Lisbon. Stand-in until real map tiles
 * (MapLibre, Day 6). Scaled to cover the given box; see useMapFrame.
 */
export const CityMap = memo(function CityMap({ width, height }: { width: number; height: number }) {
  const { palette, map } = useTheme();
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', left: 0, top: 0 }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Rect x={-200} y={-200} width={MAP_WIDTH + 400} height={MAP_HEIGHT + 400} fill={palette.map} />
      <Path
        d="M-10 96 C30 80 84 92 100 124 C114 156 74 190 30 186 C0 184 -10 160 -10 140Z"
        fill={map.park}
      />
      <Ellipse cx={250} cy={318} rx={40} ry={24} fill={map.block} />
      <Path
        d="M0 428 C80 418 160 424 230 414 C300 404 350 410 390 402 V470 C340 476 280 472 220 478 C150 484 70 476 0 482Z"
        fill={map.water}
      />
      <G fill="none" stroke={map.minorRoad} strokeWidth={3} strokeLinecap="round">
        {minorRoads.map((d) => (
          <Path key={d} d={d} />
        ))}
      </G>
      <G fill="none" stroke={map.majorRoad} strokeWidth={7} strokeLinecap="round">
        {majorRoads.map((d) => (
          <Path key={d} d={d} />
        ))}
      </G>
      <SvgText
        x={40}
        y={460}
        fill={map.waterLabel}
        fontSize={11}
        letterSpacing={3}
        fontFamily={fonts.body}
      >
        RIO TEJO
      </SvgText>
      <G fill={map.label} fontSize={10} letterSpacing={2.5} fontFamily={fonts.bodySemi}>
        {districts.map((d) => (
          <SvgText key={d.text} x={d.x} y={d.y}>
            {d.text}
          </SvgText>
        ))}
      </G>
    </Svg>
  );
});
