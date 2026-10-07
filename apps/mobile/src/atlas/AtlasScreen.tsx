import {
  crowdWords,
  daySentence,
  formatDay,
  type Lens,
  leadFor,
  lisbon,
  lisbonNotice,
  lisbonSpots,
  markStyle,
  spotLight,
} from '@vantage/core';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { AtlasFooter, Masthead, NoticeLine } from './AtlasChrome';
import { CityPlate } from './CityPlate';
import { SpotMark } from './SpotMark';
import { usePlateFrame } from './usePlateFrame';

/** Re-render every 30 seconds so countdowns stay true. */
function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const tap = () => Haptics.selectionAsync().catch(() => {});

/**
 * The Atlas: the city as a quiet plate, seven numbered spots, one lens at a time.
 * Layer 1 (ambient) is the plate; layer 2 (lens) adds one kind of data to the
 * marks; layer 3 (the plate view of a spot) arrives on Day 3.
 */
export function AtlasScreen() {
  const insets = useSafeAreaInsets();
  const frame = usePlateFrame();
  const { palette } = useTheme();
  const now = useNow();

  const [lens, setLens] = useState<Lens>('light');
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const city = lisbon;
  const rows = useMemo(() => spotLight(lisbonSpots, now, city), [now, city]);
  const lead = leadFor(rows, lens, now, city, selectedId);
  const sentence = daySentence(now, city);
  const caption = `${formatDay(now, city.timeZone)} · ${city.lat.toFixed(2)}° N`;

  const changeLens = (next: Lens) => {
    if (next === lens) return;
    tap();
    setLens(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.ground }}>
      {/* Tapping empty map clears the selection. */}
      <Pressable
        onPress={() => setSelectedId(undefined)}
        accessible={false}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <CityPlate width={frame.width} height={frame.height} />
      </Pressable>

      {rows.map((row) => {
        const p = frame.project(row.spot.x, row.spot.y);
        const s = row.spot;
        return (
          <SpotMark
            key={s.id}
            spot={s}
            style={markStyle(row, lens, city)}
            x={p.x}
            y={p.y}
            selected={s.id === selectedId}
            accessibilityLabel={`${s.id}, ${s.name}, ${crowdWords[s.crowd].toLowerCase()} now${
              s.risk ? `, warning: ${s.risk}` : ''
            }`}
            onPress={() => {
              tap();
              setSelectedId(s.id === selectedId ? undefined : s.id);
            }}
          />
        );
      })}

      <Masthead top={insets.top + 1} caption={caption} city={city.name} sentence={sentence} />

      {lens !== 'safety' && (
        <NoticeLine
          top={insets.top + 107}
          text={lisbonNotice.text}
          onPress={() => {
            tap();
            setLens('safety');
            setSelectedId(undefined);
          }}
        />
      )}

      <AtlasFooter
        bottom={Math.max(insets.bottom, 18)}
        lens={lens}
        lead={lead}
        onLens={changeLens}
      />
    </View>
  );
}
