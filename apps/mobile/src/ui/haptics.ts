import * as Haptics from 'expo-haptics';

/** A light tick for selections and taps. Never throws. */
export const tap = () => {
  Haptics.selectionAsync().catch(() => {});
};
