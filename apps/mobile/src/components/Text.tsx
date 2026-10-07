import { fonts, type } from '@vantage/tokens';
import type { ReactNode } from 'react';
import { Text as RNText, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'italic' | 'caption' | 'data';
type Tone = 'ink' | 'ink2' | 'label' | 'accent';

const family: Record<Variant, string> = {
  display: fonts.serifLight,
  title: fonts.serifLight,
  heading: fonts.serif,
  body: fonts.serif,
  italic: fonts.serifItalic,
  caption: fonts.mono,
  data: fonts.mono,
};

const scale: Record<Variant, (typeof type)[keyof typeof type]> = {
  display: type.display,
  title: type.title,
  heading: type.heading,
  body: type.body,
  italic: type.body,
  caption: type.caption,
  data: type.data,
};

type Props = {
  variant?: Variant;
  tone?: Tone;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  accessibilityRole?: 'header' | 'text';
};

/** The only text component in the app. Captions are always uppercase mono. */
export function Text({ variant = 'body', tone = 'ink', style, children, accessibilityRole }: Props) {
  const { palette } = useTheme();
  const s = scale[variant];
  return (
    <RNText
      accessibilityRole={accessibilityRole}
      style={[
        {
          fontFamily: family[variant],
          fontSize: s.size,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing,
          color: palette[tone],
          textTransform: variant === 'caption' ? 'uppercase' : 'none',
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
