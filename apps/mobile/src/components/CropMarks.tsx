import { View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

const LEN = 14;

/**
 * Printer's crop marks at the four corners of the parent.
 * The parent must be position: relative (the default in React Native).
 */
export function CropMarks({ inset = 0 }: { inset?: number }) {
  const { palette } = useTheme();
  const line = (style: ViewStyle) => (
    <View style={[{ position: 'absolute', backgroundColor: palette.label, pointerEvents: 'none' }, style]} />
  );
  const o = inset;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none' }}
    >
      {line({ top: o, left: o, width: LEN, height: 1 })}
      {line({ top: o, left: o, width: 1, height: LEN })}
      {line({ top: o, right: o, width: LEN, height: 1 })}
      {line({ top: o, right: o, width: 1, height: LEN })}
      {line({ bottom: o, left: o, width: LEN, height: 1 })}
      {line({ bottom: o, left: o, width: 1, height: LEN })}
      {line({ bottom: o, right: o, width: LEN, height: 1 })}
      {line({ bottom: o, right: o, width: 1, height: LEN })}
    </View>
  );
}
