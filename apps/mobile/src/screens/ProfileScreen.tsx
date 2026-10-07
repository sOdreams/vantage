import { fonts, radius, type ThemePreference } from '@vantage/tokens';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaved } from '@/state/SavedProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { comingSoon } from '@/ui/comingSoon';
import { tap } from '@/ui/haptics';
import { UserIcon } from '@/ui/icons';
import { Caption, ScreenTitle, Segmented } from '@/ui/kit';

/** Account (coming with sign-in), appearance and a short note on the data. */
export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { palette, preference, setPreference } = useTheme();
  const { saved } = useSaved();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 32, gap: 24 }}
    >
      <ScreenTitle title="Profile" />

      <View
        style={{
          padding: 16,
          borderRadius: radius.xl,
          backgroundColor: palette.surface,
          borderWidth: 1,
          borderColor: palette.line,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: palette.raised,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UserIcon size={24} color={palette.text2} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: palette.text }}>Guest</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: palette.text2 }}>
            {saved.size} saved {saved.size === 1 ? 'spot' : 'spots'} this session
          </Text>
        </View>
        <Pressable
          onPress={() => comingSoon('Creating an account', 9)}
          accessibilityRole="button"
          style={{
            height: 40,
            paddingHorizontal: 14,
            borderRadius: radius.md,
            backgroundColor: palette.accent,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: palette.onAccent }}>Sign up</Text>
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        <Caption>Appearance</Caption>
        <Segmented<ThemePreference>
          options={[
            { value: 'system', label: 'System' },
            { value: 'dark', label: 'Dark' },
            { value: 'light', label: 'Light' },
          ]}
          value={preference}
          onChange={(v) => {
            tap();
            setPreference(v);
          }}
        />
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
          System follows your iPhone’s light and dark setting.
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <Caption>About the data</Caption>
        <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: palette.text2 }}>
          Golden hour, blue hour and sunrise times are calculated for today. Crowds, ratings, reviews,
          closures and weather are sample data while VANTAGE is being built.
        </Text>
      </View>
    </ScrollView>
  );
}
