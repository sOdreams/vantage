import { crowdNow, exploreView, lisbon, lisbonSpots } from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { crowdTextColor } from '@/explore/Markers';
import { useNow } from '@/hooks/useNow';
import { useSaved } from '@/state/SavedProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { tap } from '@/ui/haptics';
import { BookmarkIcon } from '@/ui/icons';
import { ScreenTitle } from '@/ui/kit';
import { coverPhoto } from '@/ui/photos';

/** Spots the user bookmarked, best light first. */
export function SavedScreen({ onExplore }: { onExplore: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { palette } = useTheme();
  const now = useNow();
  const { saved, toggle } = useSaved();
  const items = exploreView(
    lisbonSpots.filter((s) => saved.has(s.id)),
    'popular',
    now,
    lisbon,
  ).list;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 32, gap: 16 }}
    >
      <ScreenTitle
        title="Saved"
        subtitle={
          items.length === 0
            ? 'Tap the bookmark on any spot to keep it here'
            : `${items.length} ${items.length === 1 ? 'spot' : 'spots'} · best light first · kept for this session`
        }
      />

      {items.length === 0 && (
        <Pressable
          onPress={() => {
            tap();
            onExplore();
          }}
          accessibilityRole="button"
          style={{
            height: 52,
            borderRadius: radius.lg,
            backgroundColor: palette.accent,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: palette.onAccent }}>Explore spots</Text>
        </Pressable>
      )}

      {items.map(({ spot, best }) => (
        <Pressable
          key={spot.id}
          onPress={() => {
            tap();
            router.push({ pathname: '/spot/[id]', params: { id: spot.id } });
          }}
          accessibilityRole="button"
          style={{
            height: 104,
            borderRadius: radius.xl,
            backgroundColor: palette.surface,
            borderWidth: 1,
            borderColor: palette.line,
            flexDirection: 'row',
            overflow: 'hidden',
          }}
        >
          <Image source={coverPhoto(spot.id)} style={{ width: 96, height: '100%' }} resizeMode="cover" />
          <View style={{ flex: 1, padding: 12, gap: 4 }}>
            <Text numberOfLines={1} style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: palette.text }}>
              {spot.name}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
              ★ {spot.rating.toFixed(1)} · {spot.area}
              {spot.closure ? ' · ' : ''}
              {spot.closure && <Text style={{ color: palette.busyText }}>{spot.closure}</Text>}
            </Text>
            <Text style={{ fontFamily: fonts.bodySemi, fontSize: 12, color: crowdTextColor(palette, spot.crowd) }}>
              {crowdNow[spot.crowd]}
            </Text>
            <Text style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.accentText }}>{best}</Text>
          </View>
          <Pressable
            onPress={() => {
              tap();
              toggle(spot.id);
            }}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${spot.name} from saved`}
            style={{ width: 48, alignItems: 'center', justifyContent: 'center' }}
          >
            <BookmarkIcon size={20} color={palette.accent} />
          </Pressable>
        </Pressable>
      ))}
    </ScrollView>
  );
}
