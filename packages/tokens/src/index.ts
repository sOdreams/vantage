/**
 * VANTAGE design tokens.
 *
 * Two themes, named after where photographs are seen:
 *   - darkroom: dark mode, warm black ground, safelight red as the only accent
 *   - gallery:  light mode, paper ground, deeper red accent
 *
 * Rules the UI follows:
 *   - zero corner radius everywhere
 *   - 1px hairlines instead of cards and shadows
 *   - the accent is reserved for warnings (closures, weather risk, crowds)
 *   - Newsreader for reading, IBM Plex Mono for captions and data
 */

export { contrastRatio, hexToRgb, relativeLuminance } from './color';

export type ThemeName = 'darkroom' | 'gallery';

/** 'system' follows the phone's light/dark setting. */
export type ThemePreference = 'system' | ThemeName;

/**
 * Picks the theme to render. Darkroom is the default whenever the phone
 * does not explicitly ask for light mode.
 */
export function resolveTheme(
  preference: ThemePreference,
  scheme: string | null | undefined,
): ThemeName {
  if (preference !== 'system') return preference;
  return scheme === 'light' ? 'gallery' : 'darkroom';
}

export type Palette = {
  /** page ground */
  ground: string;
  /** primary text */
  ink: string;
  /** secondary text */
  ink2: string;
  /** map labels and quiet captions */
  label: string;
  /** hairlines and dividers (decorative, not text) */
  rule: string;
  /** the single accent, used only for warnings */
  accent: string;
};

export const palettes: Record<ThemeName, Palette> = {
  darkroom: {
    ground: '#0E0D0B',
    ink: '#ECE8DF',
    ink2: '#A29E95',
    label: '#8C877E',
    rule: '#2A2824',
    accent: '#E8553A',
  },
  gallery: {
    ground: '#F1EEE7',
    ink: '#141310',
    ink2: '#5E5A52',
    label: '#6E695F',
    rule: '#D6D1C6',
    accent: '#C2341C',
  },
};

/**
 * Colours for the city plate (the map). All decorative: they sit one or two
 * steps off the ground so the map recedes and the spots carry the screen.
 */
export type MapPalette = {
  contour: string;
  contourMajor: string;
  street: string;
  water: string;
  shore: string;
  /** de-emphasised marks (safety lens, spots without warnings) */
  dim: string;
};

export const mapPalettes: Record<ThemeName, MapPalette> = {
  darkroom: {
    contour: '#1F1D1A',
    contourMajor: '#2A2824',
    street: '#3A3732',
    water: '#090A0B',
    shore: '#33302B',
    dim: '#5C5852',
  },
  gallery: {
    contour: '#E2DDD2',
    contourMajor: '#D3CDC0',
    street: '#C8C1B3',
    water: '#E4E2DC',
    shore: '#CDC6B8',
    dim: '#B0AA9E',
  },
};

/** Font family names as registered with expo-font in the app. */
export const fonts = {
  serifLight: 'Newsreader_300Light',
  serif: 'Newsreader_400Regular',
  serifItalic: 'Newsreader_400Regular_Italic',
  serifMedium: 'Newsreader_500Medium',
  mono: 'IBMPlexMono_400Regular',
  monoItalic: 'IBMPlexMono_400Regular_Italic',
  monoMedium: 'IBMPlexMono_500Medium',
} as const;

/** Type scale in points. Display sizes are for mastheads only. */
export const type = {
  display: { size: 56, lineHeight: 58, letterSpacing: -1.2 },
  title: { size: 32, lineHeight: 36, letterSpacing: -0.5 },
  heading: { size: 22, lineHeight: 28, letterSpacing: -0.2 },
  body: { size: 17, lineHeight: 26, letterSpacing: 0 },
  caption: { size: 11, lineHeight: 16, letterSpacing: 1.1 },
  data: { size: 13, lineHeight: 18, letterSpacing: 0.2 },
} as const;

/** 4pt spacing scale. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 72,
} as const;

export const hairline = 1;
export const radius = 0;

/** Text tokens and the minimum WCAG contrast each must keep on the ground. */
export const contrastRequirements: Record<'ink' | 'ink2' | 'label' | 'accent', number> = {
  ink: 7,
  ink2: 4.5,
  label: 4.5,
  accent: 4.5,
};
