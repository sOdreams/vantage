import type { Filter, LightChip } from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BellIcon, PinIcon, SearchIcon, SunsetIcon } from './icons';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'quiet', label: 'Quiet now' },
  { value: 'gems', label: 'Hidden gems' },
];

type Props = {
  top: number;
  city: string;
  chip: LightChip;
  alerts: number;
  filter: Filter;
  onFilter: (f: Filter) => void;
  onSearch: () => void;
  onAlerts: () => void;
};

/** Search, alerts, today's context chips and the three filters. */
export function TopBar({ top, city, chip, alerts, filter, onFilter, onSearch, onAlerts }: Props) {
  const { palette } = useTheme();
  const floating = {
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.line,
  };
  const golden = { bg: palette.goldBg, border: palette.goldBorder, text: palette.goldText };

  return (
    <View style={{ position: 'absolute', left: 16, right: 16, top, gap: 10 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Pressable
          onPress={onSearch}
          accessibilityRole="search"
          accessibilityLabel="Search a place or city"
          style={[
            floating,
            {
              flex: 1,
              height: 52,
              borderRadius: radius.xl,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingHorizontal: 16,
            },
          ]}
        >
          <SearchIcon size={20} color={palette.text} />
          <Text style={{ fontFamily: fonts.body, fontSize: 15, color: palette.text2 }}>
            Search a place or city
          </Text>
        </Pressable>
        <Pressable
          onPress={onAlerts}
          accessibilityRole="button"
          accessibilityLabel={alerts > 0 ? `Alerts, ${alerts} new` : 'Alerts'}
          style={[
            floating,
            {
              width: 52,
              height: 52,
              borderRadius: radius.xl,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <BellIcon size={22} color={palette.text} />
          {alerts > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 11,
                right: 12,
                width: 9,
                height: 9,
                borderRadius: 5,
                backgroundColor: palette.busy,
                borderWidth: 2,
                borderColor: palette.surface,
              }}
            />
          )}
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <View style={[floating, chipStyle]}>
          <PinIcon size={14} color={palette.text} strokeWidth={2} />
          <Text style={[chipText, { color: palette.text }]}>{city}</Text>
        </View>
        <View
          style={[chipStyle, { backgroundColor: golden.bg, borderWidth: 1, borderColor: golden.border }]}
          accessibilityLabel={chip.text}
        >
          <SunsetIcon size={14} color={golden.text} strokeWidth={2} />
          <Text style={[chipText, { color: golden.text }]}>{chip.text}</Text>
        </View>
      </View>

      <View
        accessibilityRole="tablist"
        style={[
          floating,
          { height: 44, padding: 4, borderRadius: radius.lg, flexDirection: 'row', gap: 4 },
        ]}
      >
        {FILTERS.map((f) => {
          const active = f.value === filter;
          return (
            <Pressable
              key={f.value}
              onPress={() => onFilter(f.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={{
                flex: 1,
                borderRadius: radius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? palette.selectedBg : 'transparent',
              }}
            >
              <Text
                style={{
                  fontFamily: active ? fonts.bodyBold : fonts.bodySemi,
                  fontSize: 13,
                  color: active ? palette.selectedText : palette.text2,
                }}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const chipStyle = {
  height: 32,
  paddingHorizontal: 10,
  borderRadius: radius.md,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 6,
};

const chipText = { fontFamily: fonts.bodySemi, fontSize: 12 };
