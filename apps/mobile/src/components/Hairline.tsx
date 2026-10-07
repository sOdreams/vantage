import { hairline } from '@vantage/tokens';
import { View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

/** A 1px rule. The app uses these instead of cards, borders and shadows. */
export function Hairline({ inset = 0 }: { inset?: number }) {
  const { palette } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ height: hairline, backgroundColor: palette.rule, marginHorizontal: inset }}
    />
  );
}
