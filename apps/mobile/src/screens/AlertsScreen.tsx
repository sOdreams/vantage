import {
  type Alert,
  type AlertFilter,
  type AlertKind,
  buildAlerts,
  formatTime,
  groupAlerts,
  lisbon,
  lisbonSpots,
} from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNow } from '@/hooks/useNow';
import { useTheme } from '@/theme/ThemeProvider';
import { tap } from '@/ui/haptics';
import { CheckInIcon, RainIcon, StarIcon, SunsetIcon, WarningIcon } from '@/ui/icons';
import { Caption, ScreenTitle, Segmented } from '@/ui/kit';

const city = lisbon;

function ago(at: Date, now: Date): string {
  const mins = Math.round((now.getTime() - at.getTime()) / 60_000);
  if (mins < 1) return 'Now';
  if (mins < 60) return `${mins} min ago`;
  if (mins < 24 * 60) return `${Math.round(mins / 60)} h ago`;
  return `Yesterday, ${formatTime(at, city.timeZone)}`;
}

/** Closures, weather risk and good light for saved spots and places nearby. */
export function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { palette } = useTheme();
  const now = useNow();
  const [filter, setFilter] = useState<AlertFilter>('all');
  const groups = groupAlerts(buildAlerts(now, city, lisbonSpots), filter, now, city);

  const look: Record<AlertKind, { color: string; bg: string; Icon: typeof StarIcon }> = {
    closure: { color: palette.busy, bg: palette.riskBg, Icon: WarningIcon },
    weather: { color: palette.moderate, bg: palette.cautionBg, Icon: RainIcon },
    light: { color: palette.accent, bg: palette.goldBg, Icon: SunsetIcon },
    reopened: { color: palette.ok, bg: palette.okBg, Icon: CheckInIcon },
    gem: { color: palette.gem, bg: palette.blueBg, Icon: StarIcon },
  };

  const open = (a: Alert) => {
    if (!a.spotId) return;
    tap();
    router.push({ pathname: '/spot/[id]', params: { id: a.spotId } });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}
    >
      <ScreenTitle title="Alerts" subtitle="For your saved spots and places near you" />
      <Segmented
        options={[
          { value: 'all', label: 'All' },
          { value: 'closures', label: 'Closures' },
          { value: 'weather', label: 'Weather' },
          { value: 'light', label: 'Light' },
        ]}
        value={filter}
        onChange={(v) => {
          tap();
          setFilter(v);
        }}
      />

      {groups.length === 0 && (
        <Text style={{ fontFamily: fonts.body, fontSize: 15, color: palette.text2, paddingTop: 12 }}>
          Nothing here right now.
        </Text>
      )}

      {groups.map((g) => (
        <View key={g.label} style={{ gap: 8 }}>
          <Caption>{g.label}</Caption>
          {g.items.map((a) => {
            const { color, bg, Icon } = look[a.kind];
            return (
              <Pressable
                key={a.id}
                onPress={() => open(a)}
                disabled={!a.spotId}
                accessibilityRole={a.spotId ? 'button' : 'text'}
                style={{
                  padding: 14,
                  borderRadius: radius.xl,
                  backgroundColor: palette.surface,
                  borderWidth: 1,
                  borderColor: palette.line,
                  flexDirection: 'row',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={20} color={color} strokeWidth={2} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: palette.text }}>{a.title}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.text2 }}>
                    {a.body}
                  </Text>
                  <Text style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.text2 }}>{ago(a.at, now)}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}

      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
        The golden-hour alert uses the real sun. Closures and weather here are samples until live data
        (Days 7–8); push notifications arrive with accounts.
      </Text>
    </ScrollView>
  );
}
