import { crowdBars, crowdNow, type ExploreSpot } from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { forwardRef } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { SlidersIcon } from '@/ui/icons';
import { coverPhoto } from '@/ui/photos';
import { crowdColor, crowdTextColor } from './Markers';


export const SHEET_HEIGHT = 232;
export const CARD_WIDTH = 286;
const CARD_GAP = 12;

type Props = {
  title: string;
  subtitle: string;
  items: ExploreSpot[];
  selectedId?: string;
  onPressSpot: (id: string) => void;
  onSort: () => void;
};

/** The list half of the screen: what's on the map, as cards you can swipe. */
export const SpotSheet = forwardRef<FlatList<ExploreSpot>, Props>(function SpotSheet(
  { title, subtitle, items, selectedId, onPressSpot, onSort },
  ref,
) {
  const { palette } = useTheme();
  return (
    <View
      style={{
        height: SHEET_HEIGHT,
        backgroundColor: palette.surface,
        borderTopWidth: 1,
        borderColor: palette.line,
        borderTopLeftRadius: radius.sheet,
        borderTopRightRadius: radius.sheet,
      }}
    >
      <View
        style={{
          width: 36,
          height: 4,
          borderRadius: 2,
          backgroundColor: palette.line,
          alignSelf: 'center',
          marginTop: 8,
        }}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: 2 }}>
          <Text
            accessibilityRole="header"
            style={{ fontFamily: fonts.display, fontSize: 18, color: palette.text }}
          >
            {title}
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: palette.text2 }}>{subtitle}</Text>
        </View>
        <Pressable
          onPress={onSort}
          accessibilityRole="button"
          accessibilityLabel="Sort and filter"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: palette.line,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SlidersIcon size={20} color={palette.text} />
        </Pressable>
      </View>

      <FlatList
        ref={ref}
        horizontal
        data={items}
        keyExtractor={(i) => i.spot.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: CARD_GAP }}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + CARD_GAP,
          offset: (CARD_WIDTH + CARD_GAP) * index,
          index,
        })}
        ListEmptyComponent={
          <Text style={{ fontFamily: fonts.body, fontSize: 14, color: palette.text2, paddingTop: 24 }}>
            Nothing matches this filter here yet.
          </Text>
        }
        renderItem={({ item }) => (
          <SpotCard
            item={item}
            selected={item.spot.id === selectedId}
            onPress={() => onPressSpot(item.spot.id)}
          />
        )}
      />
    </View>
  );
});

function SpotCard({
  item,
  selected,
  onPress,
}: {
  item: ExploreSpot;
  selected: boolean;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  const { spot } = item;
  const lit = crowdBars[spot.crowd];
  const color = crowdColor(palette, spot.crowd);
  const status = spot.closure ?? 'Open';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${spot.name}, rated ${spot.rating}, ${spot.area}, ${status}, ${crowdNow[spot.crowd]}, ${item.best}`}
      style={{
        width: CARD_WIDTH,
        height: 128,
        borderRadius: radius.xl,
        backgroundColor: palette.raised,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? palette.accent : palette.line,
        flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      <Image source={coverPhoto(spot.id)} style={{ width: 92, height: '100%' }} resizeMode="cover" />
      <View style={{ flex: 1, padding: 12, gap: 6, minWidth: 0 }}>
        <Text
          numberOfLines={2}
          style={{ fontFamily: fonts.bodySemi, fontSize: 14, lineHeight: 18, color: palette.text }}
        >
          {spot.name}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
          ★ {spot.rating.toFixed(1)} · {spot.area} ·{' '}
          <Text style={{ color: spot.closure ? palette.busyText : palette.text2 }}>{status}</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
            {[6, 9, 12, 15].map((h, i) => (
              <View
                key={h}
                style={{
                  width: 4,
                  height: h,
                  borderRadius: 1,
                  backgroundColor: i < lit ? color : palette.line,
                }}
              />
            ))}
          </View>
          <Text
            style={{
              fontFamily: fonts.bodySemi,
              fontSize: 12,
              color: crowdTextColor(palette, spot.crowd),
            }}
          >
            {crowdNow[spot.crowd]}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.mono, fontSize: 11, color: palette.accentText }}>{item.best}</Text>
      </View>
    </Pressable>
  );
}
