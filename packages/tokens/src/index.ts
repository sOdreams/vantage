/**
 * VANTAGE design tokens: "night viewfinder".
 *
 * Dark first, with a light theme that follows the phone. Amber is reserved for
 * the main action and golden-hour data. Crowd levels use a fixed traffic code:
 * blue quiet, yellow moderate, red busy. Hidden gems are violet diamonds.
 */

export { contrastRatio, hexToRgb, relativeLuminance } from './color';

export type ThemeName = 'dark' | 'light';

/** 'system' follows the phone's light/dark setting. */
export type ThemePreference = 'system' | ThemeName;

/** Dark is the default whenever the phone does not explicitly ask for light. */
export function resolveTheme(
  preference: ThemePreference,
  scheme: string | null | undefined,
): ThemeName {
  if (preference !== 'system') return preference;
  return scheme === 'light' ? 'light' : 'dark';
}

export type Palette = {
  /** app background behind everything */
  bg: string;
  /** map land colour */
  map: string;
  /** floating bars, sheets, the tab bar */
  surface: string;
  /** cards inside a sheet */
  raised: string;
  /** hairline borders */
  line: string;
  text: string;
  text2: string;
  /** primary action fill (the + button, selected highlights) */
  accent: string;
  /** text and icons drawn on the accent fill */
  onAccent: string;
  /** golden-hour data written in text */
  accentText: string;
  quiet: string;
  moderate: string;
  busy: string;
  quietText: string;
  moderateText: string;
  busyText: string;
  gem: string;
  /** the golden-hour chip */
  goldBg: string;
  goldBorder: string;
  goldText: string;
  /** "open", "safe to go", "worth it" */
  ok: string;
  okText: string;
  okBg: string;
  okBorder: string;
  /** closures and risky weather: tinted panels around busyText */
  riskBg: string;
  riskBorder: string;
  /** "go with care" panels around moderateText */
  cautionBg: string;
  cautionBorder: string;
  /** blue hour */
  blueHour: string;
  blueHourText: string;
  blueBg: string;
  blueBorder: string;
  /** the night part of the light timeline, and the text on it */
  night: string;
  onNight: string;
  /** a selected segment: inverted colours */
  selectedBg: string;
  selectedText: string;
};

export const palettes: Record<ThemeName, Palette> = {
  dark: {
    bg: '#0B0C0F',
    map: '#11141A',
    surface: '#15171C',
    raised: '#1D2027',
    line: '#2A2E37',
    text: '#F2EFE9',
    text2: '#A7ABB5',
    accent: '#FFB547',
    onAccent: '#1A1206',
    accentText: '#FFCB7D',
    quiet: '#5AB0FF',
    moderate: '#FFC34D',
    busy: '#FF6A5C',
    quietText: '#8CC8FF',
    moderateText: '#FFD27A',
    busyText: '#FF8F84',
    gem: '#8EA2FF',
    goldBg: '#2A2216',
    goldBorder: '#8A6630',
    goldText: '#FFCB7D',
    ok: '#6FD3A6',
    okText: '#A9EBCB',
    okBg: '#16261F',
    okBorder: '#2F5A47',
    riskBg: '#2A1A19',
    riskBorder: '#6B3029',
    cautionBg: '#2A2416',
    cautionBorder: '#6B5A2A',
    blueHour: '#6C7FE8',
    blueHourText: '#B7C3FF',
    blueBg: '#191C2E',
    blueBorder: '#3E4A8A',
    night: '#141729',
    onNight: '#A7ABB5',
    selectedBg: '#F2EFE9',
    selectedText: '#0B0C0F',
  },
  light: {
    bg: '#F3F4F6',
    map: '#E8EBEF',
    surface: '#FFFFFF',
    raised: '#F4F5F7',
    line: '#DCE0E5',
    text: '#14161A',
    text2: '#59606C',
    accent: '#FFB547',
    onAccent: '#1A1206',
    accentText: '#8A5300',
    quiet: '#2F86E0',
    moderate: '#E3A21F',
    busy: '#E5483A',
    quietText: '#1F64B0',
    moderateText: '#7A4700',
    busyText: '#B3261E',
    gem: '#5468E0',
    goldBg: '#FFF1DA',
    goldBorder: '#F0B860',
    goldText: '#7A4700',
    ok: '#1E9E6A',
    okText: '#0E6B47',
    okBg: '#E3F5EC',
    okBorder: '#9FD9BE',
    riskBg: '#FDECEA',
    riskBorder: '#F2B3AC',
    cautionBg: '#FFF5DD',
    cautionBorder: '#EBC86F',
    blueHour: '#5468E0',
    blueHourText: '#3A4BB8',
    blueBg: '#ECEFFC',
    blueBorder: '#B3BDF2',
    night: '#3B4170',
    onNight: '#FFFFFF',
    selectedBg: '#14161A',
    selectedText: '#FFFFFF',
  },
};

/** Colours for the drawn city map. Decorative. */
export type MapPalette = {
  park: string;
  block: string;
  minorRoad: string;
  majorRoad: string;
  water: string;
  waterLabel: string;
  label: string;
  route: string;
};

export const mapPalettes: Record<ThemeName, MapPalette> = {
  dark: {
    park: '#14241D',
    block: '#161B23',
    minorRoad: '#1A1F27',
    majorRoad: '#232935',
    water: '#0C1C2D',
    waterLabel: '#6F8FB5',
    label: '#80868F',
    route: '#FFB547',
  },
  light: {
    park: '#D2E4D5',
    block: '#DEE2E8',
    minorRoad: '#F7F8FA',
    majorRoad: '#FFFFFF',
    water: '#B9D3EA',
    waterLabel: '#3D6A99',
    label: '#5E6670',
    route: '#C77A00',
  },
};

/** Font family names as registered with expo-font in the app. */
export const fonts = {
  display: 'BricolageGrotesque_700Bold',
  displayHeavy: 'BricolageGrotesque_800ExtraBold',
  body: 'Geist_400Regular',
  bodyMedium: 'Geist_500Medium',
  bodySemi: 'Geist_600SemiBold',
  bodyBold: 'Geist_700Bold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
} as const;

/** 4pt spacing scale. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16,
  sheet: 24,
} as const;

/** Text tokens, the surfaces they sit on, and the WCAG minimum they must keep. */
export const contrastRequirements: {
  token: keyof Palette;
  on: keyof Palette;
  min: number;
}[] = [
  { token: 'text', on: 'surface', min: 7 },
  { token: 'text', on: 'raised', min: 7 },
  { token: 'text2', on: 'surface', min: 4.5 },
  { token: 'text2', on: 'raised', min: 4.5 },
  { token: 'accentText', on: 'surface', min: 4.5 },
  { token: 'quietText', on: 'raised', min: 4.5 },
  { token: 'moderateText', on: 'raised', min: 4.5 },
  { token: 'busyText', on: 'raised', min: 4.5 },
  { token: 'onAccent', on: 'accent', min: 4.5 },
  { token: 'goldText', on: 'goldBg', min: 4.5 },
  { token: 'okText', on: 'okBg', min: 4.5 },
  { token: 'busyText', on: 'riskBg', min: 4.5 },
  { token: 'moderateText', on: 'cautionBg', min: 4.5 },
  { token: 'blueHourText', on: 'blueBg', min: 4.5 },
  { token: 'onNight', on: 'night', min: 4.5 },
  { token: 'selectedText', on: 'selectedBg', min: 7 },
  // marker rings are graphics: 3:1 against the map
  { token: 'quiet', on: 'map', min: 3 },
  { token: 'busy', on: 'map', min: 3 },
];
