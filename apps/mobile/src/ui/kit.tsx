import { fonts, radius } from '@vantage/tokens';
import type { ReactNode } from 'react';
import { Pressable, type StyleProp, Text, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

/** Rounded panel with a small mono caption, used for every section of the spot page. */
export function Section({
  label,
  right,
  children,
}: {
  label: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  const { palette } = useTheme();
  return (
    <View
      style={{
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.line,
        borderRadius: 20,
        padding: 18,
        gap: 14,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Caption>{label}</Caption>
        {right}
      </View>
      {children}
    </View>
  );
}

/** Mono, uppercase, tracked: section labels. */
export function Caption({ children, color }: { children: ReactNode; color?: string }) {
  const { palette } = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={{
        fontFamily: fonts.mono,
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: color ?? palette.text2,
      }}
    >
      {children}
    </Text>
  );
}

/** Big screen title for the tab screens. */
export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const { palette } = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <Text
        accessibilityRole="header"
        style={{ fontFamily: fonts.displayHeavy, fontSize: 30, lineHeight: 34, color: palette.text }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ fontFamily: fonts.body, fontSize: 14, color: palette.text2 }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

/** Pill-shaped choice used for filters (Alerts) and the theme switch (Profile). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { palette } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          height: 44,
          padding: 4,
          borderRadius: radius.lg,
          backgroundColor: palette.surface,
          borderWidth: 1,
          borderColor: palette.line,
          flexDirection: 'row',
          gap: 4,
        },
        style,
      ]}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
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
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Full-width outlined button. */
export function OutlineButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        height: 52,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: palette.line,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      {icon}
      <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: palette.text }}>{label}</Text>
    </Pressable>
  );
}
