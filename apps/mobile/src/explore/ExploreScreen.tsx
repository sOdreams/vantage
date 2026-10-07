import {
  type ExploreSpot,
  exploreView,
  type Filter,
  lightChip,
  lisbon,
  lisbonSpots,
} from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { type FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNow } from '@/hooks/useNow';
import { useTheme } from '@/theme/ThemeProvider';
import { tap } from '@/ui/haptics';
import { CityMap, MAP_HEIGHT, MAP_WIDTH } from './CityMap';
import { SpotMarker } from './Markers';
import { CARD_WIDTH, SHEET_HEIGHT, SpotSheet } from './SpotSheet';
import { TopBar } from './TopBar';

/** One city for now. Real data (Day 5) makes this a choice. */
const city = lisbon;

/**
 * Explore: the map with every spot, filters on top, and a sheet of cards below.
 * Tap a marker to bring its card into view; tap a card or the top pick to open the spot.
 */
export function ExploreScreen({ onOpenAlerts }: { onOpenAlerts: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { palette } = useTheme();
  const now = useNow();
  const listRef = useRef<FlatList<ExploreSpot>>(null);
  const [size, setSize] = useState({ width: 390, height: 782 });

  const [filter, setFilter] = useState<Filter>('popular');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const view = useMemo(() => exploreView(lisbonSpots, filter, now, city), [filter, now]);
  const chip = lightChip(now, city);
  const alerts = lisbonSpots.filter((s) => s.closure || s.risk).length;

  // The sheet sits at the bottom of this screen; the map fills the space above and runs under it.
  const { width, height } = size;
  const sheetTop = height - SHEET_HEIGHT;
  const mapHeight = sheetTop + 28;
  const scale = Math.max(width / MAP_WIDTH, mapHeight / MAP_HEIGHT);
  const ox = (width - MAP_WIDTH * scale) / 2;
  const oy = (mapHeight - MAP_HEIGHT * scale) / 2;
  const project = (x: number, y: number) => ({ x: ox + x * scale, y: oy + y * scale });

  const featuredId = selectedId ?? view.featuredId;
  const openSpot = (id: string) => {
    tap();
    router.push({ pathname: '/spot/[id]', params: { id } });
  };

  const changeFilter = (f: Filter) => {
    if (f === filter) return;
    tap();
    setFilter(f);
    setSelectedId(undefined);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const pressMarker = (id: string) => {
    if (id === featuredId) {
      openSpot(id);
      return;
    }
    tap();
    setSelectedId(id);
    const index = view.list.findIndex((s) => s.spot.id === id);
    if (index >= 0) {
      listRef.current?.scrollToOffset({ offset: index * (CARD_WIDTH + 12), animated: true });
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: palette.bg }}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      <Pressable
        onPress={() => setSelectedId(undefined)}
        accessible={false}
        style={{ position: 'absolute', left: 0, top: 0, width, height: mapHeight }}
      >
        <CityMap width={width} height={mapHeight} />
      </Pressable>

      {/* Featured marker drawn last so its label sits on top. */}
      {[...view.all]
        .sort((a, b) => Number(a.spot.id === featuredId) - Number(b.spot.id === featuredId))
        .map((item) => {
          const p = project(item.spot.x, item.spot.y);
          return (
            <SpotMarker
              key={item.spot.id}
              item={item}
              x={p.x}
              y={p.y}
              featured={item.spot.id === featuredId}
              onPress={() => pressMarker(item.spot.id)}
            />
          );
        })}

      <TopBar
        top={insets.top + 8}
        city={city.name}
        chip={chip}
        alerts={alerts}
        filter={filter}
        onFilter={changeFilter}
        onSearch={() => {
          tap();
          router.push('/search');
        }}
        onAlerts={() => {
          tap();
          onOpenAlerts();
        }}
      />

      <Legend top={sheetTop - 46} />

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <SpotSheet
          ref={listRef}
          title={view.title}
          subtitle={view.subtitle}
          items={view.list}
          selectedId={selectedId}
          onPressSpot={openSpot}
          onSort={() => changeFilter(filter === 'popular' ? 'quiet' : 'popular')}
        />
      </View>
    </View>
  );
}

/** Colour key for the markers. */
function Legend({ top }: { top: number }) {
  const { palette } = useTheme();
  const dot = (color: string, label: string) => (
    <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: palette.text2 }}>{label}</Text>
    </View>
  );
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        top,
        height: 30,
        paddingHorizontal: 10,
        borderRadius: radius.md,
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.line,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {dot(palette.quiet, 'Quiet')}
      {dot(palette.moderate, 'Moderate')}
      {dot(palette.busy, 'Busy')}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View
          style={{
            width: 8,
            height: 8,
            transform: [{ rotate: '45deg' }],
            borderWidth: 1.5,
            borderColor: palette.gem,
          }}
        />
        <Text style={{ fontFamily: fonts.body, fontSize: 11, color: palette.text2 }}>Gem</Text>
      </View>
    </View>
  );
}
