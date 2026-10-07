import { lisbon, lisbonDetails, lisbonSpots, type Spot, type SpotDetails } from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSaved } from '@/state/SavedProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { comingSoon } from '@/ui/comingSoon';
import { tap } from '@/ui/haptics';
import {
  BackIcon,
  BookmarkIcon,
  CameraIcon,
  CheckInIcon,
  DirectionsIcon,
  PhotoIcon,
  ShareIcon,
  StarIcon,
} from '@/ui/icons';
import { coverPhoto } from '@/ui/photos';
import {
  AccessSection,
  CrowdSection,
  ReviewsSection,
  ShotsSection,
  StatusCard,
  WeatherSection,
  WhenSection,
} from './sections';

const HERO = 400;

/** Everything about one spot: when to go, how busy, is it safe, how to get there. */
export function SpotScreen({ id }: { id: string }) {
  const spot = lisbonSpots.find((s) => s.id === id);
  const details = lisbonDetails[id];
  if (!spot || !details) return <NotFound />;
  return <SpotPage spot={spot} details={details} />;
}

function SpotPage({ spot, details }: { spot: Spot; details: SpotDetails }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { palette } = useTheme();
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(spot.id);

  const openDirections = () => {
    tap();
    const { lat, lng } = details;
    const url =
      Platform.OS === 'ios'
        ? `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=r`
        : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Hero photograph */}
        <View style={{ height: HERO }}>
          <Image
            source={coverPhoto(spot.id)}
            style={{ width: '100%', height: HERO }}
            resizeMode="cover"
            accessibilityLabel={`Photo of ${spot.name}`}
          />
          <Svg
            width="100%"
            height={120}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
          >
            <Defs>
              <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={palette.bg} stopOpacity={0} />
                <Stop offset="1" stopColor={palette.bg} stopOpacity={0.85} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#fade)" />
          </Svg>
          <Viewfinder top={insets.top + 60} bottom={100} />

          <View
            style={{
              position: 'absolute',
              top: insets.top + 6,
              left: 16,
              right: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <RoundButton label="Back" onPress={() => router.back()}>
              <BackIcon size={20} color="#F2EFE9" strokeWidth={2} />
            </RoundButton>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <RoundButton
                label="Share spot"
                onPress={() => {
                  tap();
                  Share.share({
                    message: `${spot.name}, ${spot.area}: https://maps.apple.com/?ll=${details.lat},${details.lng}`,
                  }).catch(() => {});
                }}
              >
                <ShareIcon size={20} color="#F2EFE9" />
              </RoundButton>
              <RoundButton
                label={saved ? 'Remove from saved' : 'Save spot'}
                onPress={() => {
                  tap();
                  toggle(spot.id);
                }}
              >
                <BookmarkIcon size={20} color={saved ? '#FFB547' : '#F2EFE9'} />
              </RoundButton>
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <HeroChip label={details.category} />
              {spot.rating >= 4.8 && <HeroChip gold label="Popular" />}
            </View>
            <HeroChip
              icon={<PhotoIcon size={14} color="#F2EFE9" strokeWidth={2} />}
              label={`1 / ${details.photoCount}`}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 22 }}>
          {/* Title */}
          <View style={{ gap: 8 }}>
            <Text
              accessibilityRole="header"
              style={{ fontFamily: fonts.displayHeavy, fontSize: 28, lineHeight: 32, color: palette.text }}
            >
              {spot.name}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 14, color: palette.text2 }}>
              {spot.area}, {lisbon.name} · Portugal
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <StarIcon size={16} color={palette.accent} />
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: palette.text }}>
                  {spot.rating.toFixed(1)}
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: palette.text2 }}>
                {details.ratingsCount.toLocaleString('en-GB')} ratings
              </Text>
            </View>
          </View>

          <StatusCard spot={spot} details={details} />

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Action primary label="Directions" onPress={openDirections}>
              <DirectionsIcon size={22} color={palette.onAccent} strokeWidth={2} />
            </Action>
            <Action label="I’m here" onPress={() => comingSoon('Checking in', 8)}>
              <CheckInIcon size={22} color={palette.text} />
            </Action>
            <Action label="Rate" onPress={() => comingSoon('Rating', 9)}>
              <StarIcon size={22} color={palette.text} />
            </Action>
            <Action label="Photos" onPress={() => comingSoon('The photo gallery', 9)}>
              <CameraIcon size={22} color={palette.text} />
            </Action>
          </View>

          <CrowdSection spot={spot} details={details} />
          <WhenSection spot={spot} details={details} />
          <WeatherSection spot={spot} details={details} />
          <AccessSection details={details} />
          <ShotsSection spot={spot} details={details} />
          <ReviewsSection details={details} />
        </View>
      </ScrollView>
    </View>
  );
}

function NotFound() {
  const router = useRouter();
  const { palette } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: palette.bg, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontFamily: fonts.display, fontSize: 20, color: palette.text }}>Spot not found</Text>
      <Pressable onPress={() => router.back()} accessibilityRole="button">
        <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: palette.accentText }}>Go back</Text>
      </Pressable>
    </View>
  );
}

/** Amber viewfinder corners over the photograph. */
function Viewfinder({ top, bottom }: { top: number; bottom: number }) {
  const c = { position: 'absolute' as const, width: 22, height: 22, borderColor: '#FFB547' };
  return (
    <View style={{ position: 'absolute', left: 20, right: 20, top, bottom, pointerEvents: 'none' }}>
      <View style={[c, { left: 0, top: 0, borderTopWidth: 2.5, borderLeftWidth: 2.5 }]} />
      <View style={[c, { right: 0, top: 0, borderTopWidth: 2.5, borderRightWidth: 2.5 }]} />
      <View style={[c, { left: 0, bottom: 0, borderBottomWidth: 2.5, borderLeftWidth: 2.5 }]} />
      <View style={[c, { right: 0, bottom: 0, borderBottomWidth: 2.5, borderRightWidth: 2.5 }]} />
    </View>
  );
}

/** Dark translucent circle over a photo: always light icons, in both themes. */
function RoundButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(11,12,15,0.62)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Pressable>
  );
}

function HeroChip({ label, icon, gold }: { label: string; icon?: ReactNode; gold?: boolean }) {
  return (
    <View
      style={{
        height: 28,
        paddingHorizontal: 10,
        borderRadius: radius.sm,
        backgroundColor: gold ? 'rgba(255,181,71,0.2)' : 'rgba(11,12,15,0.7)',
        borderWidth: gold ? 1 : 0,
        borderColor: 'rgba(255,181,71,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon}
      <Text style={{ fontFamily: fonts.bodySemi, fontSize: 12, color: gold ? '#FFD08A' : '#F2EFE9' }}>
        {label}
      </Text>
    </View>
  );
}

function Action({
  label,
  primary,
  onPress,
  children,
}: {
  label: string;
  primary?: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        flex: 1,
        height: 76,
        borderRadius: radius.xl,
        backgroundColor: primary ? palette.accent : palette.surface,
        borderWidth: primary ? 0 : 1,
        borderColor: palette.line,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {children}
      <Text
        style={{
          fontFamily: primary ? fonts.bodyBold : fonts.bodySemi,
          fontSize: 12,
          color: primary ? palette.onAccent : palette.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
