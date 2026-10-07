import { fonts } from '@vantage/tokens';
import type { TextStyle } from 'react-native';

/** Mono caption: uppercase, tracked out. `size` in points. */
export function mono(size: number, tracking = 0.12): TextStyle {
  return {
    fontFamily: fonts.mono,
    fontSize: size,
    letterSpacing: size * tracking,
    textTransform: 'uppercase',
  };
}

export const serif: TextStyle = { fontFamily: fonts.serif };
export const serifItalic: TextStyle = { fontFamily: fonts.serifItalic };
export const serifLight: TextStyle = { fontFamily: fonts.serifLight };

/** Minimum touch target, per Apple's Human Interface Guidelines. */
export const TOUCH = 44;
