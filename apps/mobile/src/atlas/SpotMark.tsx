import type { MarkStyle, Spot, Tone } from '@vantage/core';
import { fonts } from '@vantage/tokens';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { mono, TOUCH } from './styles';

type Props = {
  spot: Spot;
  style: MarkStyle;
  /** Centre of the glyph, in screen points. */
  x: number;
  y: number;
  selected: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

const CROP = 7;
const CROP_GAP = 3;

export function useTone() {
  const { palette, map } = useTheme();
  return (tone: Tone) =>
    tone === 'dim' ? map.dim : tone === 'accent' ? palette.accent : palette[tone];
}

/**
 * A numbered spot: a small circle (filled to show crowd, outlined in accent
 * for warnings), its number, and at most one short caption. The whole row is
 * a 44pt touch target even though the glyph is tiny.
 */
export function SpotMark({ spot, style, x, y, selected, accessibilityLabel, onPress }: Props) {
  const { palette } = useTheme();
  const tone = useTone();
  const opacity = useRef(new Animated.Value(style.opacity)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: style.opacity,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity, style.opacity]);

  const glyph = tone(style.glyphTone);
  const half = TOUCH / 2;

  return (
    <Animated.View
      style={{ position: 'absolute', left: x - half, top: y - half, opacity, pointerEvents: 'box-none' }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ selected }}
        style={{
          height: TOUCH,
          minWidth: TOUCH,
          paddingLeft: half - style.size / 2,
          paddingRight: 6,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <View
          style={{
            width: style.size,
            height: style.size,
            borderRadius: style.size / 2,
            borderWidth: 1.25,
            borderColor: glyph,
            backgroundColor: palette.ground,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: (style.fillPct / 100) * Math.max(0, style.size - 2.5),
              backgroundColor: glyph,
            }}
          />
        </View>
        <View style={{ gap: 1 }}>
          <Text
            style={[
              mono(10.5, 0.08),
              {
                lineHeight: 12,
                color: tone(style.numberTone),
                fontFamily: spot.gem ? fonts.monoItalic : fonts.mono,
                textShadowColor: palette.ground,
                textShadowRadius: 4,
              },
            ]}
          >
            {spot.id}
          </Text>
          {style.meta !== '' && (
            <Text
              style={[
                mono(9.5, 0.1),
                {
                  lineHeight: 11,
                  color: tone(style.metaTone),
                  textShadowColor: palette.ground,
                  textShadowRadius: 4,
                },
              ]}
            >
              {style.meta}
            </Text>
          )}
        </View>
      </Pressable>

      {selected && <CropMarks color={palette.ink} />}
    </Animated.View>
  );
}

/** Printer's crop marks around the 44pt target: "this one". */
function CropMarks({ color }: { color: string }) {
  const o = -(CROP + CROP_GAP);
  const h = { position: 'absolute' as const, width: CROP, height: 1, backgroundColor: color };
  const v = { position: 'absolute' as const, width: 1, height: CROP, backgroundColor: color };
  return (
    <View
      style={{ position: 'absolute', left: 0, top: 0, width: TOUCH, height: TOUCH, pointerEvents: 'none' }}
    >
      <View style={[h, { left: o, top: 0 }]} />
      <View style={[v, { left: 0, top: o }]} />
      <View style={[h, { right: o, top: 0 }]} />
      <View style={[v, { right: 0, top: o }]} />
      <View style={[h, { left: o, bottom: 0 }]} />
      <View style={[v, { left: 0, bottom: o }]} />
      <View style={[h, { right: o, bottom: 0 }]} />
      <View style={[v, { right: 0, bottom: o }]} />
    </View>
  );
}
