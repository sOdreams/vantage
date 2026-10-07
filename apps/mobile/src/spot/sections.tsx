import {
  assessWeather,
  bestWindowText,
  crowdHours,
  crowdInsight,
  crowdLabel,
  dayTimeline,
  formatTime,
  lisbon,
  minutesUntil,
  nextLightWindow,
  type Route,
  type Spot,
  type SpotDetails,
} from '@vantage/core';
import { fonts, radius } from '@vantage/tokens';
import { type ReactNode, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { crowdColor, crowdTextColor } from '@/explore/Markers';
import { useNow } from '@/hooks/useNow';
import { useTheme } from '@/theme/ThemeProvider';
import { comingSoon } from '@/ui/comingSoon';
import { tap } from '@/ui/haptics';
import {
  BusIcon,
  CameraIcon,
  ChevronIcon,
  CommentIcon,
  EyeIcon,
  FerryIcon,
  RainIcon,
  ShieldIcon,
  SunIcon,
  SunsetIcon,
  ThumbIcon,
  TramIcon,
  WalkIcon,
  WarningIcon,
  WindIcon,
} from '@/ui/icons';
import { Caption, OutlineButton, Section, Segmented } from '@/ui/kit';
import { communityShots } from '@/ui/photos';

const city = lisbon;

type Props = { spot: Spot; details: SpotDetails };

function Body({ children, color }: { children: ReactNode; color?: string }) {
  const { palette } = useTheme();
  return (
    <Text style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 21, color: color ?? palette.text2 }}>
      {children}
    </Text>
  );
}

/* ───────────────────────── Status ───────────────────────── */

/** Green "open" card, or a red closure card with the reports behind it. */
export function StatusCard({ spot, details }: Props) {
  const { palette } = useTheme();
  const [notify, setNotify] = useState(false);
  const closed = Boolean(spot.closure);
  const fg = closed ? palette.busyText : palette.okText;

  return (
    <View
      style={{
        padding: 14,
        borderRadius: radius.xl,
        backgroundColor: closed ? palette.riskBg : palette.okBg,
        borderWidth: 1,
        borderColor: closed ? palette.riskBorder : palette.okBorder,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: closed ? palette.busy : palette.ok,
          }}
        />
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: fg }}>{details.status.title}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.text2 }}>
            {details.status.note}
          </Text>
        </View>
        {!closed && <ChevronIcon size={18} color={palette.text2} strokeWidth={2} />}
      </View>

      {details.status.reports && (
        <View style={{ gap: 6, paddingLeft: 22 }}>
          {details.status.reports.map((r) => (
            <View key={`${r.when}-${r.text}`} style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: palette.text2, width: 70 }}>
                {r.when}
              </Text>
              <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: palette.text }}>
                {r.text}
              </Text>
            </View>
          ))}
        </View>
      )}

      {closed && (
        <Pressable
          onPress={() => {
            tap();
            setNotify((n) => !n);
          }}
          accessibilityRole="button"
          style={{
            height: 44,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: palette.riskBorder,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: palette.text }}>
            {notify ? 'We’ll tell you when it reopens ✓' : 'Notify me when it reopens'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

/* ───────────────────────── Crowd ───────────────────────── */

/** "How busy is it": the Google-style hourly bars, with now highlighted. */
export function CrowdSection({ spot, details }: Props) {
  const { palette } = useTheme();
  const now = useNow();
  const insight = crowdInsight(spot, details.typicalCrowd, now, city);
  const hours = crowdHours(details.typicalCrowd.length);
  const max = Math.max(...details.typicalCrowd, 1);
  const color = crowdColor(palette, spot.crowd);
  const live = [15, 50, 85][spot.crowd] ?? 0;

  return (
    <Section
      label="How busy is it"
      right={
        <View
          style={{
            height: 24,
            paddingHorizontal: 8,
            borderRadius: radius.sm,
            backgroundColor: palette.riskBg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: palette.busy }} />
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, color: palette.busyText }}>
            LIVE
          </Text>
        </View>
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 10 }}>
        <Text style={{ fontFamily: fonts.displayHeavy, fontSize: 32, color: crowdTextColor(palette, spot.crowd) }}>
          {crowdLabel[spot.crowd]}
        </Text>
        <Text style={{ fontFamily: fonts.bodySemi, fontSize: 16, color: palette.text }}>
          ~{spot.people} people
        </Text>
      </View>
      <Body>
        {insight.comparison}
        {insight.quieterAfter !== undefined && (
          <Text style={{ fontFamily: fonts.bodySemi, color: palette.quietText }}>
            {' '}
            Quieter after {insight.quieterAfter}:00.
          </Text>
        )}
      </Body>

      <View
        style={{ height: 104, flexDirection: 'row', alignItems: 'flex-end', gap: 4, paddingTop: 18 }}
        accessibilityLabel={`Typical busyness by hour. Now: ${crowdLabel[spot.crowd]}.`}
      >
        {details.typicalCrowd.map((v, i) => {
          const isNow = i === insight.nowIndex;
          const quiet = insight.quietIndexes.includes(i);
          const future = insight.nowIndex >= 0 && i > insight.nowIndex;
          const bg = isNow ? color : quiet ? palette.blueBg : future ? palette.line : palette.raised;
          return (
            <View
              key={hours[i]}
              style={{
                flex: 1,
                height: Math.max(5, (Math.max(v, isNow ? live : 0) / max) * 86),
                borderRadius: 3,
                backgroundColor: bg,
                borderWidth: quiet && !isNow ? 1 : 0,
                borderColor: palette.blueBorder,
              }}
            >
              {isNow && (
                <>
                  <View
                    style={{
                      position: 'absolute',
                      left: -3,
                      right: -3,
                      bottom: (v / max) * 86,
                      height: 2,
                      backgroundColor: palette.text,
                    }}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      top: -18,
                      left: -8,
                      right: -8,
                      textAlign: 'center',
                      fontFamily: fonts.monoMedium,
                      fontSize: 10,
                      color: palette.busyText,
                    }}
                  >
                    NOW
                  </Text>
                </>
              )}
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 4, marginTop: -8 }}>
        {hours.map((h, i) => (
          <Text
            key={h}
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: fonts.mono,
              fontSize: 10,
              color: i === insight.nowIndex ? palette.busyText : palette.text2,
            }}
          >
            {h % 3 === 1 || i === insight.nowIndex ? h : ''}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 14 }}>
        <Legend swatch={<View style={{ width: 10, height: 2, backgroundColor: palette.text }} />} label="Usual now" />
        <Legend
          swatch={
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                backgroundColor: palette.blueBg,
                borderWidth: 1,
                borderColor: palette.blueBorder,
              }}
            />
          }
          label="Quiet window"
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: palette.line,
        }}
      >
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: palette.text2 }}>
          Sample data. Live check-ins blended with typical patterns arrive on Day 8.
        </Text>
        <Pressable
          onPress={() => comingSoon('Reporting crowds', 8)}
          accessibilityRole="button"
          style={{
            height: 40,
            paddingHorizontal: 12,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: palette.line,
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 13, color: palette.text }}>Report crowd</Text>
        </Pressable>
      </View>
    </Section>
  );
}

function Legend({ swatch, label }: { swatch: ReactNode; label: string }) {
  const { palette } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      {swatch}
      <Text style={{ fontFamily: fonts.body, fontSize: 11, color: palette.text2 }}>{label}</Text>
    </View>
  );
}

/* ───────────────────────── When to shoot ───────────────────────── */

const DAY = 24 * 60 * 60_000;

/** "When to shoot": a light timeline for today or tomorrow, from the real sun. */
export function WhenSection({ spot, details }: Props) {
  const { palette } = useTheme();
  const now = useNow();
  const [day, setDay] = useState<'today' | 'tomorrow'>('today');
  const ref = day === 'today' ? now : new Date(now.getTime() + DAY);
  const tl = dayTimeline(ref, city);
  const [width, setWidth] = useState(0);

  const best = nextLightWindow(spot.light, ref, city);
  const blue = nextLightWindow('blue-hour', ref, city);
  const mins = minutesUntil(best.start, now);
  const bestNote = best.active
    ? `Until ${formatTime(best.end, city.timeZone)}`
    : day === 'today' && mins < 180
      ? `Starts in ${mins} min`
      : day === 'today'
        ? 'Later today'
        : 'Tomorrow';
  const label: Record<Spot['light'], string> = {
    'golden-evening': 'Golden hour',
    'blue-hour': 'Blue hour',
    sunrise: 'Sunrise',
    morning: 'Morning light',
  };
  const segColor = {
    day: palette.line,
    golden: palette.accent,
    blue: palette.blueHour,
    night: palette.night,
  } as const;

  return (
    <Section
      label="When to shoot"
      right={
        <Segmented
          style={{ height: 36, width: 170 }}
          options={[
            { value: 'today', label: 'Today' },
            { value: 'tomorrow', label: 'Tomorrow' },
          ]}
          value={day}
          onChange={(v) => {
            tap();
            setDay(v);
          }}
        />
      }
    >
      <View style={{ gap: 6, marginTop: 22 }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        <View style={{ height: 44, borderRadius: 12, overflow: 'hidden', flexDirection: 'row' }}>
          {tl.segments.map((s) => (
            <View
              key={s.kind}
              style={{
                width: (s.to - s.from) * width,
                backgroundColor: segColor[s.kind],
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {s.kind === 'golden' && (s.to - s.from) * width > 26 && (
                <SunsetIcon size={18} color={palette.onAccent} strokeWidth={2} />
              )}
              {(s.kind === 'day' || s.kind === 'night') && (s.to - s.from) * width > 60 && (
                <Text
                  style={{
                    fontFamily: fonts.bodySemi,
                    fontSize: 11,
                    color: s.kind === 'night' ? palette.onNight : palette.text2,
                  }}
                >
                  {s.kind === 'day' ? 'Daylight' : 'Night'}
                </Text>
              )}
            </View>
          ))}
        </View>
        {day === 'today' && tl.nowAt !== undefined && (
          <>
            <View
              style={{
                position: 'absolute',
                left: tl.nowAt * width - 1,
                top: 0,
                width: 2,
                height: 44,
                backgroundColor: palette.text,
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: Math.min(Math.max(tl.nowAt * width - 20, 0), width - 40),
                top: -22,
                height: 18,
                paddingHorizontal: 6,
                borderRadius: 6,
                backgroundColor: palette.selectedBg,
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: fonts.monoMedium, fontSize: 10, color: palette.selectedText }}>
                {formatTime(now, city.timeZone)}
              </Text>
            </View>
          </>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {tl.ticks.map((t) => (
            <Text key={t.label} style={{ fontFamily: fonts.mono, fontSize: 10, color: palette.text2 }}>
              {t.label}
            </Text>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <WindowCard
          kicker="BEST HERE"
          title={label[spot.light]}
          range={bestWindowText(best, ref, city).replace(/^Best (now until |tomorrow )?/, '')}
          note={bestNote}
          tone="gold"
        />
        {spot.light !== 'blue-hour' ? (
          <WindowCard
            kicker="ALSO GOOD"
            title="Blue hour"
            range={`${formatTime(blue.start, city.timeZone)}–${formatTime(blue.end, city.timeZone)}`}
            note="City lights come on"
            tone="blue"
          />
        ) : (
          <WindowCard
            kicker="ALSO GOOD"
            title="Golden hour"
            range={bestWindowText(nextLightWindow('golden-evening', ref, city), ref, city).replace(
              /^Best (now until |tomorrow )?/,
              '',
            )}
            note="Warm light on the square"
            tone="gold"
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'flex-start',
          padding: 12,
          borderRadius: 14,
          backgroundColor: palette.raised,
        }}
      >
        <CameraIcon size={18} color={palette.accent} />
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.text2 }}>
          {details.shotTip}
        </Text>
      </View>
    </Section>
  );
}

function WindowCard({
  kicker,
  title,
  range,
  note,
  tone,
}: {
  kicker: string;
  title: string;
  range: string;
  note: string;
  tone: 'gold' | 'blue';
}) {
  const { palette } = useTheme();
  const gold = tone === 'gold';
  return (
    <View
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 14,
        backgroundColor: gold ? palette.goldBg : palette.blueBg,
        borderWidth: 1,
        borderColor: gold ? palette.goldBorder : palette.blueBorder,
        gap: 4,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.bodyBold,
          fontSize: 11,
          letterSpacing: 0.5,
          color: gold ? palette.goldText : palette.blueHourText,
        }}
      >
        {kicker}
      </Text>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 15, color: palette.text }}>{title}</Text>
      <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: gold ? palette.goldText : palette.blueHourText }}>
        {range}
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>{note}</Text>
    </View>
  );
}

/* ───────────────────────── Weather & safety ───────────────────────── */

/** Weather risk, with a plain go / careful / skip call at the top. */
export function WeatherSection({ details }: Props) {
  const { palette } = useTheme();
  const w = details.weather;
  const a = assessWeather(w);
  const panel = {
    safe: { bg: palette.okBg, border: palette.okBorder, fg: palette.okText, icon: palette.ok },
    caution: {
      bg: palette.cautionBg,
      border: palette.cautionBorder,
      fg: palette.moderateText,
      icon: palette.moderate,
    },
    risky: { bg: palette.riskBg, border: palette.riskBorder, fg: palette.busyText, icon: palette.busy },
  }[a.risk];

  return (
    <Section
      label="Weather & safety"
      right={
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>Sample forecast</Text>
      }
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 14,
          borderRadius: 14,
          backgroundColor: panel.bg,
          borderWidth: 1,
          borderColor: panel.border,
        }}
      >
        {a.risk === 'safe' ? (
          <ShieldIcon size={28} color={panel.icon} />
        ) : (
          <WarningIcon size={28} color={panel.icon} strokeWidth={2} />
        )}
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: panel.fg }}>{a.headline}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.text2 }}>
            {a.reasons.length > 0 ? a.reasons.join(' · ') : 'Good shooting conditions this evening'}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Tile icon={<SunIcon size={22} color={palette.moderateText} />} value={`${w.tempC}°`} note={`${w.condition}, feels ${w.feelsC}°`} />
        <Tile icon={<WindIcon size={22} color={palette.text2} />} value={`${w.windKmh} km/h`} note={`Gusts ${w.gustKmh}`} />
        <Tile icon={<RainIcon size={22} color={palette.text2} />} value={`${w.rainPct}%`} note="Chance of rain" />
        <Tile
          icon={<EyeIcon size={22} color={palette.text2} />}
          value={`${w.visibilityKm} km`}
          note={`Visibility, ${w.cloudPct}% cloud`}
        />
      </View>

      {details.spotNote && (
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <WarningIcon size={18} color={palette.moderate} strokeWidth={2} />
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.text2 }}>
            <Text style={{ fontFamily: fonts.bodyBold, color: palette.moderateText }}>Spot note: </Text>
            {details.spotNote}
          </Text>
        </View>
      )}
    </Section>
  );
}

function Tile({ icon, value, note }: { icon: ReactNode; value: string; note: string }) {
  const { palette } = useTheme();
  return (
    <View
      style={{
        flexBasis: '48%',
        flexGrow: 1,
        padding: 12,
        borderRadius: 14,
        backgroundColor: palette.raised,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 16, color: palette.text }}>{value}</Text>
        <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
          {note}
        </Text>
      </View>
    </View>
  );
}

/* ───────────────────────── Access ───────────────────────── */

const routeIcon: Record<Route['mode'], typeof TramIcon> = {
  tram: TramIcon,
  bus: BusIcon,
  walk: WalkIcon,
  metro: TramIcon,
  ferry: FerryIcon,
};

/** "How to get there": routes, facts (tripod, drone, step-free) and where to stand. */
export function AccessSection({ details }: { details: SpotDetails }) {
  const { palette } = useTheme();
  return (
    <Section label="How to get there">
      <View>
        {details.routes.map((r, i) => {
          const Icon = routeIcon[r.mode];
          const first = i === 0;
          return (
            <View
              key={r.title}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 10,
                borderBottomWidth: i < details.routes.length - 1 ? 1 : 0,
                borderBottomColor: palette.line,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: first ? palette.goldBg : palette.raised,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={first ? palette.accent : palette.text} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: palette.text }}>{r.title}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>{r.note}</Text>
              </View>
              <Text style={{ fontFamily: fonts.monoMedium, fontSize: 13, color: palette.text }}>{r.minutes} min</Text>
            </View>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {details.facts.map((f) => (
          <View
            key={f.label}
            style={{
              flexBasis: '48%',
              flexGrow: 1,
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: palette.raised,
              gap: 2,
            }}
          >
            <Text style={{ fontFamily: fonts.body, fontSize: 11, color: palette.text2 }}>{f.label}</Text>
            <Text
              style={{
                fontFamily: fonts.bodySemi,
                fontSize: 14,
                color: f.tone === 'good' ? palette.okText : f.tone === 'bad' ? palette.busyText : palette.text,
              }}
            >
              {f.value}
            </Text>
          </View>
        ))}
      </View>

      {details.standHere && (
        <View
          style={{
            padding: 14,
            borderRadius: 14,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: palette.goldBorder,
            flexDirection: 'row',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <CameraIcon size={22} color={palette.accent} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: palette.text }}>Where to stand</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.text2 }}>
              {details.standHere.text}
            </Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
              Tip confirmed by {details.standHere.confirmations} photographers
            </Text>
          </View>
        </View>
      )}
    </Section>
  );
}

/* ───────────────────────── Shots & reviews ───────────────────────── */

export function ShotsSection({ spot, details }: Props) {
  const { palette } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text accessibilityRole="header" style={{ fontFamily: fonts.display, fontSize: 20, color: palette.text }}>
          Community shots
        </Text>
        <Pressable onPress={() => comingSoon('The photo gallery', 9)} accessibilityRole="button">
          <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: palette.accentText }}>
            See all {details.photoCount}
          </Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {communityShots(spot.id).map((s) => (
          <View key={s.time} style={{ flex: 1, height: 112, borderRadius: 14, overflow: 'hidden' }}>
            <Image source={s.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            <View
              style={{
                position: 'absolute',
                left: 6,
                bottom: 6,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: 'rgba(11,12,15,0.75)',
              }}
            >
              <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: '#FFD9A0' }}>{s.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const avatarColors = [
  ['#3B2A52', '#D9CCFF'],
  ['#1F3A4A', '#BFE6FF'],
  ['#3A2A1F', '#FFD9B8'],
] as const;

export function ReviewsSection({ details }: { details: SpotDetails }) {
  const { palette } = useTheme();
  return (
    <View style={{ gap: 14 }}>
      <Text accessibilityRole="header" style={{ fontFamily: fonts.display, fontSize: 20, color: palette.text }}>
        Was it worth it?
      </Text>
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontFamily: fonts.displayHeavy, fontSize: 30, color: palette.okText }}>
            {details.worthIt.pct}%{' '}
            <Text style={{ fontFamily: fonts.bodySemi, fontSize: 15, color: palette.text }}>said yes</Text>
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 13, color: palette.text2 }}>
            {details.worthIt.votes.toLocaleString('en-GB')} votes
          </Text>
        </View>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: palette.line, overflow: 'hidden' }}>
          <View style={{ width: `${details.worthIt.pct}%`, height: 8, backgroundColor: palette.ok }} />
        </View>
      </View>

      {details.reviews.map((r, i) => {
        const [bg, fg] = avatarColors[i % avatarColors.length] ?? avatarColors[0];
        return (
          <View
            key={r.name}
            style={{
              padding: 16,
              borderRadius: 18,
              backgroundColor: palette.surface,
              borderWidth: 1,
              borderColor: palette.line,
              gap: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13, color: fg }}>{r.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bodySemi, fontSize: 14, color: palette.text }}>{r.name}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: palette.text2 }}>
                  {r.daysAgo === 1 ? 'Yesterday' : `${r.daysAgo} days ago`} · {r.light}
                </Text>
              </View>
              {r.worthIt && (
                <View
                  style={{
                    height: 26,
                    paddingHorizontal: 8,
                    borderRadius: radius.sm,
                    backgroundColor: palette.okBg,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ThumbIcon size={13} color={palette.okText} strokeWidth={2} />
                  <Text style={{ fontFamily: fonts.bodySemi, fontSize: 12, color: palette.okText }}>Worth it</Text>
                </View>
              )}
            </View>
            <Body color={palette.text}>{r.text}</Body>
          </View>
        );
      })}

      <OutlineButton
        label="Rate and comment"
        icon={<CommentIcon size={18} color={palette.text} />}
        onPress={() => comingSoon('Rating', 9)}
      />
      <Caption>Sample reviews · real ones arrive with accounts</Caption>
    </View>
  );
}
