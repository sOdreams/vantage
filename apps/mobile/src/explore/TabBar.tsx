import { fonts } from '@vantage/tokens';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { BellIcon, BookmarkIcon, CompassIcon, PlusIcon, UserIcon } from '@/ui/icons';

export const TAB_BAR_HEIGHT = 62;

export type Tab = 'explore' | 'saved' | 'alerts' | 'profile';

/** Five slots: four destinations and the amber "add a spot" action in the middle. */
export function TabBar({
  bottomInset,
  active,
  onPress,
}: {
  bottomInset: number;
  active: Tab;
  onPress: (tab: Tab | 'add') => void;
}) {
  const { palette } = useTheme();
  const item = (tab: Tab, label: string, Icon: typeof CompassIcon) => {
    const on = tab === active;
    const color = on ? palette.accent : palette.text2;
    return (
      <Pressable
        key={tab}
        onPress={() => onPress(tab)}
        accessibilityRole="tab"
        accessibilityState={{ selected: on }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 48 }}
      >
        <Icon size={22} color={color} />
        <Text style={{ fontFamily: on ? fonts.bodySemi : fonts.bodyMedium, fontSize: 11, color }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      accessibilityRole="tablist"
      style={{
        height: TAB_BAR_HEIGHT + bottomInset,
        paddingBottom: bottomInset,
        paddingHorizontal: 8,
        backgroundColor: palette.bg,
        borderTopWidth: 1,
        borderTopColor: palette.line,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {item('explore', 'Explore', CompassIcon)}
      {item('saved', 'Saved', BookmarkIcon)}
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Pressable
          onPress={() => onPress('add')}
          accessibilityRole="button"
          accessibilityLabel="Add a spot"
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: palette.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlusIcon size={24} color={palette.onAccent} strokeWidth={2.4} />
        </Pressable>
      </View>
      {item('alerts', 'Alerts', BellIcon)}
      {item('profile', 'Profile', UserIcon)}
    </View>
  );
}
