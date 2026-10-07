import type { DaySentence, Lead, Lens } from '@vantage/core';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useTone } from './SpotMark';
import { mono, serif, serifItalic, TOUCH } from './styles';

const GUTTER = 20;

/** City name as the headline, with one sentence about the light today. */
export function Masthead({
  top,
  caption,
  city,
  sentence,
}: {
  top: number;
  caption: string;
  city: string;
  sentence: DaySentence;
}) {
  const { palette } = useTheme();
  return (
    <View style={{ position: 'absolute', left: GUTTER, right: GUTTER, top, pointerEvents: 'box-none' }}>
      <Text style={[mono(10.5), { color: palette.ink2, lineHeight: 16 }]}>{caption}</Text>
      <Text
        accessibilityRole="header"
        style={[serif, { fontSize: 54, lineHeight: 58, letterSpacing: -1.5, color: palette.ink }]}
      >
        {city}
      </Text>
      <Text style={[serif, { fontSize: 16, lineHeight: 22, color: palette.ink2 }]}>
        {sentence.before}
        <Text
          style={{
            color: palette.ink,
            textDecorationLine: 'underline',
            textDecorationColor: palette.ink,
          }}
        >
          {sentence.time}
        </Text>
        {sentence.after}
      </Text>
    </View>
  );
}

/** One line, only when something is wrong. Tapping it switches to the safety lens. */
export function NoticeLine({ top, text, onPress }: { top: number; text: string; onPress: () => void }) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Notice: ${text}. Show safety`}
      style={{
        position: 'absolute',
        left: GUTTER,
        right: GUTTER,
        top,
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <View style={{ width: 7, height: 7, backgroundColor: palette.accent }} />
      <Text style={[mono(10.5), { color: palette.accent }]}>Notice</Text>
      <Text style={[serifItalic, { flex: 1, fontSize: 15, lineHeight: 20, color: palette.ink }]}>
        {text}
      </Text>
    </Pressable>
  );
}

const LENSES: { value: Lens; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'crowd', label: 'Crowd' },
  { value: 'safety', label: 'Safety' },
];

/** The bottom of the Atlas: one named spot, then the lens switch. Nothing else. */
export function AtlasFooter({
  bottom,
  lens,
  lead,
  onLens,
}: {
  bottom: number;
  lens: Lens;
  lead: Lead;
  onLens: (lens: Lens) => void;
}) {
  const { palette } = useTheme();
  const tone = useTone();
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: GUTTER,
        paddingBottom: bottom,
        backgroundColor: palette.ground,
      }}
    >
      {lens === 'crowd' && <CrowdKey />}

      <View
        accessibilityLiveRegion="polite"
        style={{
          borderTopWidth: 1,
          borderTopColor: palette.rule,
          paddingTop: 14,
          paddingBottom: 16,
          gap: 4,
        }}
      >
        <Text style={[mono(10.5), { color: palette.ink2 }]}>{lead.kicker}</Text>
        <Text style={[serif, { fontSize: 30, lineHeight: 34, letterSpacing: -0.6, color: palette.ink }]}>
          {lead.name}
        </Text>
        <Text style={[serifItalic, { fontSize: 15, lineHeight: 21, color: tone(lead.tone) }]}>
          {lead.line}
        </Text>
      </View>

      <View
        accessibilityRole="tablist"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 26,
          borderTopWidth: 1,
          borderTopColor: palette.rule,
        }}
      >
        {LENSES.map((l) => {
          const active = l.value === lens;
          return (
            <Pressable
              key={l.value}
              onPress={() => onLens(l.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={{ minHeight: TOUCH, justifyContent: 'center' }}
            >
              <View
                style={{
                  paddingBottom: 3,
                  borderBottomWidth: 1.5,
                  borderBottomColor: active ? palette.ink : 'transparent',
                }}
              >
                <Text style={[mono(11, 0.14), { color: active ? palette.ink : palette.ink2 }]}>
                  {l.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Legend for the crowd glyphs, shown only with the crowd lens. */
function CrowdKey() {
  const { palette } = useTheme();
  const item = (label: string, fill: number) => (
    <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          borderWidth: 1.25,
          borderColor: palette.ink,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: fill * 7.5,
            backgroundColor: palette.ink,
          }}
        />
      </View>
      <Text style={[mono(9.5, 0.1), { color: palette.ink2 }]}>{label}</Text>
    </View>
  );
  return (
    <View
      style={{ position: 'absolute', right: GUTTER, top: -30, flexDirection: 'row', gap: 14 }}
      accessibilityLabel="Key: empty circle quiet, half full moderate, full busy"
    >
      {item('Quiet', 0)}
      {item('Moderate', 0.5)}
      {item('Busy', 1)}
    </View>
  );
}
