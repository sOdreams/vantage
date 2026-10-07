import { lisbonSpots, search } from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { useRouter } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { comingSoon } from '@/ui/comingSoon';
import { tap } from '@/ui/haptics';
import { BackIcon, CloseIcon, LocateIcon, PinIcon, PlusIcon, SearchIcon, StarIcon } from '@/ui/icons';
import { Caption } from '@/ui/kit';

const lightLabel = {
  'golden-evening': 'Best at golden hour',
  'blue-hour': 'Best at blue hour',
  sunrise: 'Best at sunrise',
  morning: 'Best in the morning',
} as const;

/** Search a city or a spot. Only Lisbon has spots so far; other cities say so. */
export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { palette } = useTheme();
  const [query, setQuery] = useState('');
  const results = search(query, lisbonSpots);
  const empty = query.trim() !== '' && results.cities.length === 0 && results.spots.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, paddingTop: insets.top + 8 }}>
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16 }}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.xl,
            backgroundColor: palette.surface,
            borderWidth: 1,
            borderColor: palette.line,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BackIcon size={20} color={palette.text} strokeWidth={2} />
        </Pressable>
        <View
          style={{
            flex: 1,
            height: 52,
            borderRadius: radius.xl,
            backgroundColor: palette.surface,
            borderWidth: 1.5,
            borderColor: palette.accent,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 14,
          }}
        >
          <SearchIcon size={20} color={palette.text} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search a place or city"
            placeholderTextColor={palette.text2}
            returnKeyType="search"
            autoCorrect={false}
            style={{ flex: 1, fontFamily: fonts.body, fontSize: 16, color: palette.text }}
            accessibilityLabel="Search a place or city"
          />
          {query !== '' && (
            <Pressable onPress={() => setQuery('')} accessibilityRole="button" accessibilityLabel="Clear" hitSlop={10}>
              <CloseIcon size={18} color={palette.text2} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 18, paddingBottom: insets.bottom + 32 }}
      >
        <Row
          icon={<LocateIcon size={20} color={palette.quiet} />}
          title="Use my current location"
          note="Arrives with the real map (Day 6)"
          onPress={() => comingSoon('Using your location', 6)}
        />

        {query.trim() === '' && (
          <View style={{ gap: 6 }}>
            <Caption>Try</Caption>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {['Lisbon', 'Alfama', 'Miradouro', 'Barcelona'].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => {
                    tap();
                    setQuery(s);
                  }}
                  style={{
                    height: 34,
                    paddingHorizontal: 12,
                    borderRadius: radius.md,
                    backgroundColor: palette.surface,
                    borderWidth: 1,
                    borderColor: palette.line,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: fonts.bodySemi, fontSize: 13, color: palette.text }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {results.cities.length > 0 && (
          <View style={{ gap: 6 }}>
            <Caption>Places</Caption>
            {results.cities.map((c) => (
              <Row
                key={c.id}
                icon={<PinIcon size={20} color={palette.text} />}
                title={`${c.name}, ${c.country}`}
                note={c.available ? `City · ${c.spots} spots` : 'Not mapped yet · coming with real data'}
                dim={!c.available}
                onPress={() => {
                  if (c.available) {
                    tap();
                    router.back();
                  } else {
                    comingSoon(`${c.name}`, 5);
                  }
                }}
              />
            ))}
          </View>
        )}

        {results.spots.length > 0 && (
          <View style={{ gap: 6 }}>
            <Caption>Spots in Lisbon</Caption>
            {results.spots.map(({ spot }) => (
              <Row
                key={spot.id}
                icon={<StarIcon size={20} color={palette.accent} />}
                title={spot.name}
                note={`★ ${spot.rating.toFixed(1)} · ${spot.area} · ${lightLabel[spot.light]}`}
                warning={spot.closure}
                onPress={() => {
                  tap();
                  router.replace({ pathname: '/spot/[id]', params: { id: spot.id } });
                }}
              />
            ))}
          </View>
        )}

        {empty && (
          <Text style={{ fontFamily: fonts.body, fontSize: 15, color: palette.text2 }}>
            Nothing found for “{query.trim()}”.
          </Text>
        )}

        <View
          style={{
            marginTop: 8,
            padding: 16,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: palette.goldBorder,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Text style={{ flex: 1, fontFamily: fonts.bodySemi, fontSize: 14, color: palette.text }}>
            Know a great spot that isn’t here?
          </Text>
          <Pressable
            onPress={() => comingSoon('Adding a spot', 9)}
            accessibilityRole="button"
            style={{
              height: 40,
              paddingHorizontal: 12,
              borderRadius: radius.md,
              backgroundColor: palette.accent,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <PlusIcon size={16} color={palette.onAccent} strokeWidth={2.4} />
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: palette.onAccent }}>Add a spot</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  icon,
  title,
  note,
  warning,
  dim,
  onPress,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  warning?: string;
  dim?: boolean;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        minHeight: 60,
        padding: 12,
        borderRadius: radius.lg,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.line,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        opacity: dim ? 0.6 : 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: palette.raised,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: palette.text }}>{title}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>{note}</Text>
        {warning && (
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 12, color: palette.busyText }}>{warning}</Text>
        )}
      </View>
    </Pressable>
  );
}
