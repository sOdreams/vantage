import { space } from '@vantage/tokens';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CropMarks } from '@/components/CropMarks';
import { Hairline } from '@/components/Hairline';
import { Text } from '@/components/Text';
import { type ThemePreference, useTheme } from '@/theme/ThemeProvider';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'darkroom', label: 'Darkroom' },
  { value: 'gallery', label: 'Gallery' },
];

/**
 * Day 1 screen: proves fonts, tokens and both themes work on a real phone.
 * Replaced by the Atlas on Day 2.
 */
export default function Index() {
  const insets = useSafeAreaInsets();
  const { name, palette, preference, setPreference } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.ground }}
      contentContainerStyle={{
        paddingTop: insets.top + space.lg,
        paddingBottom: insets.bottom + space.xl,
        paddingHorizontal: space.lg,
        gap: space.lg,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="caption" tone="label">
          Vol. 01 · Lisbon
        </Text>
        <Text variant="caption" tone="label">
          38.71°N 9.14°W
        </Text>
      </View>

      <Hairline />

      <View style={{ paddingVertical: space.xxl, paddingHorizontal: space.md }}>
        <CropMarks />
        <Text variant="display" accessibilityRole="header">
          Vantage
        </Text>
        <Text variant="italic" tone="ink2" style={{ marginTop: space.xs }}>
          Find where the light is, before everyone else does.
        </Text>
      </View>

      <Hairline />

      <View style={{ gap: space.sm }}>
        <Text variant="caption" tone="label">
          Theme
        </Text>
        <View style={{ flexDirection: 'row', gap: space.lg }}>
          {OPTIONS.map((o) => {
            const active = preference === o.value;
            return (
              <Pressable
                key={o.value}
                onPress={() => setPreference(o.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                hitSlop={12}
                style={{
                  paddingBottom: space.xxs,
                  borderBottomWidth: 1,
                  borderBottomColor: active ? palette.ink : 'transparent',
                }}
              >
                <Text variant="data" tone={active ? 'ink' : 'ink2'}>
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Hairline />

      <View style={{ gap: space.xs }}>
        <Row label="Theme in use" value={name} />
        <Row label="Serif" value="Newsreader" />
        <Row label="Mono" value="IBM Plex Mono" />
        <Row label="Build" value="Day 1 · setup" />
      </View>

      <Hairline />

      <View style={{ flexDirection: 'row', gap: space.xs, alignItems: 'baseline' }}>
        <Text variant="caption" tone="accent">
          Notice
        </Text>
        <Text variant="data" tone="ink2" style={{ flex: 1 }}>
          The accent colour is kept for warnings only: closures, weather risk, crowds.
        </Text>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text variant="caption" tone="label">
        {label}
      </Text>
      <Text variant="data">{value}</Text>
    </View>
  );
}
