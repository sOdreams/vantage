import { type CrowdLevel, crowdLabel, type ExploreSpot } from '@vantage/core';
import { fonts, type Palette } from '@vantage/tokens';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { CameraIcon } from './icons';

export function crowdColor(p: Palette, level: CrowdLevel): string {
  return level === 0 ? p.quiet : level === 1 ? p.moderate : p.busy;
}

export function crowdTextColor(p: Palette, level: CrowdLevel): string {
  return level === 0 ? p.quietText : level === 1 ? p.moderateText : p.busyText;
}

type MarkerProps = {
  item: ExploreSpot;
  /** Centre of the marker in screen points. */
  x: number;
  y: number;
  featured: boolean;
  onPress: () => void;
};

const DIMMED = 0.28;

/**
 * One spot on the map. Circle with the rating, ringed in its crowd colour;
 * hidden gems are violet diamonds; the top pick is larger, with a camera,
 * amber viewfinder corners and its name.
 */
export function SpotMarker({ item, x, y, featured, onPress }: MarkerProps) {
  const { palette } = useTheme();
  const { spot } = item;
  const ring = crowdColor(palette, spot.crowd);
  const label = `${spot.gem ? 'Hidden gem: ' : ''}${spot.name}, ${crowdLabel[spot.crowd].toLowerCase()} now${
    spot.closure ? `, ${spot.closure.toLowerCase()}` : ''
  }`;

  if (featured && !item.dimmed) {
    return <FeaturedMarker item={item} x={x} y={y} label={label} onPress={onPress} />;
  }

  const size = spot.gem ? 26 : 38;
  return (
    <View
      style={{
        position: 'absolute',
        left: x - 22,
        top: y - 22,
        width: 44,
        height: 44,
        opacity: item.dimmed ? DIMMED : 1,
        pointerEvents: 'box-none',
      }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
      >
        {spot.gem ? (
          <View
            style={{
              width: size,
              height: size,
              transform: [{ rotate: '45deg' }],
              backgroundColor: palette.surface,
              borderWidth: 2,
              borderColor: palette.gem,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: palette.gem }} />
          </View>
        ) : (
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: palette.surface,
              borderWidth: 3,
              borderColor: ring,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: palette.text }}>
              {spot.rating.toFixed(1)}
            </Text>
          </View>
        )}
      </Pressable>

      {spot.closure && !item.dimmed && (
        <>
          <View
            style={{
              position: 'absolute',
              left: 34,
              top: -2,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: palette.busy,
              borderWidth: 2,
              borderColor: palette.map,
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: '#1A0A08' }}>!</Text>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 56,
              top: 12,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: palette.surface,
              borderWidth: 1,
              borderColor: palette.busy,
              pointerEvents: 'none',
            }}
          >
            <Text style={{ fontFamily: fonts.bodySemi, fontSize: 11, color: palette.busyText }}>
              {spot.closure}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const CORNER = 16;
const FRAME = 76;

function FeaturedMarker({
  item,
  x,
  y,
  label,
  onPress,
}: {
  item: ExploreSpot;
  x: number;
  y: number;
  label: string;
  onPress: () => void;
}) {
  const { palette, map } = useTheme();
  const { spot } = item;
  const ring = crowdColor(palette, spot.crowd);
  const corner = { position: 'absolute' as const, width: CORNER, height: CORNER, borderColor: map.route };
  const half = FRAME / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: x - half,
        top: y - half,
        width: FRAME,
        height: FRAME,
        pointerEvents: 'box-none',
      }}
    >
      {/* Viewfinder corners */}
      <View style={[corner, { left: 0, top: 0, borderTopWidth: 2.5, borderLeftWidth: 2.5 }]} />
      <View style={[corner, { right: 0, top: 0, borderTopWidth: 2.5, borderRightWidth: 2.5 }]} />
      <View style={[corner, { left: 0, bottom: 0, borderBottomWidth: 2.5, borderLeftWidth: 2.5 }]} />
      <View style={[corner, { right: 0, bottom: 0, borderBottomWidth: 2.5, borderRightWidth: 2.5 }]} />

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Top pick: ${label}`}
        style={{
          position: 'absolute',
          left: half - 24,
          top: half - 24,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: palette.surface,
          borderWidth: 3,
          borderColor: ring,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CameraIcon size={22} color={palette.accent} />
      </Pressable>

      {/* Name tag under the marker */}
      <View
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          left: half - 74,
          top: FRAME + 4,
          width: 148,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 10,
          backgroundColor: palette.selectedBg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
        }}
      >
        <Text
          numberOfLines={1}
          style={{ flex: 1, fontFamily: fonts.bodyBold, fontSize: 12, color: palette.selectedText }}
        >
          {shortName(spot.name)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: ring }} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 12, color: palette.selectedText }}>
            {crowdLabel[spot.crowd]}
          </Text>
        </View>
      </View>
    </View>
  );
}

/** "Miradouro da Senhora do Monte" → "Senhora do Monte" for the small tag. */
function shortName(name: string): string {
  return name.replace(/^Miradouro (da|de|do|dos|das) /, '');
}
